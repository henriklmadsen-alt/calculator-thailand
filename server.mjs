import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat, readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { brotliCompress, constants as zlibConstants, gzip } from 'node:zlib';
import webpush from 'web-push';
import {
  handleGoogleLogin, handleGoogleCallback,
  handleFacebookLogin, handleFacebookCallback,
  handleAppleLogin, handleAppleCallback,
  handleLogout, handleApiMe, handleDevLogin,
} from './app/auth.mjs';
import { initDb } from './app/db.mjs';
import { handleAiAdvisorMessage } from './app/ai-advisor.mjs';
import {
  handleListConversations,
  handleCreateConversation,
  handleGetConversation,
  handleDeleteConversation,
} from './app/conversations.mjs';
import { handleStripeCheckout } from './app/stripe.mjs';
import { handleStripeWebhook } from './app/stripe-webhook.mjs';
import { handleKpiDashboardRequest } from './app/kpi-dashboard.mjs';
import { handleAffiliateRedirect } from './app/affiliate-redirect.mjs';

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

const securityHeaders = Object.freeze({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000',
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline' https:",
    "style-src 'self' 'unsafe-inline' https:",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https: wss:",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    "frame-src 'self' https:",
    'upgrade-insecure-requests',
  ].join('; '),
});

function headerBagHas(headers, headerName) {
  if (!headers || typeof headers !== 'object' || Array.isArray(headers)) return false;
  const normalizedName = headerName.toLowerCase();
  return Object.keys(headers).some((key) => key.toLowerCase() === normalizedName);
}

function applyDefaultSecurityHeaders(res) {
  const originalWriteHead = res.writeHead.bind(res);
  res.writeHead = (statusCode, reasonPhrase, headers) => {
    const explicitHeaders = typeof reasonPhrase === 'string' ? headers : reasonPhrase;
    for (const [name, value] of Object.entries(securityHeaders)) {
      if (!res.hasHeader(name) && !headerBagHas(explicitHeaders, name)) {
        res.setHeader(name, value);
      }
    }
    return originalWriteHead(statusCode, reasonPhrase, headers);
  };
}

