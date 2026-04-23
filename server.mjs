import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import webpush from 'web-push';
import {
  handleGoogleLogin, handleGoogleCallback,
  handleFacebookLogin, handleFacebookCallback,
  handleAppleLogin, handleAppleCallback,
  handleLogout, handleApiMe,
} from './app/auth.mjs';
import { initDb } from './app/db.mjs';
import { handleAiAdvisorMessage } from './app/ai-advisor.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = join(__dirname, 'dist');
const port = parseInt(process.env.PORT || '3000', 10);
const defaultPrimarySiteUrl = 'https://www.kamnuanlek.com';
let primarySiteUrl;
try {
  primarySiteUrl = new URL(process.env.PUBLIC_SITE_URL || defaultPrimarySiteUrl);
} catch {
  primarySiteUrl = new URL(defaultPrimarySiteUrl);
}
const primaryHost = primarySiteUrl.hostname.toLowerCase();
const apexHost = primaryHost.startsWith('www.') ? primaryHost.slice(4) : primaryHost;
// Only redirect apex → www. Railway internal domains are excluded intentionally:
// Railway's healthcheck hits the service using its own domain and does NOT follow
// 301 redirects — including those domains in redirectHosts causes healthcheck failure.
const redirectHosts = new Set(
  [apexHost]
    .filter(Boolean)
    .map((host) => String(host).toLowerCase())
);

async function loadReleaseMetadata() {
  const releaseMetadataFile = join(distDir, '__release.json');
  try {
    const raw = await readFile(releaseMetadataFile, 'utf-8');
    const data = JSON.parse(raw);
    return Object.freeze({
      gitCommit: data.gitCommit || 'unknown',
      deploymentId: process.env.RAILWAY_DEPLOYMENT_ID || null,
      generatedAt: data.timestamp || new Date().toISOString(),
    });
  } catch (error) {
    console.warn(`[release-metadata] Failed to load ${releaseMetadataFile}, falling back to env vars:`, error.message);
    return Object.freeze({
      gitCommit:
        process.env.RAILWAY_GIT_COMMIT_SHA ||
        process.env.SOURCE_COMMIT ||
        process.env.GITHUB_SHA ||
        'unknown',
      deploymentId: process.env.RAILWAY_DEPLOYMENT_ID || null,
      generatedAt: new Date().toISOString(),
    });
  }
}

let releaseMetadata = Object.freeze({
  gitCommit: 'loading...',
  deploymentId: null,
  generatedAt: new Date().toISOString(),
});

// ── Web Push configuration ────────────────────────────────────
const VAPID_PUBLIC_KEY = 'BOWqVZd05Ge2s0KqqynLV_xGFxtwgq6pT7XhhgjCYCNge4xVni_OZ8HrkFxsNnd9m4Stjipf5K0dCyRZaHkn7cw';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'gprQSYiSxVDck5s28oOrEFuSP-BBB-6yF5EhAuRGA6A';
webpush.setVapidDetails('mailto:hello@kamnuanlek.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// In-memory subscription store (survives server session, cleared on redeploy)
// Subscribers who revisit re-register automatically via SW
const pushSubscriptions = new Map(); // endpoint → subscription object
const SUBS_FILE = join(__dirname, '..', 'tmp', 'push-subscriptions.json');

async function loadSubscriptions() {
  try {
    const raw = await readFile(SUBS_FILE, 'utf-8');
    const arr = JSON.parse(raw);
    for (const sub of arr) {
      if (sub?.endpoint) pushSubscriptions.set(sub.endpoint, sub);
    }
  } catch {
    // File doesn't exist yet — fine
  }
}

async function saveSubscriptions() {
  try {
    await mkdir(join(__dirname, '..', 'tmp'), { recursive: true });
    await writeFile(SUBS_FILE, JSON.stringify([...pushSubscriptions.values()]), 'utf-8');
  } catch {
    // Non-fatal — in-memory store still works for current session
  }
}

async function sendPushToAll(payload) {
  const subs = [...pushSubscriptions.values()];
  let sent = 0, failed = 0;
  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub, JSON.stringify(payload));
      sent++;
    } catch (err) {
      failed++;
      // 410 Gone = subscription expired/revoked — remove it
      if (err.statusCode === 410) {
        pushSubscriptions.delete(sub.endpoint);
      }
    }
  }
  if (sent + failed > 0) {
    await saveSubscriptions();
  }
  return { sent, failed, total: subs.length };
}

