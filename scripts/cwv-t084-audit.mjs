import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST_ROOT = path.join(ROOT, 'dist');
const LLMS_PATH = path.join(ROOT, 'public', 'llms.txt');
const DEFAULT_OUT = path.join(ROOT, '.tmp', 't084_cwv_baseline.md');
const LIMIT = 20;

const fallbackPriorityUrls = [
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%B9%E0%B9%89/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%A3%E0%B8%96/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%B4/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%97%E0%B8%B5/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%9D%E0%B8%B2%E0%B8%81/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-bmi/',
];

function getArg(name) {
  const ix = process.argv.indexOf(name);
  if (ix === -1) return '';
  return process.argv[ix + 1] || '';
}

function extractPriorityUrls() {
  if (!fs.existsSync(LLMS_PATH)) return fallbackPriorityUrls.slice(0, LIMIT);
  const content = fs.readFileSync(LLMS_PATH, 'utf8');
  const urlMatches = content.match(/\(https:\/\/www\.kamnuanlek\.com\/[^)\s]+\)/g) ?? [];
  const urls = Array.from(new Set(urlMatches.map((x) => x.slice(1, -1))));
  return Array.from(new Set([...urls, ...fallbackPriorityUrls])).slice(0, LIMIT);
}

function htmlPathFromRoute(routePath) {
  const clean = routePath.replace(/^\/|\/$/g, '');
  if (!clean) return path.join(DIST_ROOT, 'index.html');
  return path.join(DIST_ROOT, ...clean.split('/'), 'index.html');
}

function pickLcpCandidate(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/iu)?.[1] || '';
  if (h1.trim()) {
    return `h1:${h1.replace(/<[^>]+>/g, '').trim().slice(0, 80)}`;
  }
  const heroImg = html.match(/<img[^>]+(?:src|srcset)=["']([^"']+)["'][^>]*>/iu)?.[1];
  if (heroImg) return `img:${heroImg.slice(0, 120)}`;
  return 'none-detected';
}

function stripNonRenderedBlocks(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/giu, '')
    .replace(/<style\b[\s\S]*?<\/style>/giu, '');
}

function detectClsContributors(html) {
  const renderedHtml = stripNonRenderedBlocks(html);
  const flags = [];
  const imgTags = Array.from(renderedHtml.matchAll(/<img\b[^>]*>/giu)).map((m) => m[0]);
  const imgWithoutDims = imgTags.filter((tag) => !/\bwidth=["'][^"']+["']/iu.test(tag) || !/\bheight=["'][^"']+["']/iu.test(tag));
  if (imgWithoutDims.length > 0) flags.push(`img_without_dimensions:${imgWithoutDims.length}`);

  const hiddenAdUnits = (renderedHtml.match(/data-ct-ad-unit[^>]*\shidden/giu) ?? []).length;
  if (hiddenAdUnits > 0) flags.push(`hidden_ad_units:${hiddenAdUnits}`);

  const fixedWidgets = (renderedHtml.match(/\bstyle=["'][^"']*position\s*:\s*fixed/giu) ?? []).length;
  if (fixedWidgets > 0) flags.push(`fixed_widgets:${fixedWidgets}`);

  return flags;
}

function detectBlockingAssets(html) {
  const runtimeHtml = html.replace(/<noscript\b[\s\S]*?<\/noscript>/giu, '');
  const stylesheets = Array.from(
    runtimeHtml.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/giu),
    (m) => m[0],
  );
  const blockingStylesheets = stylesheets.filter((tag) => !/\bmedia=["']print["']/iu.test(tag));

  const externalScripts = Array.from(
    runtimeHtml.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/giu),
    (m) => ({ tag: m[0], src: m[1] }),
  );
  const blockingScripts = externalScripts.filter((s) => !/\basync\b/iu.test(s.tag) && !/\bdefer\b/iu.test(s.tag));

  return {
    blockingStylesheetCount: blockingStylesheets.length,
    blockingScriptCount: blockingScripts.length,
    samples: [
      ...blockingStylesheets.slice(0, 2).map((x) => `css:${x.match(/href=["']([^"']+)["']/iu)?.[1] ?? 'unknown'}`),
      ...blockingScripts.slice(0, 2).map((x) => `js:${x.src}`),
    ],
  };
}

function auditRoute(url) {
  const routePath = decodeURIComponent(new URL(url).pathname);
  const htmlPath = htmlPathFromRoute(routePath);
  if (!fs.existsSync(htmlPath)) {
    return {
      url,
      routePath,
      exists: false,
      lcpCandidate: 'missing-dist-html',
      clsFlags: ['dist_html_missing'],
      blockingStylesheetCount: 0,
      blockingScriptCount: 0,
      blockingSamples: [],
    };
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const lcpCandidate = pickLcpCandidate(html);
  const clsFlags = detectClsContributors(html);
  const blocking = detectBlockingAssets(html);

  return {
    url,
    routePath,
    exists: true,
    lcpCandidate,
    clsFlags,
    blockingStylesheetCount: blocking.blockingStylesheetCount,
    blockingScriptCount: blocking.blockingScriptCount,
    blockingSamples: blocking.samples,
  };
}

function writeReport(results, outPath) {
  const totalBlockingCss = results.reduce((sum, r) => sum + r.blockingStylesheetCount, 0);
  const totalBlockingJs = results.reduce((sum, r) => sum + r.blockingScriptCount, 0);
  const totalClsFlags = results.reduce((sum, r) => sum + r.clsFlags.length, 0);
  const unresolvedRoutes = results.filter((r) => r.clsFlags.length > 0 || r.blockingStylesheetCount > 0 || r.blockingScriptCount > 0).length;

  const lines = [];
  lines.push('# T084 CWV Audit');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Routes audited: ${results.length}`);
  lines.push(`Routes with unresolved signals: ${unresolvedRoutes}`);
  lines.push(`Blocking stylesheets (total): ${totalBlockingCss}`);
  lines.push(`Blocking scripts (total): ${totalBlockingJs}`);
  lines.push(`CLS flags (total): ${totalClsFlags}`);
  lines.push('');
  lines.push('| Route | LCP candidate | CLS contributors | Blocking assets |');
  lines.push('|---|---|---|---|');
  for (const row of results) {
    lines.push(
      `| ${encodeURI(row.routePath)} | ${row.lcpCandidate} | ${row.clsFlags.join(', ') || 'none'} | css:${row.blockingStylesheetCount}, js:${row.blockingScriptCount}${row.blockingSamples.length ? ` (${row.blockingSamples.join('; ')})` : ''} |`,
    );
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf8');
}

export function runCwvT084Audit({ outPath = DEFAULT_OUT } = {}) {
  const urls = extractPriorityUrls();
  const results = urls.map((url) => auditRoute(url));
  writeReport(results, outPath);
  return { urls, results, outPath };
}

const isDirectRun = (process.argv[1] || '').toLowerCase().endsWith('cwv-t084-audit.mjs');
if (isDirectRun) {
  const outPath = getArg('--out') ? path.resolve(getArg('--out')) : DEFAULT_OUT;
  const { results } = runCwvT084Audit({ outPath });
  const unresolved = results.filter((r) => r.clsFlags.length > 0 || r.blockingStylesheetCount > 0 || r.blockingScriptCount > 0).length;
  console.log(`report=${path.relative(ROOT, outPath)}`);
  console.log(`routes=${results.length}`);
  console.log(`unresolved_routes=${unresolved}`);
}
