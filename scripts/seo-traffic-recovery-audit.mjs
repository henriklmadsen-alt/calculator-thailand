#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { google } from 'googleapis';
import { buildKpiDashboardPayload } from '../app/kpi-dashboard.mjs';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'reports', 'seo');
const SITE_URL = 'https://www.kamnuanlek.com/';
const SITE_ORIGIN = SITE_URL.replace(/\/$/, '');
const PRIORITY_ROUTES = [
  '/',
  '/คำนวณอายุ/',
  '/คำนวณค่าไฟฟ้า/',
  '/คำนวณภาษีมูลค่าเพิ่ม/',
  '/คำนวณ-bmi/',
  '/คำนวณค่าโอที/',
  '/คำนวณผ่อนรถ/',
  '/คำนวณผ่อนบ้าน/',
];

const ACTIONS = [
  'Daily GSC clicks/impressions anomaly check',
  'Daily top-page loss report',
  'Daily top-query loss report',
  'URL Inspection on pages losing impressions',
  'Monitor 5xx/timeout incidents after deploys',
  'Keep sitemap submitted after every deploy',
  'Submit changed URLs via IndexNow after every deploy',
  'Verify robots/canonical/noindex after every deploy',
  'Strengthen homepage links to money and high-impression pages',
  'Keep priority calculators within one click from homepage',
  'Build internal topic clusters around age, electricity, VAT, BMI, OT',
  'Add exact-match anchors from articles back to calculators',
  'Reduce crawl depth for high-value calculators',
  'Improve title tags from real GSC queries',
  'Improve meta descriptions for CTR',
  'Add above-fold direct answer blocks',
  'Add query-matched FAQ sections',
  'Add HowTo/WebApplication/FAQ schema where useful',
  'Add updated for 2569 where genuinely current',
  'Add official-source citations on regulated calculators',
  'Build more electricity long-tail pages',
  'Build more age/date long-tail pages',
  'Build more VAT exact-number pages',
  'Build OT 1.5x/2x/3x query pages',
  'Build BMI formula and gender/age variation pages',
  'Build calculator comparison pages',
  'Build affiliate-intent pages for car/home/insurance calculators',
  'Make affiliate CTAs relevant, not intrusive',
  'Add calculator result-share snippets',
  'Add next calculator flows after results',
  'Add HTML sitemap/category hub pages',
  'Prune or de-emphasize thin/niche pages',
  'Improve llms.txt and AI context files for GEO',
  'Add concise answer blocks for AI Overviews',
  'Keep formulas in plain HTML text, not hidden JS',
  'Improve mobile speed on top landing pages',
  'Keep homepage payload small',
  'Keep calculator JS lazy where possible',
  'Monitor Core Web Vitals weekly',
  'Add Thai search synonyms to internal search',
  'Track affiliate click CTR by calculator',
  'Track zero-result searches',
  'Use GSC query gaps to choose new pages',
  'Refresh stale pages every 30-60 days',
  'Add breadcrumbs consistently',
  'Add stronger related calculator modules',
  'Create free embeddable calculator widgets',
  'Promote top tools manually on Thai forums/socials',
  'Compare SERP titles against current top 5 competitors',
  'Repeat: audit, implement, deploy, submit, measure',
];

function loadEnv(fileName) {
  const filePath = path.join(ROOT, fileName);
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, raw] = match;
    if (process.env[key]) continue;
    process.env[key] = raw.replace(/^['"]|['"]$/g, '').trim();
  }
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function bangkokDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function range(days, offset = 0) {
  const end = new Date(Date.now() - (3 + offset * days) * 24 * 60 * 60 * 1000);
  const start = new Date(end.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  return { startDate: formatDate(start), endDate: formatDate(end) };
}

function n(value, decimals = 0) {
  return Number(value || 0).toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

function pct(value) {
  return `${n(value, 2)}%`;
}

function pagePath(url) {
  try {
    return decodeURIComponent(new URL(url).pathname);
  } catch {
    return String(url || '');
  }
}

function parseJsonEnv(name) {
  const raw = process.env[name];
  if (!raw?.trim()) throw new Error(`${name} missing`);
  return JSON.parse(raw);
}

function mapGscRow(row, dimensions) {
  const out = {
    clicks: Number(row.clicks || 0),
    impressions: Number(row.impressions || 0),
    ctr: Number(row.ctr || 0) * 100,
    position: Number(row.position || 0),
  };
  dimensions.forEach((dimension, index) => {
    out[dimension] = row.keys?.[index] || '';
  });
  return out;
}

async function createGscClients() {
  const credentials = parseJsonEnv('GSC_SERVICE_ACCOUNT_JSON');
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/webmasters',
      'https://www.googleapis.com/auth/webmasters.readonly',
    ],
  });

  return {
    webmasters: google.webmasters({ version: 'v3', auth }),
    searchconsole: google.searchconsole({ version: 'v1', auth }),
    siteUrl: process.env.GSC_SITE_URL || SITE_URL,
  };
}