// ── Automated notification scheduler ─────────────────────────
// Fires every hour, checks if a scheduled notification should go out.
// Schedule: 25th of month 9am, Mon-Fri weekly tip 8am, tax season (Jan-Mar) daily
function getScheduledNotification() {
  const now = new Date();
  const bkk = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  const hour = bkk.getHours();
  const day = bkk.getDate();
  const month = bkk.getMonth() + 1; // 1-12
  const weekday = bkk.getDay(); // 0=Sun

  // Salary day reminder — 25th of each month at 9am BKK
  if (day === 25 && hour === 9) {
    return {
      title: 'เงินเดือนออกแล้ว! 💰',
      body: 'วางแผนการเงินเดือนนี้ใน 2 นาที — คำนวณภาษี ออม ลงทุน',
      url: '/คำนวณเงินเดือนสุทธิ/',
      tag: 'salary-day',
    };
  }

  // Tax season (Jan-Mar) — reminder every Monday 8am
  if (month >= 1 && month <= 3 && weekday === 1 && hour === 8) {
    const deadline = new Date(bkk.getFullYear(), 2, 31); // March 31
    const daysLeft = Math.ceil((deadline - bkk) / (1000 * 60 * 60 * 24));
    return {
      title: `ยื่นภาษีเหลืออีก ${daysLeft} วัน ⚠️`,
      body: 'คำนวณภาษีเงินได้ของคุณก่อนถึงกำหนด 31 มีนาคม',
      url: '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
      tag: 'tax-deadline',
    };
  }

  // Weekly Monday tip — 8am BKK (outside tax season)
  if (weekday === 1 && hour === 8 && (month < 1 || month > 3)) {
    const tips = [
      { body: 'เช็คดอกเบี้ยเงินฝากปัจจุบัน — ฝากที่ไหนดีกว่า?', url: '/คำนวณดอกเบี้ยเงินฝาก/', tag: 'weekly-tip' },
      { body: 'คำนวณ NPV ก่อนตัดสินใจลงทุน — ใช้เวลา 1 นาที', url: '/คำนวณ-npv-มูลค่าปัจจุบันสุทธิ/', tag: 'weekly-tip' },
      { body: 'รู้หรือไม่? คุณสามารถลดหย่อนภาษีได้ถึง 300,000 บาท', url: '/คำนวณภาษีเงินได้บุคคลธรรมดา/', tag: 'weekly-tip' },
      { body: 'ผ่อนกู้บ้าน/รถ — ลองคำนวณดอกเบี้ยที่จ่ายจริงตลอดสัญญา', url: '/คำนวณผ่อนกู้/', tag: 'weekly-tip' },
    ];
    const tip = tips[bkk.getWeek() % tips.length] || tips[0];
    return { title: 'เคล็ดลับการเงินประจำสัปดาห์ 📊', ...tip };
  }

  return null;
}

// Patch Date for getWeek helper
Date.prototype.getWeek = function() {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// Run scheduler every hour
setInterval(async () => {
  if (pushSubscriptions.size === 0) return;
  const notification = getScheduledNotification();
  if (notification) {
    await sendPushToAll(notification);
  }
}, 60 * 60 * 1000);

// Load persisted subscriptions on startup
loadSubscriptions();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json',
};

// Generate ETag from file content (simple hash)
function generateETag(data) {
  const hash = createHash('md5').update(data).digest('hex');
  return `"${hash}"`;
}

