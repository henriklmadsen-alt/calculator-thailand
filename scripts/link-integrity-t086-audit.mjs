import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST_ROOT = path.join(ROOT, 'dist');
const PAGES_ROOT = path.join(ROOT, 'src', 'pages');
const LLMS_PATH = path.join(ROOT, 'public', 'llms.txt');
const SITE_ORIGIN = 'https://www.kamnuanlek.com';
const LIMIT = 20;

const BASELINE_REPORT = path.join(ROOT, '.tmp', 't086_link_integrity_baseline.md');
const AFTER_REPORT = path.join(ROOT, '.tmp', 't086_link_integrity_after.md');

const STATUS_CLASSES = ['200_ok', 'redirect_ok', 'redirect_chain', '404', '5xx', 'timeout', 'invalid_target'];
const CRITICAL_CLASSES = new Set(['404', '5xx', 'timeout', 'redirect_chain']);

const clusterIds = [
  'income-tax-deduction-article-intent-cluster',
  'income-tax-basics-article-intent-cluster',
  'income-tax-main-article-intent-cluster',
  'income-tax-halfyear-article-intent-cluster',
];

const fallbackCalculatorRoutes = [
  '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
  '/คำนวณภาษีมูลค่าเพิ่ม/',
  '/คำนวณภาษีที่ดิน/',
  '/คำนวณค่าภาษีรถยนต์/',
  '/คำนวณผ่อนกู้/',
  '/คำนวณผ่อนรถ/',
  '/คำนวณผ่อนบ้าน/',
  '/คำนวณดอกเบี้ยเงินฝาก/',
  '/คำนวณเงินเดือนสุทธิ/',
  '/คำนวณค่าโอที/',
  '/คำนวณค่าไฟฟ้า/',
  '/คำนวณค่าน้ำ/',
  '/คำนวณค่าธรรมเนียมโอนบ้าน/',
  '/คำนวณค่าคอนโด/',
  '/calculator/income-tax/',
  '/calculator/loan-payment/',
  '/calculator/net-salary/',
  '/calculator/electricity-bill/',
  '/calculator/overtime-pay/',
  '/calculator/property-transfer-tax/',
];

function getArg(name) {
  const ix = process.argv.indexOf(name);
  if (ix === -1) return '';
  return process.argv[ix + 1] || '';
}

function pathFromRoute(routePath) {
  const trimmed = routePath.replace(/^\/|\/$/g, '');
  if (!trimmed) return path.join(DIST_ROOT, 'index.html');
  return path.join(DIST_ROOT, ...trimmed.split('/'), 'index.html');
}

