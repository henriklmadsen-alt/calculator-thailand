import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST_ROOT = path.join(ROOT, 'dist');
const PAGES_ROOT = path.join(ROOT, 'src', 'pages');
const LLMS_PATH = path.join(ROOT, 'public', 'llms.txt');
const SITE_ORIGIN = 'https://www.kamnuanlek.com';
const LIMIT = 20;
const MAX_DEPTH = 3;

const BASELINE_REPORT = path.join(ROOT, '.tmp', 't087_depth_baseline.md');
const AFTER_REPORT = path.join(ROOT, '.tmp', 't087_depth_after.md');

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

const keyHubCandidates = [
  '/',
  '/บทความ/',
  '/เลือกเครื่องคำนวณ/',
  '/หมวดหมู่/ภาษี/',
  '/calculator/income-tax/',
  '/calculator/net-salary/',
];

function getArg(name) {
  const ix = process.argv.indexOf(name);
  if (ix === -1) return '';
  return process.argv[ix + 1] || '';
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

function normalizeRoute(pathname) {
  if (!pathname || pathname === '/') return '/';
  const cleaned = pathname.replace(/\/+/g, '/');
  return cleaned.endsWith('/') ? cleaned : `${cleaned}/`;
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
    routes.push(`/${rel.replace(/\/index\.astro$/u, '')}/`);
  }
  return Array.from(new Set(routes)).sort();
}

function getPriorityRoutes() {
  const llmsRoutes = extractCalculatorRoutesFromLlms();
  const calcRoutes = Array.from(new Set([...llmsRoutes, ...fallbackCalculatorRoutes])).slice(0, LIMIT);
  const articleRoutes = discoverClusterArticleRoutes();
  return Array.from(new Set([...articleRoutes, ...calcRoutes]));
}

function extractInternalRoutes(sourceRoute, html, builtRoutes) {
  const matches = html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/giu);
  const targets = new Set();
  for (const match of matches) {
    const href = (match[1] || '').trim();
    if (!href || href.startsWith('#')) continue;
    if (/^(mailto:|tel:|javascript:)/iu.test(href)) continue;

    let parsed;
    try {
      parsed = new URL(href, `${SITE_ORIGIN}${sourceRoute}`);
    } catch {
      continue;
    }
    if (parsed.origin !== SITE_ORIGIN) continue;

    const normalized = normalizeRoute(decodeURIComponent(parsed.pathname || '/'));
    if (builtRoutes.has(normalized)) {
      targets.add(normalized);
      continue;
    }

    // Handle link variants that may still resolve to built index pages.
    const sansIndex = normalized.replace(/\/index\.html\/?$/iu, '/');
    if (builtRoutes.has(sansIndex)) targets.add(sansIndex);
  }
  return targets;
}

function buildGraph(builtRoutes) {
  const graph = new Map();
  for (const route of builtRoutes) graph.set(route, new Set());

  for (const route of builtRoutes) {
    const htmlPath = pathFromRoute(route);
    if (!fs.existsSync(htmlPath)) continue;
    const html = fs.readFileSync(htmlPath, 'utf8');
    const targets = extractInternalRoutes(route, html, builtRoutes);
    graph.set(route, targets);
  }
  return graph;
}

function bfsDepth(graph, starts) {
  const depth = new Map();
  const queue = [];
  for (const start of starts) {
    if (!graph.has(start) || depth.has(start)) continue;
    depth.set(start, 0);
    queue.push(start);
  }

  while (queue.length > 0) {
    const current = queue.shift();
    const currentDepth = depth.get(current) ?? 0;
    const nextNodes = graph.get(current) || new Set();
    for (const next of nextNodes) {
      if (depth.has(next)) continue;
      depth.set(next, currentDepth + 1);
      queue.push(next);
    }
  }
  return depth;
}

function writeReport({ mode, reportPath, hubs, priorityRows, summary }) {
  const lines = [];
  lines.push('# T087 Internal Link Depth Audit');
  lines.push('');
  lines.push(`Mode: ${mode}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Max allowed depth: ${MAX_DEPTH}`);
  lines.push(`Priority routes audited: ${priorityRows.length}`);
  lines.push(`Unresolved priority routes: ${summary.unresolved}`);
  lines.push('');
  lines.push('Key hubs used for BFS:');
  for (const hub of hubs) lines.push(`- ${hub}`);
  lines.push('');
  lines.push('| Priority route | Depth | Status |');
  lines.push('|---|---:|---|');
  for (const row of priorityRows) {
    lines.push(`| ${encodeURI(row.route)} | ${row.depthLabel} | ${row.status} |`);
  }
  lines.push('');
  lines.push('Unresolved details:');
  const unresolved = priorityRows.filter((r) => r.status !== 'ok');
  if (unresolved.length === 0) {
    lines.push('- none');
  } else {
    for (const row of unresolved) {
      lines.push(`- ${row.status}: ${row.route} (depth=${row.depthLabel})`);
    }
  }

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
}

export function runT087DepthAudit({ mode = 'baseline' } = {}) {
  const reportPath = mode === 'after' ? AFTER_REPORT : BASELINE_REPORT;
  const builtRoutes = listBuiltRoutes();
  if (builtRoutes.size === 0) {
    const summary = { unresolved: 1 };
    writeReport({ mode, reportPath, hubs: [], priorityRows: [], summary });
    return { priorityRoutes: [], keyHubs: [], priorityRows: [], summary, reportPath };
  }

  const priorityRoutes = getPriorityRoutes().filter((r) => builtRoutes.has(normalizeRoute(r)));
  const keyHubs = keyHubCandidates.map(normalizeRoute).filter((r) => builtRoutes.has(r));
  const graph = buildGraph(builtRoutes);
  const depthMap = bfsDepth(graph, keyHubs);

  const priorityRows = priorityRoutes.map((route) => {
    const normalizedRoute = normalizeRoute(route);
    const depth = depthMap.get(normalizedRoute);
    if (depth === undefined) {
      return { route: normalizedRoute, depth: null, depthLabel: 'unreachable', status: 'unreachable' };
    }
    if (depth > MAX_DEPTH) {
      return { route: normalizedRoute, depth, depthLabel: String(depth), status: 'depth_gt_3' };
    }
    return { route: normalizedRoute, depth, depthLabel: String(depth), status: 'ok' };
  });

  const unresolved = priorityRows.filter((r) => r.status !== 'ok').length;
  const summary = { unresolved };

  writeReport({ mode, reportPath, hubs: keyHubs, priorityRows, summary });
  return { priorityRoutes, keyHubs, priorityRows, summary, reportPath };
}

const isDirectRun = (process.argv[1] || '').toLowerCase().endsWith('internal-link-depth-t087-audit.mjs');
if (isDirectRun) {
  const mode = (getArg('--mode') || 'baseline').toLowerCase();
  const result = runT087DepthAudit({ mode });
  console.log(`report=${path.relative(ROOT, result.reportPath)}`);
  console.log(`priority_routes=${result.priorityRoutes.length}`);
  console.log(`key_hubs=${result.keyHubs.length}`);
  console.log(`unresolved=${result.summary.unresolved}`);
  if (mode === 'after' && result.summary.unresolved > 0) process.exit(1);
}