// Permanent 301 redirects served at the HTTP layer (before file serving).
// Covers English calculator routes migrated to Thai-slug URLs and sitemap alias.
const permanentRedirects = new Map([
  // New /en/calculators/* routes (CAL-1062 emergency fix)
  ['/en/calculators/mortgage/', '/คำนวณผ่อนบ้าน/'],
  ['/en/calculators/mortgage', '/คำนวณผ่อนบ้าน/'],
  ['/en/calculators/bmi/', '/คำนวณ-bmi/'],
  ['/en/calculators/bmi', '/คำนวณ-bmi/'],
  ['/en/calculators/apr/', '/คำนวณ-apr/'],
  ['/en/calculators/apr', '/คำนวณ-apr/'],
  ['/en/calculators/loan-payment/', '/คำนวณผ่อนกู้/'],
  ['/en/calculators/loan-payment', '/คำนวณผ่อนกู้/'],
  ['/en/calculators/salary/', '/คำนวณเงินเดือนสุทธิ/'],
  ['/en/calculators/salary', '/คำนวณเงินเดือนสุทธิ/'],
  ['/en/calculators/vehicle/', '/คำนวณผ่อนรถ/'],
  ['/en/calculators/vehicle', '/คำนวณผ่อนรถ/'],

  // Legacy /calculator/* routes
  ['/calculator/bmi/', '/คำนวณ-bmi/'],
  ['/calculator/bmi', '/คำนวณ-bmi/'],
  ['/calculator/apr/', '/คำนวณ-apr/'],
  ['/calculator/apr', '/คำนวณ-apr/'],
  ['/calculator/mortgage/', '/คำนวณผ่อนบ้าน/'],
  ['/calculator/mortgage', '/คำนวณผ่อนบ้าน/'],
  ['/calculator/salary/', '/คำนวณเงินเดือนสุทธิ/'],
  ['/calculator/salary', '/คำนวณเงินเดือนสุทธิ/'],
  ['/calculator/vehicle/', '/คำนวณผ่อนรถ/'],
  ['/calculator/vehicle', '/คำนวณผ่อนรถ/'],
  ['/calculator/loan-payment/', '/คำนวณผ่อนกู้/'],
  ['/calculator/loan-payment', '/คำนวณผ่อนกู้/'],
  ['/calculator/property-transfer-tax/', '/คำนวณค่าธรรมเนียมโอนบ้าน/'],
  ['/calculator/property-transfer-tax', '/คำนวณค่าธรรมเนียมโอนบ้าน/'],
  ['/calculator/land-tax/', '/คำนวณภาษีที่ดิน/'],
  ['/calculator/land-tax', '/คำนวณภาษีที่ดิน/'],
  ['/calculator/unit-converter/', '/แปลงหน่วย/'],
  ['/calculator/unit-converter', '/แปลงหน่วย/'],
  ['/calculator/overtime-pay/', '/คำนวณค่าโอที/'],
  ['/calculator/overtime-pay', '/คำนวณค่าโอที/'],
  ['/calculator/electricity-bill/', '/คำนวณค่าไฟฟ้า/'],
  ['/calculator/electricity-bill', '/คำนวณค่าไฟฟ้า/'],
  ['/sitemap.xml', '/sitemap-index.xml'],
]);

const noIndexTag = 'noindex, nofollow, noarchive';
const blockedPathPatterns = [
  /^\/(?:plans|reports|memory|scripts|node_modules|\.git|\.astro)(?:\/|$)/i,
  /^\/\.tmp(?:\/|$)/i,
  /^\/.*internal-note.*$/i,
];

function isBlockedPath(pathname) {
  return blockedPathPatterns.some((pattern) => pattern.test(pathname));
}

function getRequestHost(req) {
  const hostHeader = String(req.headers.host || '').trim().toLowerCase();
  if (!hostHeader) return '';
  return hostHeader.split(':', 1)[0];
}