async function loadReleaseMetadata() {
  const releaseMetadataFile = join(distDir, '__release.json');
  const envGitCommit =
    process.env.SOURCE_GIT_COMMIT_SHA ||
    process.env.SOURCE_COMMIT ||
    process.env.RAILWAY_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    '';
  try {
    const raw = await readFile(releaseMetadataFile, 'utf-8');
    const data = JSON.parse(raw);
    return Object.freeze({
      gitCommit: data.gitCommit && data.gitCommit !== 'unknown' ? data.gitCommit : envGitCommit || 'unknown',
      deploymentId: process.env.RAILWAY_DEPLOYMENT_ID || null,
      generatedAt: data.timestamp || new Date().toISOString(),
    });
  } catch (error) {
    console.warn(`[release-metadata] Failed to load ${releaseMetadataFile}, falling back to env vars:`, error.message);
    return Object.freeze({
      gitCommit:
        envGitCommit || 'unknown',
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
const VAPID_PUBLIC_KEY =
  process.env.VAPID_PUBLIC_KEY ||
  process.env.PUBLIC_VAPID_PUBLIC_KEY ||
  'BOWqVZd05Ge2s0KqqynLV_xGFxtwgq6pT7XhhgjCYCNge4xVni_OZ8HrkFxsNnd9m4Stjipf5K0dCyRZaHkn7cw';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const pushConfigured = Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);
if (pushConfigured) {
  webpush.setVapidDetails('mailto:hello@kamnuanlek.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
} else {
  console.warn('[push] VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY is not configured; push notifications are disabled.');
}

// In-memory subscription store (survives server session, cleared on redeploy)
// Subscribers who revisit re-register automatically via SW
const pushSubscriptions = new Map(); // endpoint → subscription object
const SUBS_FILE = join(__dirname, '..', 'tmp', 'push-subscriptions.json');
const VISITOR_COUNTER_DIR = join(__dirname, '.events', 'visitor-counter');
const VISITOR_COUNTER_LIFETIME_FILE = join(VISITOR_COUNTER_DIR, 'lifetime.json');
const VISITOR_GROWTH_AUDIT_FILE = join(__dirname, '..', 'tmp', 'visitor-growth-audit.json');
const VISITOR_GROWTH_DAILY_TARGET = 100;
const VISITOR_COUNTER_BASELINE_TOTAL_VISITS = parseNonNegativeInt(
  process.env.VISITOR_COUNTER_BASELINE_TOTAL_VISITS,
  102
);
const VISITOR_COUNTER_BASELINE_UNIQUE_VISITORS = parseNonNegativeInt(
  process.env.VISITOR_COUNTER_BASELINE_UNIQUE_VISITORS,
  66
);
const VISITOR_COUNTER_BASELINE_SINCE =
  process.env.VISITOR_COUNTER_BASELINE_SINCE || '2026-05-17T00:00:00.000Z';
const VISITOR_BOT_UA_PATTERN =
  /(bot|spider|crawl|slurp|bingpreview|facebookexternalhit|headless|lighthouse|pingdom|uptimerobot)/i;
const VISITOR_MAX_DAYS = 30;

function parseNonNegativeInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return parsed;
}

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

function getBangkokDateKey(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

function getVisitorStatePath(dateKey) {
  return join(VISITOR_COUNTER_DIR, `${dateKey}.json`);
}

async function loadVisitorState(dateKey) {
  const statePath = getVisitorStatePath(dateKey);
  try {
    const raw = await readFile(statePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      parsed.date === dateKey &&
      typeof parsed.uniqueVisitors === 'number' &&
      typeof parsed.totalVisits === 'number' &&
      parsed.visitors &&
      typeof parsed.visitors === 'object'
    ) {
      return parsed;
    }
  } catch {
    // File missing or invalid; use empty state.
  }

  return {
    date: dateKey,
    uniqueVisitors: 0,
    totalVisits: 0,
    visitors: {},
  };
}

async function saveVisitorState(state) {
  await mkdir(VISITOR_COUNTER_DIR, { recursive: true });
  await writeFile(getVisitorStatePath(state.date), JSON.stringify(state), 'utf-8');
}

function createEmptyLifetimeVisitorState() {
  return {
    since: VISITOR_COUNTER_BASELINE_SINCE,
    uniqueVisitors: VISITOR_COUNTER_BASELINE_UNIQUE_VISITORS,
    totalVisits: VISITOR_COUNTER_BASELINE_TOTAL_VISITS,
    visitors: {},
  };
}

function applyLifetimeBaselineFloor(state) {
  const normalized = {
    since: typeof state?.since === 'string' ? state.since : VISITOR_COUNTER_BASELINE_SINCE,
    uniqueVisitors: parseNonNegativeInt(state?.uniqueVisitors, 0),
    totalVisits: parseNonNegativeInt(state?.totalVisits, 0),
    visitors: state?.visitors && typeof state.visitors === 'object' ? state.visitors : {},
  };

  if (Number.isNaN(Date.parse(normalized.since))) {
    normalized.since = VISITOR_COUNTER_BASELINE_SINCE;
  }

  if (normalized.totalVisits < VISITOR_COUNTER_BASELINE_TOTAL_VISITS) {
    normalized.totalVisits = VISITOR_COUNTER_BASELINE_TOTAL_VISITS;
  }

  if (normalized.uniqueVisitors < VISITOR_COUNTER_BASELINE_UNIQUE_VISITORS) {
    normalized.uniqueVisitors = VISITOR_COUNTER_BASELINE_UNIQUE_VISITORS;
  }

  if (normalized.uniqueVisitors > normalized.totalVisits) {
    normalized.uniqueVisitors = normalized.totalVisits;
  }

  return normalized;
}

async function saveLifetimeVisitorState(state) {
  await mkdir(VISITOR_COUNTER_DIR, { recursive: true });
  await writeFile(VISITOR_COUNTER_LIFETIME_FILE, JSON.stringify(state), 'utf-8');
}

async function buildLifetimeVisitorStateFromDailyFiles() {
  const lifetimeState = createEmptyLifetimeVisitorState();
  const knownVisitorHashes = new Set();
  let earliestDate = null;

  try {
    await mkdir(VISITOR_COUNTER_DIR, { recursive: true });
    const files = await readdir(VISITOR_COUNTER_DIR);
    const dailyFiles = files.filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name)).sort();

    for (const fileName of dailyFiles) {
      const dateKey = fileName.replace('.json', '');
      const dayState = await loadVisitorState(dateKey);
      lifetimeState.totalVisits += dayState.totalVisits;

      if (!earliestDate || dateKey < earliestDate) earliestDate = dateKey;

      for (const [visitorHash, firstSeenAt] of Object.entries(dayState.visitors || {})) {
        if (knownVisitorHashes.has(visitorHash)) continue;
        knownVisitorHashes.add(visitorHash);
        lifetimeState.visitors[visitorHash] = firstSeenAt;
      }
    }

    lifetimeState.uniqueVisitors = knownVisitorHashes.size;
    if (earliestDate) lifetimeState.since = `${earliestDate}T00:00:00.000Z`;
  } catch {
    // Keep empty state if files are unreadable.
  }

  const normalized = applyLifetimeBaselineFloor(lifetimeState);
  await saveLifetimeVisitorState(normalized);
  return normalized;
}

async function loadLifetimeVisitorState() {
  try {
    const raw = await readFile(VISITOR_COUNTER_LIFETIME_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.uniqueVisitors === 'number' &&
      typeof parsed.totalVisits === 'number' &&
      parsed.visitors &&
      typeof parsed.visitors === 'object'
    ) {
      const normalized = applyLifetimeBaselineFloor(parsed);
      if (
        normalized.totalVisits !== parsed.totalVisits ||
        normalized.uniqueVisitors !== parsed.uniqueVisitors ||
        normalized.since !== parsed.since
      ) {
        await saveLifetimeVisitorState(normalized);
      }
      return normalized;
    }
  } catch {
    // Build from daily files below.
  }

  return buildLifetimeVisitorStateFromDailyFiles();
}

function getDateDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date;
}

async function loadVisitorGrowthAuditState() {
  try {
    const raw = await readFile(VISITOR_GROWTH_AUDIT_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch {
    // No prior audit state.
  }
  return { lastAuditedDay: null };
}

async function saveVisitorGrowthAuditState(state) {
  await mkdir(join(__dirname, '..', 'tmp'), { recursive: true });
  await writeFile(VISITOR_GROWTH_AUDIT_FILE, JSON.stringify(state), 'utf-8');
}

async function runDailyVisitorGrowthAudit() {
  const nowBkk = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  if (nowBkk.getHours() < 7) return;

  const auditedDayKey = getBangkokDateKey(getDateDaysAgo(1));
  const auditState = await loadVisitorGrowthAuditState();
  if (auditState.lastAuditedDay === auditedDayKey) return;

  const auditedDayState = await loadVisitorState(auditedDayKey);
  const dailyGrowth = auditedDayState.totalVisits;
  const meetsTarget = dailyGrowth >= VISITOR_GROWTH_DAILY_TARGET;

  const nextAuditState = {
    lastAuditedDay: auditedDayKey,
    checkedAt: new Date().toISOString(),
    metric: 'totalVisits',
    dailyGrowth,
    target: VISITOR_GROWTH_DAILY_TARGET,
    meetsTarget,
  };
  await saveVisitorGrowthAuditState(nextAuditState);

  if (!meetsTarget) {
    console.warn(
      `[visitor-growth-audit] Daily growth below target on ${auditedDayKey}: ${dailyGrowth} < ${VISITOR_GROWTH_DAILY_TARGET}. Action required: improve SEO and AI search coverage.`
    );
  } else {
    console.info(
      `[visitor-growth-audit] Daily growth target met on ${auditedDayKey}: ${dailyGrowth} >= ${VISITOR_GROWTH_DAILY_TARGET}.`
    );
  }
}

function hashVisitorFingerprint(visitorId, req) {
  const userAgent = req.headers['user-agent'] || '';
  const acceptLanguage = req.headers['accept-language'] || '';
  const payload = `${visitorId}|${userAgent}|${acceptLanguage}`;
  return createHash('sha256').update(payload).digest('hex');
}

function parsePositiveInt(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.floor(n));
}

const THB_PER_UNIT_FALLBACK = Object.freeze({
  THB: 1,
  USD: 36.5,
  EUR: 39.6,
  GBP: 46.6,
  JPY: 0.236,
  CNY: 5.05,
  HKD: 4.68,
  SGD: 27.1,
  AUD: 24.2,
  KRW: 0.0265,
});

const SUPPORTED_FX_CODES = new Set(Object.keys(THB_PER_UNIT_FALLBACK));

function normalizeCurrencyCode(value) {
  const code = String(value || '').trim().toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : '';
}

function buildFallbackExchangeRates(base, symbols) {
  const baseThb = THB_PER_UNIT_FALLBACK[base];
  const rates = {};
  for (const symbol of symbols) {
    const quoteThb = THB_PER_UNIT_FALLBACK[symbol];
    if (Number.isFinite(baseThb) && Number.isFinite(quoteThb) && quoteThb > 0) {
      rates[symbol] = baseThb / quoteThb;
    }
  }
  return rates;
}

async function fetchLiveExchangeRates(base, symbols) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`exchange provider returned ${response.status}`);
    }
    const payload = await response.json();
    const providerRates = payload?.rates || {};
    const rates = {};
    for (const symbol of symbols) {
      const rate = Number(providerRates[symbol]);
      if (Number.isFinite(rate) && rate > 0) {
        rates[symbol] = rate;
      }
    }
    if (Object.keys(rates).length !== symbols.length) {
      throw new Error('exchange provider response missing requested symbols');
    }
    return {
      rates,
      source: 'open.er-api.com',
      stale: false,
      lastUpdatedAt: payload?.time_last_update_utc
        ? new Date(payload.time_last_update_utc).toISOString()
        : new Date().toISOString(),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function handleExchangeRatesRequest(res, incomingUrl) {
  const base = normalizeCurrencyCode(incomingUrl.searchParams.get('base')) || 'THB';
  const symbols = String(incomingUrl.searchParams.get('symbols') || 'USD')
    .split(',')
    .map(normalizeCurrencyCode)
    .filter(Boolean);
  const uniqueSymbols = [...new Set(symbols)].slice(0, 12);

  if (!SUPPORTED_FX_CODES.has(base) || uniqueSymbols.length === 0 || uniqueSymbols.some((code) => !SUPPORTED_FX_CODES.has(code))) {
    res.writeHead(400, {
      ...securityHeaders,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    res.end(JSON.stringify({ error: 'unsupported_currency' }));
    return;
  }

  try {
    const live = await fetchLiveExchangeRates(base, uniqueSymbols);
    res.writeHead(200, {
      ...securityHeaders,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=900, s-maxage=1800',
    });
    res.end(JSON.stringify({
      base,
      rates: live.rates,
      source: live.source,
      stale: live.stale,
      lastUpdatedAt: live.lastUpdatedAt,
    }));
  } catch (error) {
    const fallbackRates = buildFallbackExchangeRates(base, uniqueSymbols);
    res.writeHead(200, {
      ...securityHeaders,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=900',
    });
    res.end(JSON.stringify({
      base,
      rates: fallbackRates,
      source: 'static-fallback',
      stale: true,
      lastUpdatedAt: new Date().toISOString(),
      warning: 'live_exchange_rate_unavailable',
    }));
  }
}

async function sendPushToAll(payload) {
  if (!pushConfigured) {
    return { sent: 0, failed: 0, total: pushSubscriptions.size, disabled: true };
  }
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

// Run visitor growth audit every hour.
setInterval(() => {
  runDailyVisitorGrowthAudit().catch((error) => {
    console.error('[visitor-growth-audit] Failed:', error);
  });
}, 60 * 60 * 1000);

// Load persisted subscriptions on startup
loadSubscriptions();
runDailyVisitorGrowthAudit().catch((error) => {
  console.error('[visitor-growth-audit] Startup run failed:', error);
});

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

const gzipAsync = promisify(gzip);
const brotliCompressAsync = promisify(brotliCompress);
const compressibleExtensions = new Set(['.html', '.css', '.js', '.json', '.svg', '.xml', '.txt', '.webmanifest']);
const minCompressionBytes = 1024;
const compressedStaticCache = new Map();
const maxCompressedStaticCacheEntries = 128;

function getPreferredContentEncoding(req) {
  const acceptEncoding = String(req.headers['accept-encoding'] || '').toLowerCase();
  if (acceptEncoding.includes('br')) return 'br';
  if (acceptEncoding.includes('gzip')) return 'gzip';
  return '';
}

function rememberCompressedStatic(cacheKey, value) {
  if (compressedStaticCache.has(cacheKey)) compressedStaticCache.delete(cacheKey);
  compressedStaticCache.set(cacheKey, value);
  while (compressedStaticCache.size > maxCompressedStaticCacheEntries) {
    const oldestKey = compressedStaticCache.keys().next().value;
    compressedStaticCache.delete(oldestKey);
  }
}

async function prepareStaticResponseBody(req, filePath, ext, data) {
  if (!compressibleExtensions.has(ext) || data.length < minCompressionBytes) {
    return { body: data, encoding: '' };
  }

  const encoding = getPreferredContentEncoding(req);
  if (!encoding) return { body: data, encoding: '' };

  const sourceHash = createHash('md5').update(data).digest('hex');
  const cacheKey = `${filePath}:${sourceHash}:${encoding}`;
  const cached = compressedStaticCache.get(cacheKey);
  if (cached) {
    compressedStaticCache.delete(cacheKey);
    compressedStaticCache.set(cacheKey, cached);
    return cached;
  }

  const body = encoding === 'br'
    ? await brotliCompressAsync(data, {
        params: {
          [zlibConstants.BROTLI_PARAM_QUALITY]: 5,
        },
      })
    : await gzipAsync(data, { level: 6 });
  const prepared = { body, encoding };
  rememberCompressedStatic(cacheKey, prepared);
  return prepared;
}

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
  applyDefaultSecurityHeaders(res);

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
    res.writeHead(200, { ...securityHeaders, 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' });
    res.end('ok');
    return;
  }

  const requestHost = getRequestHost(req);
  if (requestHost && requestHost !== primaryHost && redirectHosts.has(requestHost)) {
    res.writeHead(301, {
      ...securityHeaders,
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
      ...securityHeaders,
      Location: encodedTarget,
      'Cache-Control': 'public, max-age=31536000, immutable',
    });
    res.end();
    return;
  }

  if (isBlockedPath(url)) {
    res.writeHead(410, {
      ...securityHeaders,
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': noIndexTag,
    });
    res.end('Gone');
    return;
  }

  if (req.method === 'GET' && await handleAffiliateRedirect(req, res, incomingUrl)) {
    return;
  }

  if (url === '/__release' || url === '/__release/') {
    res.writeHead(200, {
      ...securityHeaders,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': noIndexTag,
    });
    res.end(JSON.stringify(releaseMetadata));
    return;
  }

  if (url === '/api/kpi/dashboard' && req.method === 'GET') {
    await handleKpiDashboardRequest(req, res, incomingUrl);
    return;
  }

  if (url === '/api/exchange-rates' && req.method === 'GET') {
    await handleExchangeRatesRequest(res, incomingUrl);
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
    if (!pushConfigured) {
      res.writeHead(503, { ...securityHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ error: 'push_not_configured' }));
      return;
    }
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', async () => {
      try {
        const sub = JSON.parse(body);
        if (sub?.endpoint) {
          pushSubscriptions.set(sub.endpoint, sub);
          await saveSubscriptions();
          res.writeHead(201, { ...securityHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
          res.end(JSON.stringify({ ok: true, total: pushSubscriptions.size }));
        } else {
          res.writeHead(400, { ...securityHeaders, 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'invalid subscription' }));
        }
      } catch {
        res.writeHead(400, { ...securityHeaders, 'Content-Type': 'application/json' });
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
        res.writeHead(200, { ...securityHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify({ ok: true }));
      } catch {
        res.writeHead(400, { ...securityHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'bad request' }));
      }
    });
    return;
  }

  if (url === '/api/push/stats' && req.method === 'GET') {
    res.writeHead(200, { ...securityHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Robots-Tag': noIndexTag });
    res.end(JSON.stringify({ subscribers: pushSubscriptions.size, configured: pushConfigured }));
    return;
  }

  if (url === '/api/push/public-key' && req.method === 'GET') {
    if (!pushConfigured) {
      res.writeHead(200, { ...securityHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Robots-Tag': noIndexTag });
      res.end(JSON.stringify({ publicKey: null, configured: false }));
      return;
    }
    res.writeHead(200, { ...securityHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600', 'X-Robots-Tag': noIndexTag });
    res.end(JSON.stringify({ publicKey: VAPID_PUBLIC_KEY, configured: true }));
    return;
  }

  if (url === '/api/visitor-counter' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', async () => {
      const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      };

      try {
        const userAgent = req.headers['user-agent'] || '';
        if (VISITOR_BOT_UA_PATTERN.test(userAgent)) {
          res.writeHead(202, headers);
          res.end(JSON.stringify({ success: true, ignored: 'bot' }));
          return;
        }

        const payload = JSON.parse(body || '{}');
        const visitorId = String(payload?.visitorId || '').trim();
        if (!visitorId || visitorId.length > 128) {
          res.writeHead(400, headers);
          res.end(JSON.stringify({ error: 'Invalid visitorId' }));
          return;
        }

        const dateKey = getBangkokDateKey();
        const visitorHash = hashVisitorFingerprint(visitorId, req);
        const state = await loadVisitorState(dateKey);
        const lifetimeState = await loadLifetimeVisitorState();

        state.totalVisits += 1;
        if (!state.visitors[visitorHash]) {
          state.visitors[visitorHash] = new Date().toISOString();
          state.uniqueVisitors += 1;
        }
        lifetimeState.totalVisits += 1;
        if (!lifetimeState.visitors[visitorHash]) {
          lifetimeState.visitors[visitorHash] = new Date().toISOString();
          lifetimeState.uniqueVisitors += 1;
        }

        await Promise.all([
          saveVisitorState(state),
          saveLifetimeVisitorState(lifetimeState),
        ]);

        res.writeHead(201, headers);
        res.end(JSON.stringify({
          success: true,
          date: dateKey,
          uniqueVisitors: state.uniqueVisitors,
          totalVisits: state.totalVisits,
          lifetimeUniqueVisitors: lifetimeState.uniqueVisitors,
          lifetimeTotalVisits: lifetimeState.totalVisits,
        }));
      } catch (error) {
        console.error('[visitor-counter] POST failed:', error);
        res.writeHead(500, headers);
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
    return;
  }

  if (url === '/api/visitor-counter' && req.method === 'GET') {
    const days = Math.min(parsePositiveInt(incomingUrl.searchParams.get('days'), 7), VISITOR_MAX_DAYS);
    const daily = [];

    for (let i = 0; i < days; i += 1) {
      const date = getDateDaysAgo(i);
      const dateKey = getBangkokDateKey(date);
      const state = await loadVisitorState(dateKey);
      daily.push({
        date: dateKey,
        uniqueVisitors: state.uniqueVisitors,
        totalVisits: state.totalVisits,
      });
    }

    const today = daily[0] || {
      date: getBangkokDateKey(),
      uniqueVisitors: 0,
      totalVisits: 0,
    };
    const yesterday = daily[1] || { date: null, uniqueVisitors: 0, totalVisits: 0 };
    const lifetime = await loadLifetimeVisitorState();
    const todayProgress = today.totalVisits;
    const meetsDailyGrowthTarget = todayProgress >= VISITOR_GROWTH_DAILY_TARGET;

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': noIndexTag,
    });
    res.end(JSON.stringify({
      status: 'ok',
      timezone: 'Asia/Bangkok',
      generatedAt: new Date().toISOString(),
      today,
      lifetime: {
        since: lifetime.since,
        uniqueVisitors: lifetime.uniqueVisitors,
        totalVisits: lifetime.totalVisits,
      },
      growth: {
        comparedDate: yesterday.date,
        yesterdayTotalVisits: yesterday.totalVisits,
        todayTotalVisitsSoFar: todayProgress,
        target: VISITOR_GROWTH_DAILY_TARGET,
        remainingToTarget: Math.max(0, VISITOR_GROWTH_DAILY_TARGET - todayProgress),
        meetsTarget: meetsDailyGrowthTarget,
      },
      daily,
    }));
    return;
  }

  // ── Auth routes (CAL-1205) ─────────────────────────────────────────────────
  if (url === '/auth/google' || url === '/auth/google/') { handleGoogleLogin(req, res); return; }
  if (url === '/auth/facebook' || url === '/auth/facebook/') { handleFacebookLogin(req, res); return; }
  if (url === '/auth/apple' || url === '/auth/apple/') { handleAppleLogin(req, res); return; }
  if (url === '/auth/logout' || url === '/auth/logout/') { handleLogout(req, res); return; }
  if (url.startsWith('/auth/dev-login')) { handleDevLogin(req, res); return; }
  if (url === '/api/me' && req.method === 'GET') { handleApiMe(req, res); return; }

  // ── AI Advisor endpoint (CAL-1262) ────────────────────────────────────────
  if (url === '/api/ai-advisor/message' && req.method === 'POST') {
    await handleAiAdvisorMessage(req, res);
    return;
  }

  // ── Stripe webhook (CAL-1267) — raw body required for signature verification ─
  if (url === '/api/stripe/webhook' && req.method === 'POST') {
    await handleStripeWebhook(req, res);
    return;
  }

  // ── Stripe checkout (CAL-1266) ────────────────────────────────────────────
  if (url === '/api/stripe/checkout' && req.method === 'POST') {
    await handleStripeCheckout(req, res);
    return;
  }

  // ── Conversation history API (CAL-1265) ───────────────────────────────────
  if (url === '/api/conversations' || url === '/api/conversations/') {
    if (req.method === 'GET') { await handleListConversations(req, res, incomingUrl); return; }
    if (req.method === 'POST') { await handleCreateConversation(req, res); return; }
  }
  const conversationMatch = url.match(/^\/api\/conversations\/([^/]+)\/?$/);
  if (conversationMatch) {
    const conversationId = conversationMatch[1];
    if (req.method === 'GET') { await handleGetConversation(req, res, conversationId); return; }
    if (req.method === 'DELETE') { await handleDeleteConversation(req, res, conversationId); return; }
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
    const { body, encoding } = await prepareStaticResponseBody(req, filePath, ext, data);
    const etag = generateETag(body);

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
      ...securityHeaders,
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': cacheControl,
      'ETag': etag,
      'Last-Modified': lastModified,
      'Content-Length': String(body.length),
      'Vary': 'Accept-Encoding',
      'X-Served-File': Buffer.from(url).toString('base64'),
    };
    if (encoding) headers['Content-Encoding'] = encoding;

    res.writeHead(200, headers);
    res.end(body);
  } catch {
    try {
      const notFound = await readFile(join(distDir, '404.html'));
      res.writeHead(404, {
        ...securityHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': noIndexTag,
      });
      res.end(notFound);
    } catch {
      res.writeHead(404, {
        ...securityHeaders,
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