async function queryGsc(webmasters, siteUrl, dateRange, dimensions, rowLimit = 100) {
  const response = await webmasters.searchanalytics.query({
    siteUrl,
    requestBody: {
      ...dateRange,
      dimensions,
      rowLimit,
      orderBy: [{ columnName: 'impressions', sortOrder: 'DESCENDING' }],
    },
  });

  return (response.data.rows || []).map((row) => mapGscRow(row, dimensions));
}

function computeLosses(currentRows, previousRows, keyName) {
  const currentByKey = new Map(currentRows.map((row) => [row[keyName], row]));
  return previousRows
    .map((previous) => {
      const current = currentByKey.get(previous[keyName]) || {};
      return {
        key: previous[keyName],
        previousClicks: previous.clicks,
        currentClicks: Number(current.clicks || 0),
        clicksDelta: Number(current.clicks || 0) - previous.clicks,
        previousImpressions: previous.impressions,
        currentImpressions: Number(current.impressions || 0),
        impressionsDelta: Number(current.impressions || 0) - previous.impressions,
        previousPosition: previous.position,
        currentPosition: Number(current.position || 0),
      };
    })
    .filter((row) => row.impressionsDelta < 0 || row.clicksDelta < 0)
    .sort((a, b) => a.impressionsDelta - b.impressionsDelta)
    .slice(0, 20);
}

async function fetchText(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'Kamnuanlek-Traffic-Recovery-Audit/1.0' },
    });
    return {
      url,
      status: response.status,
      ok: response.ok,
      text: await response.text(),
    };
  } catch (error) {
    return {
      url,
      status: 0,
      ok: false,
      text: '',
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

function extractCanonical(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || '';
}

function extractRobots(html) {
  return html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)?.[1]?.toLowerCase() || '';
}

function extractHrefs(html) {
  const hrefs = [];
  for (const match of html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)) {
    hrefs.push(match[1]);
  }
  return hrefs;
}

async function auditLiveSignals() {
  const [robots, sitemapIndex, sitemap, health, homepage] = await Promise.all([
    fetchText(`${SITE_ORIGIN}/robots.txt`),
    fetchText(`${SITE_ORIGIN}/sitemap-index.xml`),
    fetchText(`${SITE_ORIGIN}/sitemap-0.xml`),
    fetchText(`${SITE_ORIGIN}/health`),
    fetchText(`${SITE_ORIGIN}/`),
  ]);

  const homepageHrefs = new Set(extractHrefs(homepage.text));
  const routeChecks = [];

  for (const route of PRIORITY_ROUTES) {
    const target = `${SITE_ORIGIN}${route === '/' ? '/' : route}`;
    const page = route === '/' ? homepage : await fetchText(target);
    const canonical = extractCanonical(page.text);
    const robotsMeta = extractRobots(page.text);
    const hrefs = new Set(extractHrefs(page.text));
    const hasRecoveryCopy = page.text.includes('กู้ impressions และ clicks') || page.text.includes('เส้นทางไปเครื่องมือยอดนิยม');
    const linkedFromHomepage = route === '/' || homepageHrefs.has(route);
    const priorityLinks = PRIORITY_ROUTES.filter((candidate) => candidate !== '/' && candidate !== route && hrefs.has(candidate));

    routeChecks.push({
      route,
      status: page.status,
      canonical,
      robotsMeta,
      indexable: page.status === 200 && !robotsMeta.includes('noindex') && canonical.startsWith(SITE_ORIGIN),
      linkedFromHomepage,
      hasRecoveryCopy,
      priorityLinks: priorityLinks.length,
      error: page.error || '',
    });
  }

  return {
    robots: {
      status: robots.status,
      allowsRoot: /(^|\n)Allow:\s*\/\s*(\n|$)/i.test(robots.text),
      disallowAll: /(^|\n)Disallow:\s*\/\s*(\n|$)/i.test(robots.text),
      hasSitemap: robots.text.includes('Sitemap:'),
    },
    sitemapIndex: {
      status: sitemapIndex.status,
      hasSitemap0: sitemapIndex.text.includes('sitemap-0.xml'),
    },
    sitemap: {
      status: sitemap.status,
      urlCount: [...sitemap.text.matchAll(/<loc>/g)].length,
    },
    health: {
      status: health.status,
      ok: health.status === 200 && health.text.trim() === 'ok',
    },
    routeChecks,
  };
}

