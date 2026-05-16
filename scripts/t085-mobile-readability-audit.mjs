import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST_ROOT = path.join(ROOT, 'dist');
const LLMS_PATH = path.join(ROOT, 'public', 'llms.txt');
const THEME_PATH = path.join(ROOT, 'src', 'styles', 'theme.css');
const DEFAULT_BASELINE_OUT = path.join(ROOT, '.tmp', 't085_mobile_readability_baseline.md');
const DEFAULT_AFTER_OUT = path.join(ROOT, '.tmp', 't085_mobile_readability_after.md');
const LIMIT = 20;

const fallbackRoutes = [
  '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
  '/คำนวณผ่อนบ้าน/',
  '/คำนวณผ่อนรถ/',
  '/คำนวณเงินเดือนสุทธิ/',
  '/คำนวณค่าไฟฟ้า/',
  '/คำนวณค่าโอที/',
  '/คำนวณภาษีมูลค่าเพิ่ม/',
  '/คำนวณดอกเบี้ยเงินฝาก/',
  '/คำนวณค่าโอนที่ดิน/',
  '/คำนวณผ่อนกู้/',
  '/คำนวณ-bmi/',
  '/คำนวณอายุ/',
  '/calculator/income-tax/',
  '/calculator/loan-payment/',
  '/calculator/net-salary/',
  '/calculator/electricity-bill/',
  '/calculator/overtime-pay/',
  '/calculator/property-transfer-tax/',
  '/calculator/unit-converter/',
  '/calculator/land-tax/',
];

function getArg(name) {
  const ix = process.argv.indexOf(name);
  if (ix === -1) return '';
  return process.argv[ix + 1] || '';
}

function toDistHtmlPath(routePath) {
  const trimmed = routePath.replace(/^\/|\/$/g, '');
  if (!trimmed) return path.join(DIST_ROOT, 'index.html');
  return path.join(DIST_ROOT, ...trimmed.split('/'), 'index.html');
}

function extractCalculatorRoutesFromLlms() {
  if (!fs.existsSync(LLMS_PATH)) return [];
  const content = fs.readFileSync(LLMS_PATH, 'utf8');
  const matches = content.match(/\(https:\/\/www\.kamnuanlek\.com\/[^)\s]+\)/g) ?? [];
  const routes = [];
  for (const match of matches) {
    const url = match.slice(1, -1);
    const pathname = decodeURIComponent(new URL(url).pathname);
    if (pathname.startsWith('/คำนวณ') || pathname.startsWith('/calculator/')) {
      routes.push(pathname.endsWith('/') ? pathname : `${pathname}/`);
    }
  }
  return Array.from(new Set(routes));
}

function getTopRoutes() {
  const llmsRoutes = extractCalculatorRoutesFromLlms();
  const combined = Array.from(new Set([...llmsRoutes, ...fallbackRoutes]));
  return combined.slice(0, LIMIT);
}

function getThemeGuards() {
  const css = fs.existsSync(THEME_PATH) ? fs.readFileSync(THEME_PATH, 'utf8') : '';
  const fontSizeGuard = /\.ct-page-calculator[\s\S]*font-size:\s*16px/iu.test(css);
  const inputSpacingGuard = /\.ct-page-calculator[\s\S]*(input|select|textarea)[\s\S]*min-height:\s*44px/iu.test(css);
  const tapTargetGuard = /\.ct-page-calculator[\s\S]*button[\s\S]*min-height:\s*44px/iu.test(css);
  const stickyOverlapGuard = /\.ct-page-calculator[\s\S]*(padding-bottom:\s*|scroll-margin-top:)/iu.test(css);
  return { fontSizeGuard, inputSpacingGuard, tapTargetGuard, stickyOverlapGuard };
}

function auditRoute(route, guards) {
  const htmlPath = toDistHtmlPath(route);
  if (!fs.existsSync(htmlPath)) {
    return {
      route,
      viewport: false,
      bodyReadability: false,
      inputSpacing: false,
      tapTargets: false,
      stickyOverlap: false,
      resultVisible: false,
      failures: ['dist_html_missing'],
    };
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const viewport = /<meta[^>]+name=["']viewport["'][^>]*>/iu.test(html);
  const bodyReadability = /<body[^>]+ct-page-calculator/iu.test(html) && guards.fontSizeGuard;
  const inputSpacing = guards.inputSpacingGuard;
  const tapTargets = guards.tapTargetGuard;
  const stickyOverlap = guards.stickyOverlapGuard;
  const resultVisible =
    /id=["'][^"']*results?[^"']*["']/iu.test(html) ||
    /class=["'][^"']*results?[^"']*["']/iu.test(html) ||
    /data-[a-z-]*results?=["'][^"']*["']/iu.test(html);

  const failures = [];
  if (!viewport) failures.push('missing_viewport_meta');
  if (!bodyReadability) failures.push('body_readability_guard_missing');
  if (!inputSpacing) failures.push('input_spacing_guard_missing');
  if (!tapTargets) failures.push('tap_target_guard_missing');
  if (!stickyOverlap) failures.push('sticky_overlap_guard_missing');
  if (!resultVisible) failures.push('results_section_missing');

  return {
    route,
    viewport,
    bodyReadability,
    inputSpacing,
    tapTargets,
    stickyOverlap,
    resultVisible,
    failures,
  };
}

function writeReport(routes, results, outPath) {
  const totalFailures = results.reduce((sum, row) => sum + row.failures.length, 0);
  const failingRoutes = results.filter((row) => row.failures.length > 0).length;

  const lines = [];
  lines.push('# T085 Mobile Readability Audit');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Routes audited: ${routes.length}`);
  lines.push(`Failing routes: ${failingRoutes}`);
  lines.push(`Total failed checks: ${totalFailures}`);
  lines.push('');
  lines.push('Route set:');
  for (const route of routes) lines.push(`- ${route}`);
  lines.push('');
  lines.push('| Route | body readability | input spacing | tap targets | sticky overlap guard | result visible | Failures |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const row of results) {
    lines.push(
      `| ${encodeURI(row.route)} | ${row.bodyReadability} | ${row.inputSpacing} | ${row.tapTargets} | ${row.stickyOverlap} | ${row.resultVisible} | ${row.failures.join(', ') || 'none'} |`,
    );
  }
  lines.push('');
  lines.push('Unresolved items:');
  if (failingRoutes === 0) {
    lines.push('- none');
  } else {
    const uniqueFailures = Array.from(new Set(results.flatMap((row) => row.failures)));
    for (const failure of uniqueFailures) lines.push(`- ${failure}`);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf8');
}

export function runT085MobileReadabilityAudit({ outPath = DEFAULT_BASELINE_OUT } = {}) {
  const routes = getTopRoutes();
  const guards = getThemeGuards();
  const results = routes.map((route) => auditRoute(route, guards));
  writeReport(routes, results, outPath);
  return { routes, results, outPath };
}

const isDirectRun = (process.argv[1] || '').toLowerCase().endsWith('t085-mobile-readability-audit.mjs');
if (isDirectRun) {
  const mode = getArg('--mode').toLowerCase();
  const explicitOut = getArg('--out');
  const outPath = explicitOut
    ? path.resolve(explicitOut)
    : mode === 'after'
      ? DEFAULT_AFTER_OUT
      : DEFAULT_BASELINE_OUT;

  const { results } = runT085MobileReadabilityAudit({ outPath });
  const failingRoutes = results.filter((row) => row.failures.length > 0).length;
  console.log(`report=${path.relative(ROOT, outPath)}`);
  console.log(`routes=${results.length}`);
  console.log(`failing_routes=${failingRoutes}`);
}