function toRouteFromDistHtml(filePath) {
  const rel = path.relative(DIST_ROOT, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/\/index\.html$/u, '')}/`;
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function listBuiltRoutes() {
  if (!fs.existsSync(DIST_ROOT)) return new Set();
  const htmlFiles = walk(DIST_ROOT).filter((p) => p.endsWith('index.html'));
  return new Set(htmlFiles.map(toRouteFromDistHtml));
}

function extractCalculatorRoutesFromLlms() {
  if (!fs.existsSync(LLMS_PATH)) return [];
  const content = fs.readFileSync(LLMS_PATH, 'utf8');
  const matches = content.match(/\(https:\/\/www\.kamnuanlek\.com\/[^)\s]+\)/g) ?? [];
  const routes = [];
  for (const match of matches) {
    const url = match.slice(1, -1);
    let pathname = '';
    try {
      pathname = decodeURIComponent(new URL(url).pathname);
    } catch {
      continue;
    }
    if (pathname.startsWith('/คำนวณ') || pathname.startsWith('/calculator/')) {
      routes.push(pathname.endsWith('/') ? pathname : `${pathname}/`);
    }
  }
  return Array.from(new Set(routes));
}

function discoverClusterArticleRoutes() {
  if (!fs.existsSync(PAGES_ROOT)) return [];
  const files = walk(PAGES_ROOT).filter((p) => p.endsWith('index.astro'));
  const routes = [];
  for (const filePath of files) {
    const src = fs.readFileSync(filePath, 'utf8');
    if (!clusterIds.some((id) => src.includes(id))) continue;

    const rel = path.relative(PAGES_ROOT, filePath).replace(/\\/g, '/');
    const route = `/${rel.replace(/\/index\.astro$/u, '')}/`;
    routes.push(route);
  }
  return Array.from(new Set(routes)).sort();
}

function getSeedRoutes() {
  const llmsRoutes = extractCalculatorRoutesFromLlms();
  const calcRoutes = Array.from(new Set([...llmsRoutes, ...fallbackCalculatorRoutes])).slice(0, LIMIT);
  const articleRoutes = discoverClusterArticleRoutes();
  return Array.from(new Set([...articleRoutes, ...calcRoutes]));
}

function extractMainHtml(html) {
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/iu);
  return mainMatch ? mainMatch[1] : html;
}

function extractInternalHrefs(route, html) {
  const scope = extractMainHtml(html);
  const hrefMatches = scope.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/giu);
  const hrefs = [];

  for (const match of hrefMatches) {
    const href = (match[1] || '').trim();
    if (!href || href.startsWith('#')) continue;
    if (/^(mailto:|tel:|javascript:)/iu.test(href)) continue;

    let parsed;
    try {
      parsed = new URL(href, `${SITE_ORIGIN}${route}`);
    } catch {
      hrefs.push({ href, targetRoute: '', class: 'invalid_target', reason: 'invalid_url' });
      continue;
    }

    if (parsed.origin !== SITE_ORIGIN) continue;

    const cleanPath = decodeURIComponent(parsed.pathname || '/');
    hrefs.push({ href, targetRoute: normalizeRoute(cleanPath), class: '', reason: '' });
  }

  const dedup = new Map();
  for (const link of hrefs) {
    const key = `${link.href}__${link.targetRoute}__${link.class}`;
    if (!dedup.has(key)) dedup.set(key, link);
  }
  return Array.from(dedup.values());
}

function normalizeRoute(pathname) {
  if (!pathname || pathname === '/') return '/';
  const cleaned = pathname.replace(/\/+/g, '/');
  return cleaned.endsWith('/') ? cleaned : `${cleaned}/`;
}

function classifyInternalTarget(targetRoute, builtRoutes) {
  if (!targetRoute) return { class: 'invalid_target', resolvedRoute: '' };

  const route = normalizeRoute(targetRoute);
  if (builtRoutes.has(route)) return { class: '200_ok', resolvedRoute: route };

  const withoutTrailingSlash = route === '/' ? route : route.replace(/\/$/u, '');
  const withTrailingSlash = withoutTrailingSlash === '/' ? '/' : `${withoutTrailingSlash}/`;

  if (builtRoutes.has(withTrailingSlash)) {
    const ops = [];
    if (route !== withTrailingSlash) ops.push('trailing_slash');
    if (route.endsWith('/index.html/')) ops.push('index_html');
    return {
      class: ops.length > 1 ? 'redirect_chain' : 'redirect_ok',
      resolvedRoute: withTrailingSlash,
    };
  }

  const fromIndexHtml = route.replace(/\/index\.html\/?$/iu, '/');
  if (fromIndexHtml !== route && builtRoutes.has(fromIndexHtml)) {
    return { class: 'redirect_chain', resolvedRoute: fromIndexHtml };
  }

  return { class: '404', resolvedRoute: route };
}

function makeCounts() {
  return Object.fromEntries(STATUS_CLASSES.map((k) => [k, 0]));
}

function writeReport({ mode, seeds, rows, summary, reportPath }) {
  const lines = [];
  lines.push('# T086 Internal Link Integrity Audit');
  lines.push('');
  lines.push(`Mode: ${mode}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Audited seed routes: ${seeds.length}`);
  lines.push(`Internal links audited: ${rows.length}`);
  lines.push(`Critical unresolved: ${summary.critical}`);
  lines.push('');
  lines.push('Seed routes:');
  for (const route of seeds) lines.push(`- ${route}`);
  lines.push('');
  lines.push('Counts by class:');
  for (const klass of STATUS_CLASSES) lines.push(`- ${klass}: ${summary.classes[klass]}`);
  lines.push('');
  lines.push('| Source route | href | target route | class | resolved route |');
  lines.push('|---|---|---|---|---|');
  for (const row of rows) {
    lines.push(`| ${encodeURI(row.sourceRoute)} | ${row.href} | ${encodeURI(row.targetRoute || '')} | ${row.class} | ${encodeURI(row.resolvedRoute || '')} |`);
  }
  lines.push('');
  lines.push('Unresolved critical issues:');
  const unresolved = rows.filter((r) => CRITICAL_CLASSES.has(r.class));
  if (unresolved.length === 0) {
    lines.push('- none');
  } else {
    for (const issue of unresolved.slice(0, 200)) {
      lines.push(`- ${issue.class}: ${issue.sourceRoute} -> ${issue.href}`);
    }
  }

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
}

export function runT086Audit({ mode = 'baseline' } = {}) {
  const reportPath = mode === 'after' ? AFTER_REPORT : BASELINE_REPORT;

  const builtRoutes = listBuiltRoutes();
  if (builtRoutes.size === 0) {
    const summary = { classes: makeCounts(), critical: 1 };
    writeReport({ mode, seeds: [], rows: [], summary, reportPath });
    return { routes: [], rows: [], summary, reportPath };
  }

  const seeds = getSeedRoutes().filter((route) => builtRoutes.has(route));
  const rows = [];

  for (const sourceRoute of seeds) {
    const htmlPath = pathFromRoute(sourceRoute);
    if (!fs.existsSync(htmlPath)) continue;
    const html = fs.readFileSync(htmlPath, 'utf8');
    const links = extractInternalHrefs(sourceRoute, html);

    for (const link of links) {
      let klass = link.class;
      let resolvedRoute = '';

      if (!klass) {
        const verdict = classifyInternalTarget(link.targetRoute, builtRoutes);
        klass = verdict.class;
        resolvedRoute = verdict.resolvedRoute;
      }

      rows.push({
        sourceRoute,
        href: link.href,
        targetRoute: link.targetRoute,
        class: klass,
        resolvedRoute,
      });
    }
  }

  const dedup = new Map();
  for (const row of rows) {
    const key = `${row.sourceRoute}::${row.href}::${row.class}`;
    if (!dedup.has(key)) dedup.set(key, row);
  }
  const uniqueRows = Array.from(dedup.values());

  const classes = makeCounts();
  for (const row of uniqueRows) {
    if (classes[row.class] !== undefined) classes[row.class] += 1;
    else classes.invalid_target += 1;
  }

  const critical = Array.from(CRITICAL_CLASSES).reduce((sum, klass) => sum + (classes[klass] || 0), 0);
  const summary = { classes, critical };

  writeReport({ mode, seeds, rows: uniqueRows, summary, reportPath });
  return { routes: seeds, rows: uniqueRows, summary, reportPath };
}

const isDirectRun = (process.argv[1] || '').toLowerCase().endsWith('link-integrity-t086-audit.mjs');
if (isDirectRun) {
  const mode = (getArg('--mode') || 'baseline').toLowerCase();
  const result = runT086Audit({ mode });
  console.log(`report=${path.relative(ROOT, result.reportPath)}`);
  console.log(`seed_routes=${result.routes.length}`);
  console.log(`internal_links=${result.rows.length}`);
  console.log(`critical_unresolved=${result.summary.critical}`);
  if (result.summary.critical > 0) process.exit(1);
}
