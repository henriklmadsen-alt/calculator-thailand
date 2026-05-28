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

const ARTICLE_ANCHOR_CHECKS = [
  { article: '/บทความ/1-kwh-เท่ากับกี่บาท-2569/', target: '/คำนวณค่าไฟฟ้า/' },
  { article: '/บทความ/คำนวณอายุวันนี้-จากวันเกิด/', target: '/คำนวณอายุ/' },
  { article: '/บทความ/10000-หาร-1-07-ถอด-vat/', target: '/คำนวณภาษีมูลค่าเพิ่ม/' },
  { article: '/บทความ/ดาวน์รถ-20-เปอร์เซ็นต์-ผ่อนเท่าไร/', target: '/คำนวณผ่อนรถ/' },
  { article: '/บทความ/กู้บ้าน-2500000-บาท-30-ปี/', target: '/คำนวณผ่อนบ้าน/' },
];

const TITLE_TERM_CHECKS = [
  { route: '/คำนวณอายุ/', terms: ['คำนวณอายุ'] },
  { route: '/คำนวณค่าไฟฟ้า/', terms: ['ค่าไฟ'] },
  { route: '/คำนวณภาษีมูลค่าเพิ่ม/', terms: ['VAT'] },
  { route: '/คำนวณผ่อนรถ/', terms: ['ตารางผ่อนรถ'] },
  { route: '/คำนวณผ่อนบ้าน/', terms: ['ตารางผ่อนบ้าน'] },
];

const META_TERM_CHECKS = [
  { route: '/คำนวณอายุ/', terms: ['คำนวณอายุ'] },
  { route: '/คำนวณค่าไฟฟ้า/', terms: ['ค่าไฟ'] },
  { route: '/คำนวณภาษีมูลค่าเพิ่ม/', terms: ['VAT'] },
  { route: '/คำนวณผ่อนรถ/', terms: ['ตารางผ่อนรถ'] },
  { route: '/คำนวณผ่อนบ้าน/', terms: ['คำนวณดอกเบี้ยบ้าน'] },
];

const DIRECT_ANSWER_ROUTES = [
  '/คำนวณอายุ/',
  '/คำนวณค่าไฟฟ้า/',
  '/คำนวณภาษีมูลค่าเพิ่ม/',
  '/คำนวณผ่อนรถ/',
  '/คำนวณผ่อนบ้าน/',
];

const OFFICIAL_REFERENCE_ROUTES = [
  '/คำนวณค่าไฟฟ้า/',
  '/คำนวณภาษีมูลค่าเพิ่ม/',
  '/คำนวณค่าโอที/',
  '/คำนวณผ่อนรถ/',
  '/คำนวณผ่อนบ้าน/',
];

const CONTENT_EXPANSION_CHECKS = [
  {
    item: 21,
    label: 'electricity long-tail',
    target: '/คำนวณค่าไฟฟ้า/',
    paths: [
      '/บทความ/1-kwh-เท่ากับกี่บาท-2569/',
      '/บทความ/บ้านใช้ไฟ-500-หน่วย-ค่าไฟเท่าไร-2569/',
      '/บทความ/ค่าไฟห้องเช่าหน่วยละกี่บาท-2569/',
    ],
  },
  {
    item: 22,
    label: 'age/date long-tail',
    target: '/คำนวณอายุ/',
    paths: [
      '/บทความ/คำนวณอายุวันนี้-จากวันเกิด/',
      '/บทความ/เกิดปี-2535-อายุเท่าไร-2569/',
      '/บทความ/คำนวณอายุ-จากวันเกิด-2569-ปี-เดือน-วัน/',
    ],
  },
  {
    item: 23,
    label: 'VAT exact-number long-tail',
    target: '/คำนวณภาษีมูลค่าเพิ่ม/',
    paths: [
      '/บทความ/10000-หาร-1-07-ถอด-vat/',
      '/บทความ/5000-รวม-vat-7-เป็นเท่าไร/',
      '/บทความ/ภาษีมูลค่าเพิ่ม-7-คิดยังไง-สูตรบวกภาษี-ถอดภาษี-ตั้งราคาขายให้ไม่ขาดทุน/',
    ],
  },
  {
    item: 24,
    label: 'overtime multiplier long-tail',
    target: '/คำนวณค่าโอที/',
    paths: [
      '/บทความ/โอที-1-5-เท่า-คิดยังไง-2569/',
      '/บทความ/เงินเดือน-20000-โอที-10-ชั่วโมง/',
      '/บทความ/คำนวณค่าโอที-2569-กฎหมายแรงงาน/',
    ],
  },
  {
    item: 25,
    label: 'BMI formula long-tail',
    target: '/คำนวณ-bmi/',
    paths: [
      '/บทความ/bmi-25-หมายความว่าอะไร/',
      '/บทความ/bmi-27-หมายความว่าอะไร/',
      '/บทความ/วิธีวัด-bmi-อย่างถูกต้อง/',
    ],
  },
];