async function serve(req, res) {
  let incomingUrl;
  try {
    incomingUrl = new URL(req.url, `http://localhost:${port}`);
  } catch {
    incomingUrl = new URL('/', `http://localhost:${port}`);
  }

  // Railway / load-balancer health checks — always 200 before any redirect logic.
  // Use incomingUrl.pathname here (url is declared later to avoid TDZ error).
  const rawPath = incomingUrl.pathname;
  if (rawPath === '/__health' || rawPath === '/healthz' || rawPath === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' });
    res.end('ok');
    return;
  }

  const requestHost = getRequestHost(req);
  if (requestHost && requestHost !== primaryHost && redirectHosts.has(requestHost)) {
    res.writeHead(301, {
      Location: `${primarySiteUrl.origin}${incomingUrl.pathname}${incomingUrl.search}`,
      'Cache-Control': 'no-store, max-age=0',
    });
    res.end();
    return;
  }

  // Decode the URL to handle Thai characters and other non-ASCII paths.
  let url;
  try {
    url = decodeURIComponent(incomingUrl.pathname);
  } catch {
    url = incomingUrl.pathname;
  }

  const redirectTarget = permanentRedirects.get(url);
  if (redirectTarget) {
    const encodedTarget = redirectTarget.split('/').map(encodeURIComponent).join('/');
    res.writeHead(301, {
      Location: encodedTarget,
      'Cache-Control': 'public, max-age=31536000, immutable',
    });
    res.end();
    return;
  }

  if (isBlockedPath(url)) {
    res.writeHead(410, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': noIndexTag,
    });
    res.end('Gone');
    return;
  }

  if (url === '/__release' || url === '/__release/') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': noIndexTag,
    });
    res.end(JSON.stringify(releaseMetadata));
    return;
  }

  // ── Email capture API (CAL-1070 — Brevo integration) ──────
  if (url === '/api/email/capture' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', async () => {
      const corsHeaders = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      };
      try {
        const brevoApiKey = process.env.BREVO_API_KEY || '';
        const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@kamnuanlek.com';
        const senderName = process.env.BREVO_SENDER_NAME || 'Kamnuanlek.com';

        if (!brevoApiKey) {
          // Graceful degradation: log + return ok so UI doesn't break
          console.warn('[email-capture] BREVO_API_KEY not configured — skipping Brevo calls');
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify({ ok: true, mode: 'noop' }));
          return;
        }

        const payload = JSON.parse(body);
        const email = (payload.email || '').trim().toLowerCase();
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({ error: 'invalid email' }));
          return;
        }

        const calcCategory = (payload.calcCategory || 'GENERAL').toUpperCase().replace(/\s+/g, '_');
        const calcTitle = payload.calcTitle || 'เครื่องคำนวณ';
        const resultValue = payload.resultValue || '';
        const resultLabel = payload.resultLabel || 'ผลลัพธ์';
        const calcUrl = payload.url || '/';
        const siteUrl = process.env.PUBLIC_SITE_URL || 'https://www.kamnuanlek.com';
        const fullUrl = siteUrl.replace(/\/$/, '') + calcUrl;

        // 1. Add subscriber to Brevo contacts list
        const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            email,
            updateEnabled: true,
            attributes: {
              CALCULATOR_CATEGORY: calcCategory,
              CALCULATOR_NAME: calcTitle,
              SAVED_RESULT: `${resultLabel}: ${resultValue}`,
              OPT_IN_SOURCE: 'save-prompt',
              OPT_IN_URL: calcUrl,
            },
          }),
        });

        if (!contactRes.ok && contactRes.status !== 204) {
          const errText = await contactRes.text();
          console.error('[email-capture] Brevo contacts error:', contactRes.status, errText);
        }

        // 2. Send Email 1 — immediate result delivery
        const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: senderName, email: senderEmail },
            to: [{ email }],
            subject: `ผลการคำนวณของคุณจาก Kamnuanlek.com`,
            htmlContent: [
              `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1e293b;">`,
              `<h2 style="color:#2563eb;margin:0 0 8px;">📊 ${calcTitle}</h2>`,
              `<p style="margin:0 0 16px;font-size:15px;color:#475569;">นี่คือผลการคำนวณที่คุณบันทึกไว้</p>`,
              `<div style="background:#f0f9ff;border:1.5px solid #bae6fd;border-radius:12px;padding:16px 20px;margin-bottom:20px;">`,
              `<p style="margin:0 0 4px;font-size:13px;color:#64748b;">${resultLabel}</p>`,
              `<p style="margin:0;font-size:22px;font-weight:700;color:#0369a1;">${resultValue}</p>`,
              `</div>`,
              `<a href="${fullUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:15px;">`,
              `คำนวณใหม่ →</a>`,
              `<p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">`,
              `ไม่มีสแปม — <a href="${siteUrl}/unsubscribe" style="color:#94a3b8;">ยกเลิกการรับอีเมล</a></p>`,
              `</div>`,
            ].join(''),
          }),
        });

        if (!emailRes.ok) {
          const errText = await emailRes.text();
          console.error('[email-capture] Brevo smtp error:', emailRes.status, errText);
          // Still return ok — contact was added, email failure is non-fatal
        }

        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        console.error('[email-capture] Unexpected error:', err);
        // Always return 200 to client — never block user flow for email errors
        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify({ ok: true, mode: 'error-silent' }));
      }
    });
    return;
  }

  if (url === '/api/email/capture' && req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // ── Push subscription API ──────────────────────────────────
  if (url === '/api/push/subscribe' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', async () => {
      try {
        const sub = JSON.parse(body);
        if (sub?.endpoint) {
          pushSubscriptions.set(sub.endpoint, sub);
          await saveSubscriptions();
          res.writeHead(201, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
          res.end(JSON.stringify({ ok: true, total: pushSubscriptions.size }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'invalid subscription' }));
        }
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'bad request' }));
      }
    });
    return;
  }

  if (url === '/api/push/unsubscribe' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', async () => {
      try {
        const { endpoint } = JSON.parse(body);
        if (endpoint) pushSubscriptions.delete(endpoint);
        await saveSubscriptions();
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify({ ok: true }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'bad request' }));
      }
    });
    return;
  }

  if (url === '/api/push/stats' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Robots-Tag': noIndexTag });
    res.end(JSON.stringify({ subscribers: pushSubscriptions.size }));
    return;
  }

  // ── Auth routes (CAL-1205) ─────────────────────────────────────────────────
  if (url === '/auth/google' || url === '/auth/google/') { handleGoogleLogin(req, res); return; }
  if (url === '/auth/facebook' || url === '/auth/facebook/') { handleFacebookLogin(req, res); return; }
  if (url === '/auth/apple' || url === '/auth/apple/') { handleAppleLogin(req, res); return; }
  if (url === '/auth/logout' || url === '/auth/logout/') { handleLogout(req, res); return; }
  if (url === '/api/me' && req.method === 'GET') { handleApiMe(req, res); return; }

  // ── AI Advisor endpoint (CAL-1262) ────────────────────────────────────────
  if (url === '/api/ai-advisor/message' && req.method === 'POST') {
    await handleAiAdvisorMessage(req, res);
    return;
  }

  if (url === '/auth/google/callback') {
    const query = Object.fromEntries(incomingUrl.searchParams);
    await handleGoogleCallback(req, res, query);
    return;
  }
  if (url === '/auth/facebook/callback') {
    const query = Object.fromEntries(incomingUrl.searchParams);
    await handleFacebookCallback(req, res, query);
    return;
  }
  if (url === '/auth/apple/callback' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    await new Promise((resolve) => req.on('end', resolve));
    await handleAppleCallback(req, res, body);
    return;
  }

  if (url.endsWith('/')) url += 'index.html';
  if (!extname(url)) url += '/index.html';

  try {
    const filePath = join(distDir, url);
    const data = await readFile(filePath);
    const ext = extname(filePath);

    // Get file stats for Last-Modified and ETag
    const fileStats = await stat(filePath);
    const lastModified = fileStats.mtime.toUTCString();
    const etag = generateETag(data);

    // CAL-1048: Cache header configuration
    // HTML pages: shorter browser cache, longer CDN cache
    // Static assets: 1-week max-age, immutable
    let cacheControl;
    if (ext === '.html') {
      cacheControl = 'public, max-age=3600, s-maxage=86400';
    } else {
      cacheControl = 'public, max-age=604800, immutable';
    }

    const headers = {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': cacheControl,
      'ETag': etag,
      'Last-Modified': lastModified,
      'X-Served-File': Buffer.from(url).toString('base64'),
    };

    res.writeHead(200, headers);
    res.end(data);
  } catch {
    try {
      const notFound = await readFile(join(distDir, '404.html'));
      res.writeHead(404, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': noIndexTag,
      });
      res.end(notFound);
    } catch {
      res.writeHead(404, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': noIndexTag,
      });
      res.end('Not Found');
    }
  }
}

async function start() {
  releaseMetadata = await loadReleaseMetadata();
  console.log(`[release-metadata] Loaded commit: ${releaseMetadata.gitCommit}`);

  if (process.env.DATABASE_URL) {
    try {
      await initDb();
    } catch (err) {
      console.error('[db] init failed (auth features disabled):', err.message);
    }
  } else {
    console.warn('[db] DATABASE_URL not set — auth features disabled');
  }

  createServer(serve).listen(port, () => {
    console.log(`[server] listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error('[server] Failed to start:', error);
  process.exit(1);
});
