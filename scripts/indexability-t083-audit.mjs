import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PAGES_ROOT = path.join(ROOT, 'src', 'pages');
const DIST_ROOT = path.join(ROOT, 'dist');
const REPORT_PATH = path.join(ROOT, '.tmp', 't083_indexability_audit.md');
const SITE_HOST = 'www.kamnuanlek.com';
const ISO_DATE = new Date().toISOString();

const auditedClusterIds = [
  'income-tax-deduction-article-intent-cluster',
  'income-tax-basics-article-intent-cluster',
  'income-tax-halfyear-article-intent-cluster',
  'income-tax-main-article-intent-cluster',
];

const extraPriorityRoutes = [
  '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.name === 'index.astro') out.push(p);
  }
  return out;
}

function discoverPriorityRoutes() {
  const routes = [];
  for (const filePath of walk(PAGES_ROOT)) {
    const source = fs.readFileSync(filePath, 'utf8');
    if (!auditedClusterIds.some((id) => source.includes(id))) continue;
    const canonicalMatch = source.match(/`\$\{siteUrl\}\/([^`]+?)`;/);
    if (canonicalMatch) routes.push('/' + canonicalMatch[1]);
  }
  const unique = new Set([...routes, ...extraPriorityRoutes]);
  return Array.from(unique).sort();
}

function htmlPathFromRoute(route) {
  const trimmed = route.replace(/^\/|\/$/g, '');
  if (!trimmed) return path.join(DIST_ROOT, 'index.html');
  return path.join(DIST_ROOT, ...trimmed.split('/'), 'index.html');
}

function getCanonicalHrefs(html) {
  const matches = html.matchAll(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/giu);
  return Array.from(matches, (m) => m[1].trim());
}

function getRobotsMeta(html) {
  const matches = html.matchAll(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["'][^>]*>/giu);
  return Array.from(matches, (m) => m[1].trim().toLowerCase());
}

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'user-agent': 'T083-Indexability-Audit/1.0',
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function auditRoute(route) {
  const htmlPath = htmlPathFromRoute(route);
  const conflicts = [];
  const findings = {
    route,
    htmlPath: path.relative(ROOT, htmlPath),
    robots: [],
    canonical: '',
    canonicalStatus: 'not-checked',
    canonicalIndexable: 'not-checked',
    conflicts,
  };

  if (!fs.existsSync(htmlPath)) {
    conflicts.push('dist_html_missing');
    return findings;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const canonicalHrefs = getCanonicalHrefs(html);
  findings.robots = getRobotsMeta(html);

  if (canonicalHrefs.length === 0) conflicts.push('canonical_missing');
  if (canonicalHrefs.length > 1) conflicts.push('canonical_multiple');
  findings.canonical = canonicalHrefs[0] || '';

  const robotsHasNoindex = findings.robots.some((r) => r.includes('noindex'));
  const robotsHasIndex = findings.robots.some((r) => r.includes('index'));
  if (robotsHasNoindex) conflicts.push('unexpected_noindex');
  if (robotsHasNoindex && robotsHasIndex) conflicts.push('robots_meta_conflict');
  if (findings.robots.length === 0) conflicts.push('robots_meta_missing');

  if (!findings.canonical) return findings;

  let canonicalUrl;
  try {
    canonicalUrl = new URL(findings.canonical);
  } catch {
    conflicts.push('canonical_invalid_url');
    return findings;
  }

  if (canonicalUrl.host !== SITE_HOST) conflicts.push('canonical_host_mismatch');

  const canonicalPath = decodeURIComponent(canonicalUrl.pathname);
  if (canonicalPath !== route) conflicts.push('canonical_self_mismatch');

  try {
    const response = await fetchWithTimeout(canonicalUrl.toString());
    findings.canonicalStatus = String(response.status);
    if (response.status !== 200) conflicts.push('canonical_target_non_200');

    const body = await response.text();
    const targetRobots = getRobotsMeta(body);
    const targetNoindex = targetRobots.some((r) => r.includes('noindex'));
    findings.canonicalIndexable = targetNoindex ? 'noindex' : 'indexable';
    if (targetNoindex) conflicts.push('canonical_target_non_indexable');
  } catch {
    findings.canonicalStatus = 'fetch_error';
    conflicts.push('canonical_target_unreachable');
  }

  return findings;
}

function writeReport(results, unresolvedCount) {
  const lines = [];
  lines.push('# T083 Indexability Audit');
  lines.push('');
  lines.push(`Generated: ${ISO_DATE}`);
  lines.push(`Audited routes: ${results.length}`);
  lines.push(`Unresolved conflicts: ${unresolvedCount}`);
  lines.push('');
  lines.push('| Route | Robots | Canonical | Canonical status | Canonical indexable | Conflicts |');
  lines.push('|---|---|---|---|---|---|');
  for (const row of results) {
    lines.push(
      `| ${encodeURI(row.route)} | ${row.robots.join('; ') || 'missing'} | ${row.canonical || 'missing'} | ${row.canonicalStatus} | ${row.canonicalIndexable} | ${row.conflicts.join(', ') || 'none'} |`,
    );
  }
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, lines.join('\n') + '\n', 'utf8');
}

export async function runT083Audit() {
  const routes = discoverPriorityRoutes();
  const results = [];
  for (const route of routes) {
    // Serialize checks to keep request pressure low and deterministic.
    results.push(await auditRoute(route));
  }
  const unresolvedCount = results.reduce((sum, r) => sum + r.conflicts.length, 0);
  writeReport(results, unresolvedCount);
  return { routes, results, unresolvedCount, reportPath: REPORT_PATH };
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const { unresolvedCount, reportPath } = await runT083Audit();
  console.log(`report=${path.relative(ROOT, reportPath)}`);
  console.log(`unresolved_conflicts=${unresolvedCount}`);
  if (unresolvedCount > 0) process.exit(1);
}