const COMPARISON_PAGE_CHECKS = [
  '/บทความ/เปรียบเทียบเครื่องคำนวณออนไลน์-เลือกอะไรดี/',
  '/เปรียบเทียบเครื่องคำนวณภาษี/',
  '/เปรียบเทียบสินเชื่อรถ/',
];

const AFFILIATE_INTENT_CHECKS = [
  { path: '/บทความ/คำนวณผ่อนรถแล้วซื้อประกันชั้นไหน-2569/', affiliate: '/go/rabbit-care-car/' },
  { path: '/คำนวณผ่อนรถ/', affiliate: '/go/rabbit-care-car/' },
  { path: '/คำนวณผ่อนบ้าน/', affiliate: '/go/rabbit-care-home/' },
];

const RESULT_SHARE_ROUTES = [
  '/คำนวณค่าไฟฟ้า/',
  '/คำนวณค่าโอที/',
  '/คำนวณผ่อนรถ/',
  '/คำนวณผ่อนบ้าน/',
  '/คำนวณ-bmi/',
];

const NEXT_ACTION_ROUTES = [
  '/คำนวณค่าไฟฟ้า/',
  '/คำนวณค่าโอที/',
  '/คำนวณผ่อนรถ/',
  '/คำนวณผ่อนบ้าน/',
];

const HTML_SITEMAP_ROUTE = '/แผนผังเว็บไซต์/';

const CATEGORY_HUB_ROUTES = [
  '/หมวดหมู่/ภาษี/',
  '/หมวดหมู่/สินเชื่อ/',
  '/หมวดหมู่/เกษตร/',
  '/หมวดหมู่/ธุรกิจ/',
];

const AI_OVERVIEW_ROUTES = [
  '/คำนวณค่าไฟฟ้า/',
  '/คำนวณอายุ/',
  '/คำนวณภาษีมูลค่าเพิ่ม/',
  '/คำนวณค่าโอที/',
  '/คำนวณ-bmi/',
  '/คำนวณผ่อนรถ/',
  '/คำนวณผ่อนบ้าน/',
];

const PLAIN_FORMULA_CHECKS = [
  { route: '/คำนวณค่าไฟฟ้า/', terms: ['ค่าไฟรวม', 'ค่า Ft', 'VAT'] },
  { route: '/คำนวณอายุ/', terms: ['ปี', 'เดือน', 'วัน'] },
  { route: '/คำนวณภาษีมูลค่าเพิ่ม/', terms: ['1.07', 'VAT', 'ราคาก่อน VAT'] },
  { route: '/คำนวณค่าโอที/', terms: ['1.5', '2', '3'] },
  { route: '/คำนวณ-bmi/', terms: ['BMI =', 'น้ำหนัก', 'ส่วนสูง'] },
  { route: '/คำนวณผ่อนรถ/', terms: ['ค่างวด', 'ยอดจัดไฟแนนซ์', 'ดอกเบี้ยรวม'] },
  { route: '/คำนวณผ่อนบ้าน/', terms: ['PMT', 'ดอกเบี้ย', 'ค่างวด'] },
];

const SEARCH_SYNONYM_TERMS = ['ค่าไฟบ้าน', 'ค่างวดรถ', 'โอที', 'หาร 1.07', 'ดัชนีมวลกาย'];

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

function extractTitle(html) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() || '';
}

function extractDescription(html) {
  return html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]?.replace(/\s+/g, ' ').trim() || '';
}

function extractHrefs(html) {
  const hrefs = [];
  for (const match of html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)) {
    hrefs.push(match[1]);
  }
  return hrefs;
}

