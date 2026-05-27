import { appendFile, mkdir, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = fileURLToPath(new URL('..', import.meta.url));
const AFFILIATE_EVENTS_DIR = join(ROOT_DIR, '.events', 'affiliate-redirects');
const ROOJAI_LANDING_RID = 'LLC752cDb7BoO82Ug1sQqjBjKB71zESLVKZI%2BmVkhvw%3D';
const ROOJAI_AFFILIATE_URL = `https://portal.roojaipartners.com/product/#/?pageName=product&rid=${ROOJAI_LANDING_RID}&lang=th&productType=allProduct`;
const ROOJAI_SHORTLINK_URL = 'https://portal.roojaipartners.com/#/23424769e701bcaa';
const KNOWN_PARTNER_SLUGS = new Set([
  'roojai-partners',
  'rabbit-care-loan',
  'rabbit-care-car',
  'rabbit-care-home',
  'rabbit-care-insurance',
  'kasikorn-savings',
  'ttb-cash2go',
  'ktc-brother-berm',
  'ngern-tid-lor',
  'tipinsure',
  'uob-tmrw',
  'krungsri-signature',
  'kept-krungsri',
  'rabbit-care-health-cpl',
]);

function getBangkokDateKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function cleanSubId(value) {
  const decoded = safeDecode(String(value || '').trim());
  return decoded.replace(/[\r\n\t]/g, ' ').slice(0, 180);
}

function cleanTrackingParam(value) {
  const decoded = safeDecode(String(value || '').trim());
  return decoded.replace(/[^a-zA-Z0-9_.:-]/g, '').slice(0, 80);
}

function isSafeAffiliateTarget(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === 'portal.roojaipartners.com';
  } catch {
    return false;
  }
}

function getAffiliateTargetUrl() {
  const configured = String(process.env.AFFILIATE_URL_ROOJAI_PARTNERS || '').trim();
  if (configured === ROOJAI_SHORTLINK_URL) return ROOJAI_AFFILIATE_URL;
  if (configured && isSafeAffiliateTarget(configured)) return configured;
  return ROOJAI_AFFILIATE_URL;
}

async function logAffiliateRedirect({ slug, subId, experiment, variant, referer }) {
  const date = getBangkokDateKey();
  const event = {
    type: 'affiliate_redirect',
    timestamp: new Date().toISOString(),
    date,
    slug,
    subId,
    experiment,
    variant,
    referer: String(referer || '').slice(0, 240),
  };

  await mkdir(AFFILIATE_EVENTS_DIR, { recursive: true });
  await appendFile(join(AFFILIATE_EVENTS_DIR, `${date}.jsonl`), `${JSON.stringify(event)}\n`, 'utf8');
}

export async function handleAffiliateRedirect(req, res, url) {
  const match = url.pathname.match(/^\/go\/([^/]+)\/?$/);
  if (!match) return false;

  const slug = safeDecode(match[1]);
  if (!KNOWN_PARTNER_SLUGS.has(slug)) return false;

  const subId = cleanSubId(url.searchParams.get('sub_id') || '');
  const experiment = cleanTrackingParam(url.searchParams.get('experiment') || '');
  const variant = cleanTrackingParam(url.searchParams.get('variant') || '');
  const targetUrl = getAffiliateTargetUrl();

  logAffiliateRedirect({
    slug,
    subId,
    experiment,
    variant,
    referer: req.headers.referer || req.headers.referrer || '',
  }).catch((error) => {
    console.error('[affiliate-redirect] failed to log event:', error);
  });

  res.writeHead(302, {
    Location: targetUrl,
    'Cache-Control': 'no-store, max-age=0',
    'Referrer-Policy': 'origin-when-cross-origin',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
  });
  res.end();
  return true;
}

export async function getAffiliateRedirectSummary(days = 28) {
  const safeDays = Math.min(Math.max(Number.parseInt(String(days || 28), 10) || 28, 1), 180);
  const wantedDates = new Set();
  for (let i = 0; i < safeDays; i += 1) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    wantedDates.add(getBangkokDateKey(date));
  }

  const totals = { redirects: 0 };
  const byPage = new Map();
  const bySlug = new Map();
  const byVariant = new Map();

  let files = [];
  try {
    files = await readdir(AFFILIATE_EVENTS_DIR);
  } catch {
    return { totals, pages: [], partners: [] };
  }

  for (const file of files) {
    const date = file.replace(/\.jsonl$/, '');
    if (!wantedDates.has(date)) continue;

    const raw = await readFile(join(AFFILIATE_EVENTS_DIR, file), 'utf8').catch(() => '');
    for (const line of raw.split(/\r?\n/)) {
      if (!line.trim()) continue;
      try {
        const event = JSON.parse(line);
        if (event.type !== 'affiliate_redirect') continue;
        totals.redirects += 1;

        const pageKey = event.subId || '(no sub_id)';
        const page = byPage.get(pageKey) || { page: pageKey, label: pageKey, redirects: 0 };
        page.redirects += 1;
        byPage.set(pageKey, page);

        const slugKey = event.slug || 'unknown';
        const partner = bySlug.get(slugKey) || { slug: slugKey, redirects: 0 };
        partner.redirects += 1;
        bySlug.set(slugKey, partner);

        const variantKey = [event.experiment || 'no-experiment', event.variant || 'no-variant'].join(':');
        const variant = byVariant.get(variantKey) || {
          experiment: event.experiment || 'no-experiment',
          variant: event.variant || 'no-variant',
          redirects: 0,
        };
        variant.redirects += 1;
        byVariant.set(variantKey, variant);
      } catch {
        // Ignore malformed log lines.
      }
    }
  }

  return {
    totals,
    pages: [...byPage.values()].sort((a, b) => b.redirects - a.redirects),
    partners: [...bySlug.values()].sort((a, b) => b.redirects - a.redirects),
    variants: [...byVariant.values()].sort((a, b) => b.redirects - a.redirects),
  };
}
