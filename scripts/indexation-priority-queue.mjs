#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { google } from 'googleapis';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'reports', 'seo');
const SITE_URL = (readEnvValue('PUBLIC_SITE_URL') || 'https://www.kamnuanlek.com').replace(/\/+$/, '');
const GSC_SITE_URL = readEnvValue('GSC_SITE_URL') || `${SITE_URL}/`;
const DOMAIN_SITE_URL = 'sc-domain:kamnuanlek.com';
const LOOKBACK_DAYS = Number.parseInt(process.env.INDEXATION_LOOKBACK_DAYS || '480', 10);
const ROW_LIMIT = Number.parseInt(process.env.INDEXATION_GSC_ROW_LIMIT || '25000', 10);
const QUEUE_LIMIT = Number.parseInt(process.env.INDEXATION_QUEUE_LIMIT || '150', 10);

const HIGH_VALUE_PATTERNS = [
  { term: 'ค่าไฟ', label: 'electricity', weight: 45, reason: 'high-volume Thai utility keyword' },
  { term: 'ไฟฟ้า', label: 'electricity', weight: 42, reason: 'high-volume Thai utility keyword' },
  { term: 'อายุ', label: 'age', weight: 40, reason: 'high-volume evergreen calculator' },
  { term: 'ภาษีมูลค่าเพิ่ม', label: 'vat', weight: 42, reason: 'commercial/tax calculator demand' },
  { term: 'vat', label: 'vat', weight: 42, reason: 'commercial/tax calculator demand' },
  { term: 'โอที', label: 'overtime', weight: 38, reason: 'salary calculator demand' },
  { term: 'ล่วงเวลา', label: 'overtime', weight: 34, reason: 'salary calculator demand' },
  { term: 'ผ่อนรถ', label: 'car-loan', weight: 48, reason: 'affiliate intent and search demand' },
  { term: 'สินเชื่อรถ', label: 'car-loan', weight: 48, reason: 'affiliate intent and search demand' },
  { term: 'ไฟแนนซ์', label: 'car-loan', weight: 42, reason: 'affiliate intent and search demand' },
  { term: 'ผ่อนบ้าน', label: 'home-loan', weight: 48, reason: 'affiliate intent and search demand' },
  { term: 'สินเชื่อบ้าน', label: 'home-loan', weight: 46, reason: 'affiliate intent and search demand' },
  { term: 'รีไฟแนนซ์', label: 'home-loan', weight: 44, reason: 'affiliate intent and search demand' },
  { term: 'ประกัน', label: 'insurance', weight: 44, reason: 'affiliate intent' },
  { term: 'บัตรเครดิต', label: 'credit-card', weight: 42, reason: 'affiliate intent' },
  { term: 'สินเชื่อ', label: 'loan', weight: 42, reason: 'affiliate intent' },
  { term: 'เงินเดือน', label: 'salary', weight: 36, reason: 'workplace calculator demand' },
  { term: 'ภาษี', label: 'tax', weight: 36, reason: 'recurring tax demand' },
  { term: 'ประกันสังคม', label: 'social-security', weight: 34, reason: 'workplace calculator demand' },
  { term: 'bmi', label: 'bmi', weight: 32, reason: 'evergreen health calculator' },
];

function readEnvValue(key) {
  if (process.env[key]) return process.env[key];

  const candidates = ['.env.gsc', '.env.local', '.env'];
  for (const fileName of candidates) {
    const filePath = path.join(ROOT, fileName);
    if (!fs.existsSync(filePath)) continue;

    const envContent = fs.readFileSync(filePath, 'utf8');
    const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
    if (!match) continue;

    let value = match[1].trim();
    const quote = value[0];
    if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
      value = value.slice(1, -1);
    }
    return value;
  }

  return undefined;
}

function bangkokDate(daysBack = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysBack);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function n(value, decimals = 0) {
  return Number(value || 0).toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

function pct(value) {
  return `${n((value || 0) * 100, 2)}%`;
}

function table(headers, rows) {
  if (!rows.length) return '_No rows._';
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows,
  ].join('\n');
}