function textHasAllTerms(text, terms) {
  const haystack = String(text || '').toLocaleLowerCase('th-TH');
  return terms.every((term) => haystack.includes(term.toLocaleLowerCase('th-TH')));
}

function hrefSetHasTarget(hrefs, target) {
  const encodedTarget = encodeURI(target);
  const absolute = `${SITE_ORIGIN}${target}`;
  const absoluteEncoded = `${SITE_ORIGIN}${encodedTarget}`;
  return hrefs.has(target) || hrefs.has(encodedTarget) || hrefs.has(absolute) || hrefs.has(absoluteEncoded);
}

function routeByPathFromChecks(routeChecks, route) {
  return routeChecks.find((row) => row.route === route);
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
    const title = extractTitle(page.text);
    const description = extractDescription(page.text);
    const hrefs = new Set(extractHrefs(page.text));
    const hasRecoveryCopy = page.text.includes('กู้ impressions และ clicks') || page.text.includes('เส้นทางไปเครื่องมือยอดนิยม');
    const linkedFromHomepage = route === '/' || homepageHrefs.has(route);
    const priorityLinks = PRIORITY_ROUTES.filter((candidate) => candidate !== '/' && candidate !== route && hrefs.has(candidate));
    const titleTerms = TITLE_TERM_CHECKS.find((check) => check.route === route)?.terms || [];
    const metaTerms = META_TERM_CHECKS.find((check) => check.route === route)?.terms || [];
    const formulaTerms = PLAIN_FORMULA_CHECKS.find((check) => check.route === route)?.terms || [];

    routeChecks.push({
      route,
      status: page.status,
      title,
      description,
      canonical,
      robotsMeta,
      indexable: page.status === 200 && !robotsMeta.includes('noindex') && canonical.startsWith(SITE_ORIGIN),
      linkedFromHomepage,
      hasRecoveryCopy,
      priorityLinks: priorityLinks.length,
      titleMatchesGscTerms: titleTerms.length === 0 || textHasAllTerms(title, titleTerms),
      metaMatchesGscTerms: metaTerms.length === 0 || textHasAllTerms(description, metaTerms),
      hasDirectAnswer: page.text.includes('คำตอบเร็ว') || page.text.includes('คำตอบสั้น') || page.text.includes('สูตรคำนวณ'),
      hasFaqSchema: page.text.includes('"FAQPage"'),
      hasHowToSchema: page.text.includes('"HowTo"'),
      hasWebApplicationSchema: page.text.includes('"WebApplication"'),
      hasCurrentYear: page.text.includes('2569'),
      hasOfficialReference: page.text.includes('bot.or.th')
        || page.text.includes('pea.co.th')
        || page.text.includes('mea.or.th')
        || page.text.includes('rd.go.th')
        || page.text.includes('labour.go.th')
        || page.text.includes('mol.go.th'),
      hasResultShare: page.text.includes('data-result-share-prompt') || page.text.includes('ct-hub-share'),
      hasNextAction: page.text.includes('data-next-action-link'),
      hasAiOverviewAnswer: page.text.includes('data-ai-overview-answer'),
      hasPlainFormulaText: formulaTerms.length === 0 || textHasAllTerms(page.text, formulaTerms),
      hasRelevantAffiliate: page.text.includes('id="affiliate-card"')
        && page.text.includes('rel="sponsored')
        && page.text.includes('affiliate-card-wrapper')
        && page.text.includes('hidden'),
      error: page.error || '',
    });
  }

  const articleAnchorChecks = await Promise.all(ARTICLE_ANCHOR_CHECKS.map(async (check) => {
    const page = await fetchText(`${SITE_ORIGIN}${check.article}`);
    const hrefs = new Set(extractHrefs(page.text));
    return {
      ...check,
      status: page.status,
      hasTargetLink: page.status === 200 && hrefSetHasTarget(hrefs, check.target),
    };
  }));

  const contentExpansionChecks = await Promise.all(CONTENT_EXPANSION_CHECKS.map(async (group) => {
    const pages = await Promise.all(group.paths.map(async (route) => {
      const page = await fetchText(`${SITE_ORIGIN}${route}`);
      const hrefs = new Set(extractHrefs(page.text));
      return {
        route,
        status: page.status,
        hasTargetLink: page.status === 200 && hrefSetHasTarget(hrefs, group.target),
      };
    }));
    return {
      item: group.item,
      label: group.label,
      target: group.target,
      pages,
      pass: pages.every((page) => page.status === 200 && page.hasTargetLink),
    };
  }));

  const comparisonPageChecks = await Promise.all(COMPARISON_PAGE_CHECKS.map(async (route) => {
    const page = await fetchText(`${SITE_ORIGIN}${route}`);
    const hrefs = new Set(extractHrefs(page.text));
    return {
      route,
      status: page.status,
      linksPriorityCalculator: PRIORITY_ROUTES.some((candidate) => candidate !== '/' && hrefSetHasTarget(hrefs, candidate)),
    };
  }));

  const affiliateIntentChecks = await Promise.all(AFFILIATE_INTENT_CHECKS.map(async (check) => {
    const page = await fetchText(`${SITE_ORIGIN}${check.path}`);
    return {
      ...check,
      status: page.status,
      hasAffiliateLink: page.status === 200 && page.text.includes(check.affiliate) && page.text.includes('rel="sponsored'),
    };
  }));

  const htmlSitemap = await fetchText(`${SITE_ORIGIN}${HTML_SITEMAP_ROUTE}`);
  const htmlSitemapHrefs = new Set(extractHrefs(htmlSitemap.text));
  const categoryHubChecks = await Promise.all(CATEGORY_HUB_ROUTES.map(async (route) => {
    const page = await fetchText(`${SITE_ORIGIN}${route}`);
    return {
      route,
      status: page.status,
      hasPriorityStrip: page.text.includes('data-category-priority-strip'),
      hasDeemphasizedLongTail: page.text.includes('data-seo-priority="deemphasized"'),
    };
  }));

  const [llms, llmContext, searchIndex] = await Promise.all([
    fetchText(`${SITE_ORIGIN}/llms.txt`),
    fetchText(`${SITE_ORIGIN}/api/llm-context.json`),
    fetchText(`${SITE_ORIGIN}/api/calculator-search-index.json`),
  ]);

  const searchSynonymChecks = SEARCH_SYNONYM_TERMS.map((term) => ({
    term,
    present: searchIndex.text.includes(term),
  }));

  const themePath = path.join(ROOT, 'src', 'styles', 'theme.css');
  const packagePath = path.join(ROOT, 'package.json');
  const themeCss = fs.existsSync(themePath) ? fs.readFileSync(themePath, 'utf8') : '';
  const packageJson = fs.existsSync(packagePath) ? fs.readFileSync(packagePath, 'utf8') : '';
  const homepageCalculatorCards = (homepage.text.match(/data-home-calculator-card/gu) || []).length;

  const discoveryAndPerformanceChecks = {
    htmlSitemap: {
      route: HTML_SITEMAP_ROUTE,
      status: htmlSitemap.status,
      hasDataMarker: htmlSitemap.text.includes('data-html-sitemap'),
      linksPriorityRoutes: PRIORITY_ROUTES.filter((route) => route !== '/').every((route) => hrefSetHasTarget(htmlSitemapHrefs, route)),
      linksLlms: htmlSitemap.text.includes('/llms.txt') && htmlSitemap.text.includes('/api/llm-context.json'),
    },
    categoryHubChecks,
    llmContext: {
      llmsStatus: llms.status,
      jsonStatus: llmContext.status,
      hasGeoTopics: llms.text.includes('GEO / AI Overview Citation Priorities') && llmContext.text.includes('geoPriorityTopics'),
      hasHtmlSitemapReference: llms.text.includes('/แผนผังเว็บไซต์/') && llmContext.text.includes('htmlSitemap'),
      avoidsUnverifiedTrafficClaims: !llmContext.text.includes('2M+ monthly users') && !llmContext.text.includes('monthlyUniqueUsers'),
    },
    aiOverviewChecks: AI_OVERVIEW_ROUTES.map((route) => ({
      route,
      hasAiOverviewAnswer: routeByPathFromChecks(routeChecks, route)?.hasAiOverviewAnswer || false,
    })),
    formulaChecks: PLAIN_FORMULA_CHECKS.map((check) => ({
      route: check.route,
      pass: routeByPathFromChecks(routeChecks, check.route)?.hasPlainFormulaText || false,
      terms: check.terms,
    })),
    mobilePerformance: {
      deferredGtag: homepage.text.includes('runAfterLoadIdle(function loadGtagScript'),
      contentVisibility: themeCss.includes('content-visibility: auto'),
    },
    homepagePayload: {
      visibleCalculatorCards: homepageCalculatorCards,
      underLimit: homepageCalculatorCards <= 50,
      hasLimitMarker: homepage.text.includes('data-home-calculator-limit="50"'),
    },
    lazyCalculatorJs: {
      lazySearchMarker: homepage.text.includes('data-lazy-search-index="focus"'),
      focusLoad: homepage.text.includes("addEventListener('focus', ensureSearchIndex"),
      deferredPwa: homepage.text.includes('registerPwaAfterPaint'),
    },
    cwvMonitor: {
      scriptExists: fs.existsSync(path.join(ROOT, 'scripts', 'weekly-cwv-monitor.mjs')),
      packageScript: packageJson.includes('"audit:cwv-weekly"'),
    },
    searchSynonyms: searchSynonymChecks,
  };

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
    articleAnchorChecks,
    contentExpansionChecks,
    comparisonPageChecks,
    affiliateIntentChecks,
    discoveryAndPerformanceChecks,
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