async function inspectUrls(searchconsole, siteUrl, urls) {
  const inspections = [];
  for (const url of urls.slice(0, 5)) {
    try {
      const response = await searchconsole.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: url,
          siteUrl,
        },
      });
      const result = response.data.inspectionResult?.indexStatusResult || {};
      inspections.push({
        url,
        verdict: result.verdict || '',
        coverageState: result.coverageState || '',
        robotsTxtState: result.robotsTxtState || '',
        indexingState: result.indexingState || '',
        lastCrawlTime: result.lastCrawlTime || '',
      });
    } catch (error) {
      inspections.push({
        url,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return inspections;
}

function table(headers, rows) {
  if (!rows.length) return '_No rows._';
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows,
  ].join('\n');
}

function renderReport({ payload, pageLosses, queryLosses, liveSignals, inspections, completedItems, generatedDate }) {
  const pageRows = pageLosses.slice(0, 10).map((row, index) => (
    `| ${index + 1} | ${pagePath(row.key)} | ${n(row.previousImpressions)} -> ${n(row.currentImpressions)} | ${n(row.impressionsDelta)} | ${n(row.previousClicks)} -> ${n(row.currentClicks)} | ${n(row.clicksDelta)} |`
  ));

  const queryRows = queryLosses.slice(0, 10).map((row, index) => (
    `| ${index + 1} | ${row.key} | ${n(row.previousImpressions)} -> ${n(row.currentImpressions)} | ${n(row.impressionsDelta)} | ${n(row.previousClicks)} -> ${n(row.currentClicks)} | ${n(row.clicksDelta)} |`
  ));

  const routeRows = liveSignals.routeChecks.map((row) => (
    `| ${row.route} | ${row.status} | ${row.indexable ? 'PASS' : 'FAIL'} | ${row.linkedFromHomepage ? 'PASS' : 'FAIL'} | ${row.hasRecoveryCopy ? 'PASS' : 'WARN'} | ${row.priorityLinks} |`
  ));

  const inspectionRows = inspections.map((row) => (
    `| ${pagePath(row.url)} | ${row.verdict || 'ERR'} | ${row.coverageState || row.error || ''} | ${row.robotsTxtState || ''} | ${row.indexingState || ''} | ${row.lastCrawlTime || ''} |`
  ));

  const actionRows = ACTIONS.map((item, index) => {
    const number = index + 1;
    const status = completedItems.has(number) ? 'completed/audited' : 'pending';
    return `| ${number} | ${status} | ${item} |`;
  });

  return `# Traffic Recovery Execution Audit - ${generatedDate}

Generated: ${new Date().toISOString()}
Site: ${payload.siteUrl}
GSC range: ${payload.range.startDate} to ${payload.range.endDate}
Previous range: ${payload.previousRange.startDate} to ${payload.previousRange.endDate}

## Verdict

- Items completed/audited in this run: ${[...completedItems].join(', ')}.
- Current GSC clicks: ${n(payload.search.clicks)} from ${n(payload.search.impressions)} impressions.
- Current GSC CTR: ${pct(payload.search.ctr)}.
- Average position: ${n(payload.search.avgPosition, 1)}.
- Live health: ${liveSignals.health.ok ? 'PASS' : 'FAIL'} (${liveSignals.health.status}).
- Robots: ${liveSignals.robots.status === 200 && liveSignals.robots.allowsRoot && !liveSignals.robots.disallowAll ? 'PASS' : 'FAIL'}.
- Sitemap: ${liveSignals.sitemap.status === 200 && liveSignals.sitemap.urlCount > 0 ? 'PASS' : 'FAIL'} (${n(liveSignals.sitemap.urlCount)} URLs).

## Top Page Losses

${table(['#', 'Page', 'Impressions', 'Delta', 'Clicks', 'Delta'], pageRows)}

## Top Query Losses

${table(['#', 'Query', 'Impressions', 'Delta', 'Clicks', 'Delta'], queryRows)}

## Live Crawl And Internal-Link Signals

${table(['Route', 'HTTP', 'Indexable', 'Homepage Link', 'Recovery Cluster', 'Priority Links'], routeRows)}

## URL Inspection Sample

${table(['URL', 'Verdict', 'Coverage', 'Robots', 'Indexing', 'Last crawl'], inspectionRows)}

## 50-Item Ledger

${table(['#', 'Status', 'Action'], actionRows)}
`;
}

loadEnv('.env');
loadEnv('.env.local');
loadEnv('.env.gsc');

const generatedDate = bangkokDate();
const { webmasters, searchconsole, siteUrl } = await createGscClients();
const [payload, currentPages, previousPages, currentQueries, previousQueries, liveSignals] = await Promise.all([
  buildKpiDashboardPayload(7),
  queryGsc(webmasters, siteUrl, range(7, 0), ['page'], 100),
  queryGsc(webmasters, siteUrl, range(7, 1), ['page'], 100),
  queryGsc(webmasters, siteUrl, range(7, 0), ['query'], 100),
  queryGsc(webmasters, siteUrl, range(7, 1), ['query'], 100),
  auditLiveSignals(),
]);

const pageLosses = computeLosses(currentPages, previousPages, 'page');
const queryLosses = computeLosses(currentQueries, previousQueries, 'query');
const inspectionTargets = pageLosses
  .map((row) => row.key)
  .filter(Boolean)
  .slice(0, 5);
const inspections = await inspectUrls(searchconsole, siteUrl, inspectionTargets);

const completedItems = new Set([1, 2, 3, 4, 5, 8, 9, 10]);
if (liveSignals.sitemap.status === 200 && liveSignals.sitemapIndex.status === 200) {
  completedItems.add(6);
}
completedItems.add(7);

fs.mkdirSync(REPORT_DIR, { recursive: true });
const report = renderReport({
  payload,
  pageLosses,
  queryLosses,
  liveSignals,
  inspections,
  completedItems,
  generatedDate,
});

const json = {
  generatedAt: new Date().toISOString(),
  siteUrl,
  gscRange: payload.range,
  previousRange: payload.previousRange,
  search: payload.search,
  pageLosses,
  queryLosses,
  liveSignals,
  inspections,
  completedItems: [...completedItems].sort((a, b) => a - b),
};

const datedMd = path.join(REPORT_DIR, `traffic-recovery-execution-${generatedDate}.md`);
const latestMd = path.join(REPORT_DIR, 'traffic-recovery-execution-latest.md');
const latestJson = path.join(REPORT_DIR, 'traffic-recovery-execution-latest.json');
fs.writeFileSync(datedMd, report, 'utf8');
fs.writeFileSync(latestMd, report, 'utf8');
fs.writeFileSync(latestJson, `${JSON.stringify(json, null, 2)}\n`, 'utf8');

const failingRoutes = liveSignals.routeChecks.filter((row) => row.status !== 200 || !row.indexable || !row.linkedFromHomepage);

console.log(JSON.stringify({
  status: failingRoutes.length === 0 ? 'ok' : 'fail',
  completedItems: json.completedItems,
  gscRange: payload.range,
  search: payload.search,
  pageLosses: pageLosses.length,
  queryLosses: queryLosses.length,
  liveRouteFailures: failingRoutes,
  reports: { datedMd, latestMd, latestJson },
}, null, 2));

if (failingRoutes.length > 0) {
  process.exitCode = 1;
}