function mdCell(value, limit = 100) {
  const text = String(value || '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
  return text.length > limit ? `${text.slice(0, limit - 1)}...` : text;
}

function decodeSafe(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeUrl(value) {
  const url = new URL(value, SITE_URL);
  url.hash = '';
  url.search = '';
  const decodedPath = decodeSafe(url.pathname);
  const pathName = decodedPath === '/' || decodedPath.endsWith('/') ? decodedPath : `${decodedPath}/`;
  return `${url.origin}${pathName}`;
}

function pagePath(value) {
  return decodeSafe(new URL(value).pathname);
}

function extractUrlsFromSitemap(xml) {
  const urls = [];
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}

async function fetchLiveSitemapUrls() {
  const sitemapUrl = `${SITE_URL}/sitemap-0.xml`;
  const response = await fetch(sitemapUrl, { headers: { 'User-Agent': 'KamnuanlekIndexationQueue/1.0' } });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${sitemapUrl}: HTTP ${response.status} ${response.statusText}`);
  }

  const xml = await response.text();
  return [...new Set(extractUrlsFromSitemap(xml).map(normalizeUrl))].sort((a, b) => a.localeCompare(b));
}

function buildAuth() {
  const raw = readEnvValue('GSC_SERVICE_ACCOUNT_JSON') || readEnvValue('GOOGLE_SERVICE_ACCOUNT_JSON');
  if (!raw) {
    throw new Error('GSC_SERVICE_ACCOUNT_JSON is missing from .env.gsc, .env.local, .env, or process.env');
  }

  const credentials = JSON.parse(raw);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  return google.searchconsole({ version: 'v1', auth });
}

async function queryVisiblePages(searchconsole) {
  const endDate = bangkokDate(3);
  const startDate = bangkokDate(LOOKBACK_DAYS);
  const candidates = [...new Set([GSC_SITE_URL, `${SITE_URL}/`, DOMAIN_SITE_URL])];
  let lastError;

  for (const siteUrl of candidates) {
    try {
      const response = await searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['page'],
          rowLimit: ROW_LIMIT,
        },
      });

      const rows = response.data.rows || [];
      return {
        siteUrl,
        range: { startDate, endDate },
        rows: rows.map((row) => ({
          url: normalizeUrl(row.keys?.[0] || ''),
          clicks: row.clicks || 0,
          impressions: row.impressions || 0,
          ctr: row.ctr || 0,
          position: row.position || 0,
        })),
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function scoreUrl(url, visibleMetrics) {
  const pathName = pagePath(url).toLocaleLowerCase('th-TH');
  const labels = new Set();
  const reasons = new Set();
  let score = 20;

  if (pathName === '/') {
    score += 50;
    labels.add('homepage');
    reasons.add('root crawl path');
  }

  if (pathName.startsWith('/คำนวณ')) {
    score += 24;
    labels.add('calculator');
    reasons.add('calculator landing page');
  }

  if (pathName.includes('/บทความ/')) {
    score += 18;
    labels.add('article');
    reasons.add('long-tail search support page');
  }

  if (pathName.includes('/หมวดหมู่/') || pathName.includes('/เครื่องคำนวณ')) {
    score += 14;
    labels.add('hub');
    reasons.add('internal link hub');
  }

  for (const pattern of HIGH_VALUE_PATTERNS) {
    if (pathName.includes(pattern.term)) {
      score += pattern.weight;
      labels.add(pattern.label);
      reasons.add(pattern.reason);
    }
  }

  if (visibleMetrics?.impressions > 0) {
    score += Math.min(25, Math.log10(visibleMetrics.impressions + 1) * 8);
    reasons.add('already has GSC demand');
  }

  return {
    score: Math.round(score),
    labels: [...labels].slice(0, 5),
    reasons: [...reasons].slice(0, 4),
  };
}

function buildQueue(sitemapUrls, visibleRows) {
  const visibleByUrl = new Map();
  for (const row of visibleRows) {
    visibleByUrl.set(row.url, row);
  }

  const allRows = sitemapUrls.map((url) => {
    const visibleMetrics = visibleByUrl.get(url);
    const scoring = scoreUrl(url, visibleMetrics);
    return {
      url,
      path: pagePath(url),
      score: scoring.score,
      labels: scoring.labels,
      reasons: scoring.reasons,
      hasGscVisibility: Boolean(visibleMetrics),
      clicks: visibleMetrics?.clicks || 0,
      impressions: visibleMetrics?.impressions || 0,
      ctr: visibleMetrics?.ctr || 0,
      position: visibleMetrics?.position || 0,
    };
  });

  const notVisible = allRows
    .filter((row) => !row.hasGscVisibility)
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
    .slice(0, QUEUE_LIMIT);

  const visible = allRows
    .filter((row) => row.hasGscVisibility)
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks)
    .slice(0, 50);

  return { allRows, notVisible, visible };
}

function renderReport(payload) {
  const { generatedDate, queue, summary } = payload;
  const topRows = queue.notVisible.slice(0, 50).map((row, index) => (
    `| ${index + 1} | ${row.score} | ${mdCell(row.path, 54)} | ${mdCell(row.labels.join(', '), 34)} | ${mdCell(row.reasons.join('; '), 90)} |`
  ));

  const manualRows = queue.notVisible.slice(0, 15).map((row, index) => (
    `| ${index + 1} | ${mdCell(row.url, 92)} | ${mdCell(row.labels.join(', '), 34)} |`
  ));

  const visibleTableRows = queue.visible.slice(0, 20).map((row, index) => (
    `| ${index + 1} | ${mdCell(row.path, 54)} | ${n(row.clicks)} | ${n(row.impressions)} | ${pct(row.ctr)} | ${n(row.position, 1)} |`
  ));

  return `# Indexation Priority Queue - ${generatedDate}

Generated: ${new Date().toISOString()}
Site: ${SITE_URL}/
GSC property queried: ${payload.gscSiteUrl}
GSC range: ${payload.range.startDate} to ${payload.range.endDate}

## Summary

- Live sitemap URLs: ${n(summary.sitemapUrls)}
- GSC page rows returned in lookback window: ${n(summary.gscPageRows)}
- Live sitemap URLs with GSC page visibility: ${n(summary.sitemapUrlsWithGscVisibility)}
- Live sitemap URLs with no GSC page visibility yet: ${n(summary.sitemapUrlsWithNoGscVisibility)}
- Priority no-visibility queue written: ${n(queue.notVisible.length)}

This report does not claim a URL is unindexed. It identifies URLs from the live sitemap that have not earned Search Console page impressions in the lookback window, which is the fastest practical queue for crawl/link/content pressure.

## Manual GSC Request Batch

Use these first if manually requesting indexing in Search Console.

${table(['#', 'URL', 'Tags'], manualRows)}

## Priority No-Visibility Queue

${table(['#', 'Score', 'Path', 'Tags', 'Why This Matters'], topRows)}

## Current Visible Leaders

${table(['#', 'Path', 'Clicks', 'Impr.', 'CTR', 'Pos.'], visibleTableRows)}

## Next Actions

- Resubmit \`https://www.kamnuanlek.com/sitemap-index.xml\` in GSC.
- Submit live sitemap URLs to IndexNow.
- Add/strengthen internal links to the top 15 queue URLs from homepage/category/article hubs.
- Upgrade the first answer block and FAQ schema for queued URLs with high-volume tags.
`;
}

async function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const generatedDate = bangkokDate();

  const [sitemapUrls, visiblePayload] = await Promise.all([
    fetchLiveSitemapUrls(),
    queryVisiblePages(buildAuth()),
  ]);

  const queue = buildQueue(sitemapUrls, visiblePayload.rows);
  const sitemapVisibleCount = queue.allRows.filter((row) => row.hasGscVisibility).length;
  const summary = {
    sitemapUrls: sitemapUrls.length,
    gscPageRows: visiblePayload.rows.length,
    sitemapUrlsWithGscVisibility: sitemapVisibleCount,
    sitemapUrlsWithNoGscVisibility: queue.allRows.length - sitemapVisibleCount,
  };
  const payload = {
    generatedAt: new Date().toISOString(),
    generatedDate,
    siteUrl: `${SITE_URL}/`,
    gscSiteUrl: visiblePayload.siteUrl,
    range: visiblePayload.range,
    summary,
    queue: {
      notVisible: queue.notVisible,
      visible: queue.visible,
    },
  };

  const latestJson = path.join(REPORT_DIR, 'indexation-priority-queue-latest.json');
  const latestMd = path.join(REPORT_DIR, 'indexation-priority-queue-latest.md');
  const latestTxt = path.join(REPORT_DIR, 'indexation-priority-queue-latest.txt');
  const datedJson = path.join(REPORT_DIR, `indexation-priority-queue-${generatedDate}.json`);
  const datedMd = path.join(REPORT_DIR, `indexation-priority-queue-${generatedDate}.md`);

  fs.writeFileSync(latestJson, JSON.stringify(payload, null, 2), 'utf8');
  fs.writeFileSync(datedJson, JSON.stringify(payload, null, 2), 'utf8');
  fs.writeFileSync(latestMd, renderReport(payload), 'utf8');
  fs.writeFileSync(datedMd, renderReport(payload), 'utf8');
  fs.writeFileSync(latestTxt, queue.notVisible.map((row) => row.url).join('\n') + '\n', 'utf8');

  console.log(JSON.stringify({
    status: 'ok',
    ...summary,
    priorityQueue: queue.notVisible.length,
    reports: {
      latestMd,
      latestJson,
      latestTxt,
      datedMd,
      datedJson,
    },
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