function mdCell(value, limit = 120) {
  const text = String(value || '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
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

  const signalRows = liveSignals.routeChecks
    .filter((row) => row.route !== '/')
    .map((row) => (
      `| ${row.route} | ${row.titleMatchesGscTerms ? 'PASS' : 'WARN'} | ${row.metaMatchesGscTerms ? 'PASS' : 'WARN'} | ${row.hasDirectAnswer ? 'PASS' : 'WARN'} | ${row.hasFaqSchema ? 'PASS' : 'WARN'} | ${row.hasHowToSchema || row.hasWebApplicationSchema ? 'PASS' : 'WARN'} | ${row.hasCurrentYear ? 'PASS' : 'WARN'} | ${row.hasOfficialReference ? 'PASS' : 'INFO'} | ${mdCell(row.title, 80)} |`
    ));

  const articleAnchorRows = liveSignals.articleAnchorChecks.map((row) => (
    `| ${row.article} | ${row.target} | ${row.status} | ${row.hasTargetLink ? 'PASS' : 'FAIL'} |`
  ));

  const contentExpansionRows = liveSignals.contentExpansionChecks.flatMap((group) => (
    group.pages.map((page) => (
      `| ${group.item} | ${group.label} | ${page.route} | ${page.status} | ${page.hasTargetLink ? 'PASS' : 'FAIL'} |`
    ))
  ));

  const comparisonRows = liveSignals.comparisonPageChecks.map((row) => (
    `| ${row.route} | ${row.status} | ${row.linksPriorityCalculator ? 'PASS' : 'FAIL'} |`
  ));

  const affiliateRows = liveSignals.affiliateIntentChecks.map((row) => (
    `| ${row.path} | ${row.affiliate} | ${row.status} | ${row.hasAffiliateLink ? 'PASS' : 'FAIL'} |`
  ));

  const conversionRows = liveSignals.routeChecks
    .filter((row) => row.route !== '/')
    .map((row) => (
      `| ${row.route} | ${row.hasRelevantAffiliate ? 'PASS' : 'INFO'} | ${row.hasResultShare ? 'PASS' : 'WARN'} | ${row.hasNextAction ? 'PASS' : 'WARN'} |`
    ));

  const discovery = liveSignals.discoveryAndPerformanceChecks || {};
  const discoveryRows = discovery.htmlSitemap ? [
    `| HTML sitemap | ${discovery.htmlSitemap.status} | ${discovery.htmlSitemap.hasDataMarker ? 'PASS' : 'FAIL'} | ${discovery.htmlSitemap.linksPriorityRoutes ? 'PASS' : 'FAIL'} | ${discovery.htmlSitemap.linksLlms ? 'PASS' : 'FAIL'} |`,
    `| LLM context | ${discovery.llmContext?.jsonStatus || 'ERR'} | ${discovery.llmContext?.hasGeoTopics ? 'PASS' : 'FAIL'} | ${discovery.llmContext?.hasHtmlSitemapReference ? 'PASS' : 'FAIL'} | ${discovery.llmContext?.avoidsUnverifiedTrafficClaims ? 'PASS' : 'FAIL'} |`,
  ] : [];

  const categoryHubRows = (discovery.categoryHubChecks || []).map((row) => (
    `| ${row.route} | ${row.status} | ${row.hasPriorityStrip ? 'PASS' : 'FAIL'} | ${row.hasDeemphasizedLongTail ? 'PASS' : 'INFO'} |`
  ));

  const aiAnswerRows = (discovery.aiOverviewChecks || []).map((row) => {
    const formula = (discovery.formulaChecks || []).find((check) => check.route === row.route);
    return `| ${row.route} | ${row.hasAiOverviewAnswer ? 'PASS' : 'FAIL'} | ${formula?.pass ? 'PASS' : 'FAIL'} | ${mdCell((formula?.terms || []).join(', '), 90)} |`;
  });

  const performanceRows = discovery.mobilePerformance ? [
    `| Mobile performance | ${discovery.mobilePerformance.deferredGtag ? 'PASS' : 'FAIL'} | ${discovery.mobilePerformance.contentVisibility ? 'PASS' : 'FAIL'} | ${discovery.cwvMonitor?.scriptExists && discovery.cwvMonitor?.packageScript ? 'PASS' : 'FAIL'} |`,
    `| Homepage payload | ${discovery.homepagePayload?.visibleCalculatorCards ?? 'n/a'} cards | ${discovery.homepagePayload?.underLimit ? 'PASS' : 'FAIL'} | ${discovery.homepagePayload?.hasLimitMarker ? 'PASS' : 'FAIL'} |`,
    `| Lazy discovery JS | ${discovery.lazyCalculatorJs?.lazySearchMarker ? 'PASS' : 'FAIL'} | ${discovery.lazyCalculatorJs?.focusLoad ? 'PASS' : 'FAIL'} | ${discovery.lazyCalculatorJs?.deferredPwa ? 'PASS' : 'FAIL'} |`,
  ] : [];

  const searchSynonymRows = (discovery.searchSynonyms || []).map((row) => (
    `| ${row.term} | ${row.present ? 'PASS' : 'FAIL'} |`
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

## CTR, Schema, And Trust Signals

${table(['Route', 'Title Terms', 'Meta Terms', 'Direct Answer', 'FAQ Schema', 'App/HowTo Schema', '2569', 'Official Ref', 'Title'], signalRows)}

## Article-To-Calculator Anchors

${table(['Article', 'Target Calculator', 'HTTP', 'Anchor'], articleAnchorRows)}

## Long-Tail Content Expansion

${table(['Item', 'Cluster', 'Page', 'HTTP', 'Calculator Link'], contentExpansionRows)}

## Comparison And Affiliate Intent Pages

${table(['Comparison Page', 'HTTP', 'Priority Link'], comparisonRows)}

${table(['Affiliate Intent Page', 'Affiliate Path', 'HTTP', 'Sponsored Link'], affiliateRows)}

## Result Sharing And Next Actions

${table(['Route', 'Affiliate CTA', 'Share Prompt', 'Next Action'], conversionRows)}

## Discovery, GEO, Performance And Search

${table(['Check', 'HTTP / Metric', 'Marker / GEO', 'Priority / Limit', 'LLM / Safety'], discoveryRows)}

${table(['Category Hub', 'HTTP', 'Priority Strip', 'Long-Tail Deemphasis'], categoryHubRows)}

${table(['Route', 'AI Overview Block', 'Plain Formula Text', 'Terms'], aiAnswerRows)}

${table(['Check', 'Metric 1', 'Metric 2', 'Metric 3'], performanceRows)}

${table(['Search Synonym', 'Present In Index'], searchSynonymRows)}

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

const nonHomeRoutes = liveSignals.routeChecks.filter((row) => row.route !== '/');
const routeByPath = new Map(liveSignals.routeChecks.map((row) => [row.route, row]));
if (nonHomeRoutes.every((row) => row.hasRecoveryCopy)) {
  completedItems.add(11);
}
if (liveSignals.articleAnchorChecks.every((row) => row.hasTargetLink)) {
  completedItems.add(12);
}
if (nonHomeRoutes.every((row) => row.linkedFromHomepage && row.priorityLinks >= 2)) {
  completedItems.add(13);
}
if (TITLE_TERM_CHECKS.every((check) => routeByPath.get(check.route)?.titleMatchesGscTerms)) {
  completedItems.add(14);
}
if (META_TERM_CHECKS.every((check) => routeByPath.get(check.route)?.metaMatchesGscTerms)) {
  completedItems.add(15);
}
if (DIRECT_ANSWER_ROUTES.every((route) => routeByPath.get(route)?.hasDirectAnswer)) {
  completedItems.add(16);
}
if (nonHomeRoutes.every((row) => row.hasFaqSchema)) {
  completedItems.add(17);
}
if (nonHomeRoutes.every((row) => row.hasFaqSchema || row.hasHowToSchema || row.hasWebApplicationSchema)) {
  completedItems.add(18);
}
if (nonHomeRoutes.every((row) => row.hasCurrentYear)) {
  completedItems.add(19);
}
if (OFFICIAL_REFERENCE_ROUTES.every((route) => routeByPath.get(route)?.hasOfficialReference)) {
  completedItems.add(20);
}
for (const group of liveSignals.contentExpansionChecks) {
  if (group.pass) completedItems.add(group.item);
}
if (liveSignals.comparisonPageChecks.every((row) => row.status === 200 && row.linksPriorityCalculator)) {
  completedItems.add(26);
}
if (liveSignals.affiliateIntentChecks.every((row) => row.status === 200 && row.hasAffiliateLink)) {
  completedItems.add(27);
}
if (AFFILIATE_INTENT_CHECKS.every((check) => routeByPath.get(check.path)?.hasRelevantAffiliate || liveSignals.affiliateIntentChecks.find((row) => row.path === check.path)?.hasAffiliateLink)) {
  completedItems.add(28);
}
if (RESULT_SHARE_ROUTES.every((route) => routeByPath.get(route)?.hasResultShare)) {
  completedItems.add(29);
}
if (NEXT_ACTION_ROUTES.every((route) => routeByPath.get(route)?.hasNextAction)) {
  completedItems.add(30);
}
const discovery = liveSignals.discoveryAndPerformanceChecks;
if (
  discovery.htmlSitemap.status === 200
  && discovery.htmlSitemap.hasDataMarker
  && discovery.htmlSitemap.linksPriorityRoutes
  && discovery.htmlSitemap.linksLlms
  && discovery.categoryHubChecks.every((row) => row.status === 200)
) {
  completedItems.add(31);
}
if (
  discovery.categoryHubChecks.every((row) => row.status === 200 && row.hasPriorityStrip)
  && discovery.categoryHubChecks.some((row) => row.hasDeemphasizedLongTail)
) {
  completedItems.add(32);
}
if (
  discovery.llmContext.llmsStatus === 200
  && discovery.llmContext.jsonStatus === 200
  && discovery.llmContext.hasGeoTopics
  && discovery.llmContext.hasHtmlSitemapReference
  && discovery.llmContext.avoidsUnverifiedTrafficClaims
) {
  completedItems.add(33);
}
if (discovery.aiOverviewChecks.every((row) => row.hasAiOverviewAnswer)) {
  completedItems.add(34);
}
if (discovery.formulaChecks.every((row) => row.pass)) {
  completedItems.add(35);
}
if (discovery.mobilePerformance.deferredGtag && discovery.mobilePerformance.contentVisibility) {
  completedItems.add(36);
}
if (discovery.homepagePayload.underLimit && discovery.homepagePayload.hasLimitMarker) {
  completedItems.add(37);
}
if (
  discovery.lazyCalculatorJs.lazySearchMarker
  && discovery.lazyCalculatorJs.focusLoad
  && discovery.lazyCalculatorJs.deferredPwa
) {
  completedItems.add(38);
}
if (discovery.cwvMonitor.scriptExists && discovery.cwvMonitor.packageScript) {
  completedItems.add(39);
}
if (discovery.searchSynonyms.every((row) => row.present)) {
  completedItems.add(40);
}

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
  articleAnchorChecks: liveSignals.articleAnchorChecks,
  contentExpansionChecks: liveSignals.contentExpansionChecks,
  comparisonPageChecks: liveSignals.comparisonPageChecks,
  affiliateIntentChecks: liveSignals.affiliateIntentChecks,
  discoveryAndPerformanceChecks: liveSignals.discoveryAndPerformanceChecks,
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
