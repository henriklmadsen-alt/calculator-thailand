import { appendFile, mkdir, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = fileURLToPath(new URL('..', import.meta.url));
const CLIENT_EVENTS_DIR = join(ROOT_DIR, '.events', 'client-events');
const MAX_BODY_BYTES = 16 * 1024;
const PUBLIC_EVENT_NAMES = new Set([
  'affiliate_cta_view',
  'affiliate_click',
  'affiliate_click_unconfigured',
  'site_search',
  'site_search_zero_results',
  'related_calc_click',
]);

function getBangkokDateKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function cleanString(value, maxLength = 240) {
  return String(value || '').replace(/[\r\n\t]/g, ' ').slice(0, maxLength);
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value || '{}');
  } catch {
    return {};
  }
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        reject(new Error('payload_too_large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function normalizeEvent(raw, req) {
  const eventType = cleanString(raw.eventType || raw.eventName, 80);
  if (!PUBLIC_EVENT_NAMES.has(eventType)) return null;

  const properties = raw.properties && typeof raw.properties === 'object' ? raw.properties : {};
  return {
    type: eventType,
    timestamp: new Date().toISOString(),
    date: getBangkokDateKey(),
    sessionId: cleanString(raw.sessionId, 128),
    pageUrl: cleanString(raw.pageUrl || properties.page_path || req.headers.referer || '', 320),
    userAgent: cleanString(req.headers['user-agent'] || '', 240),
    properties: Object.fromEntries(
      Object.entries(properties).map(([key, value]) => [cleanString(key, 80), cleanString(value, 320)]),
    ),
  };
}

export async function handleClientEventRequest(req, res) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, max-age=0',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      ...headers,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return true;
  }

  if (req.method !== 'POST') return false;

  try {
    const rawBody = await readRequestBody(req);
    const event = normalizeEvent(safeJsonParse(rawBody), req);
    if (!event) {
      res.writeHead(202, headers);
      res.end(JSON.stringify({ ok: true, ignored: true }));
      return true;
    }

    await mkdir(CLIENT_EVENTS_DIR, { recursive: true });
    await appendFile(join(CLIENT_EVENTS_DIR, `${event.date}.jsonl`), `${JSON.stringify(event)}\n`, 'utf8');

    res.writeHead(201, headers);
    res.end(JSON.stringify({ ok: true }));
    return true;
  } catch (error) {
    const status = error?.message === 'payload_too_large' ? 413 : 500;
    res.writeHead(status, headers);
    res.end(JSON.stringify({ ok: false, error: status === 413 ? 'payload_too_large' : 'event_log_failed' }));
    return true;
  }
}

export async function getClientEventSummary(days = 28) {
  const safeDays = Math.min(Math.max(Number.parseInt(String(days || 28), 10) || 28, 1), 180);
  const wantedDates = new Set();
  for (let i = 0; i < safeDays; i += 1) {
    wantedDates.add(getBangkokDateKey(new Date(Date.now() - i * 24 * 60 * 60 * 1000)));
  }

  const totals = {
    affiliateCtaViews: 0,
    affiliateClicks: 0,
    zeroSearches: 0,
    relatedClicks: 0,
  };
  const affiliateByCalculator = new Map();
  const zeroSearchTerms = new Map();

  let files = [];
  try {
    files = await readdir(CLIENT_EVENTS_DIR);
  } catch {
    return { totals, affiliateByCalculator: [], zeroSearchTerms: [] };
  }

  for (const file of files) {
    const date = file.replace(/\.jsonl$/, '');
    if (!wantedDates.has(date)) continue;
    const raw = await readFile(join(CLIENT_EVENTS_DIR, file), 'utf8').catch(() => '');
    for (const line of raw.split(/\r?\n/)) {
      if (!line.trim()) continue;
      try {
        const event = JSON.parse(line);
        const props = event.properties || {};
        const calculatorPath = props.calculator_path || props.page_path || event.pageUrl || '(unknown)';

        if (event.type === 'affiliate_cta_view') totals.affiliateCtaViews += 1;
        if (event.type === 'affiliate_click') totals.affiliateClicks += 1;
        if (event.type === 'site_search_zero_results') totals.zeroSearches += 1;
        if (event.type === 'related_calc_click') totals.relatedClicks += 1;

        if (event.type === 'affiliate_cta_view' || event.type === 'affiliate_click') {
          const row = affiliateByCalculator.get(calculatorPath) || {
            calculatorPath,
            ctaViews: 0,
            clicks: 0,
            clickRate: 0,
          };
          if (event.type === 'affiliate_cta_view') row.ctaViews += 1;
          if (event.type === 'affiliate_click') row.clicks += 1;
          row.clickRate = row.ctaViews > 0 ? Math.round((row.clicks / row.ctaViews) * 10000) / 100 : 0;
          affiliateByCalculator.set(calculatorPath, row);
        }

        if (event.type === 'site_search_zero_results') {
          const term = props.search_term || '(empty)';
          const row = zeroSearchTerms.get(term) || { term, count: 0 };
          row.count += 1;
          zeroSearchTerms.set(term, row);
        }
      } catch {
        // Ignore malformed event lines.
      }
    }
  }

  return {
    totals,
    affiliateByCalculator: [...affiliateByCalculator.values()].sort((a, b) => b.clicks - a.clicks),
    zeroSearchTerms: [...zeroSearchTerms.values()].sort((a, b) => b.count - a.count),
  };
}
