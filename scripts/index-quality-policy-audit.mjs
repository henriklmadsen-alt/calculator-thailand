#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { getIndexPolicyForPath, getIndexPolicySummary, normalizePolicyPath } from '../src/data/index-quality-policy.mjs';

const ROOT = process.cwd();
const DIST_ROOT = path.join(ROOT, 'dist');
const REPORT_DIR = path.join(ROOT, 'reports', 'seo');
const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://www.kamnuanlek.com').replace(/\/$/, '');
const TARGET_MIN = Number.parseInt(process.env.INDEX_QUALITY_MIN_URLS || '120', 10);
const TARGET_MAX = Number.parseInt(process.env.INDEX_QUALITY_MAX_URLS || '360', 10);

const REQUIRED_INDEX_PATHS = [
  '/',
  '/คำนวณค่าไฟฟ้า/',
  '/คำนวณอายุ/',
  '/คำนวณภาษีมูลค่าเพิ่ม/',
  '/คำนวณค่าโอที/',
  '/คำนวณ-bmi/',
  '/คำนวณผ่อนรถ/',
  '/คำนวณผ่อนบ้าน/',
  '/คำนวณเงินเดือนสุทธิ/',
  '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
  '/คำนวณประกันสังคม/',
  '/คำนวณดอกเบี้ยเงินฝาก/',
  '/บทความ/',
  '/แผนผังเว็บไซต์/',
];

const EXCLUDED_SITEMAP_PREFIXES = [
  '/admin/',
  '/api/',
  '/calculator/',
  '/downloads/',
  '/edge-cases/',
  '/embed/',
  '/go/',
  '/phase3-variants/',
];

function todayBangkok() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function n(value) {
  return Number(value || 0).toLocaleString('en-US');
}

function walkHtml(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '_astro' || entry.name === 'chunks' || entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkHtml(fullPath));
    if (entry.isFile() && entry.name === 'index.html') out.push(fullPath);
  }
  return out;
}

function routeFromHtmlPath(htmlPath) {
  const relative = path.relative(DIST_ROOT, htmlPath);
  const withoutIndex = relative === 'index.html' ? '' : relative.replace(/[\\/]index\.html$/, '');
  if (!withoutIndex) return '/';
  return normalizePolicyPath('/' + withoutIndex.split(path.sep).join('/'));
}

function extractRobots(html) {
  return html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)?.[1]?.toLowerCase() || '';
}

function extractCanonical(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || '';
}

function extractSitemapPaths() {
  const sitemapPath = path.join(DIST_ROOT, 'sitemap-0.xml');
  if (!fs.existsSync(sitemapPath)) return [];
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => normalizePolicyPath(match[1]));
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
  return text.length > limit ? `${text.slice(0, limit - 1)}...` : text;
}

function renderReport(payload) {
  const sampleRows = payload.samples.map((row) => (
    `| ${mdCell(row.path, 54)} | ${row.policy.index ? 'index' : 'noindex'} | ${row.policy.reason} | ${mdCell(row.robots, 30)} | ${mdCell(row.canonicalPath, 54)} |`
  ));
  const failureRows = payload.failures.map((failure) => `| ${failure.check} | ${mdCell(failure.details, 140)} |`);
  const reasonRows = Object.entries(payload.summary.byReason)
    .sort((a, b) => b[1] - a[1])
    .map(([reason, count]) => `| ${reason} | ${n(count)} |`);

  return `# Index Quality Policy Audit - ${payload.generatedDate}

Generated: ${payload.generatedAt}
Site: ${SITE_URL}/

## Summary

- Built HTML pages: ${n(payload.summary.total)}
- Policy indexable pages: ${n(payload.summary.indexable)}
- Policy non-indexable pages: ${n(payload.summary.nonIndexable)}
- XML sitemap URLs: ${n(payload.sitemapCount)}
- Target sitemap range: ${n(TARGET_MIN)}-${n(TARGET_MAX)}
- Status: ${payload.status}

## Policy Reasons

${table(['Reason', 'Pages'], reasonRows)}

## Failures

${table(['Check', 'Details'], failureRows)}

## Sample

${table(['Path', 'Policy', 'Reason', 'Robots', 'Canonical Path'], sampleRows)}
`;
}

function main() {
  const generatedDate = todayBangkok();
  const generatedAt = new Date().toISOString();
  const htmlPaths = walkHtml(DIST_ROOT);
  const rows = htmlPaths.map((htmlPath) => {
    const route = routeFromHtmlPath(htmlPath);
    const html = fs.readFileSync(htmlPath, 'utf8');
    const policy = getIndexPolicyForPath(route);
    const robots = extractRobots(html);
    const canonical = extractCanonical(html);
    const canonicalPath = canonical ? normalizePolicyPath(canonical) : '';
    return { path: route, htmlPath, policy, robots, canonical, canonicalPath };
  });

  const sitemapPaths = extractSitemapPaths();
  const sitemapSet = new Set(sitemapPaths);
  const failures = [];

  if (sitemapPaths.length < TARGET_MIN || sitemapPaths.length > TARGET_MAX) {
    failures.push({
      check: 'sitemap_target_range',
      details: `sitemap=${sitemapPaths.length}, expected=${TARGET_MIN}-${TARGET_MAX}`,
    });
  }

  for (const sitemapPath of sitemapPaths) {
    const policy = getIndexPolicyForPath(sitemapPath);
    if (!policy.index) {
      failures.push({
        check: 'non_indexable_url_in_sitemap',
        details: `${sitemapPath} (${policy.reason})`,
      });
    }
    if (EXCLUDED_SITEMAP_PREFIXES.some((prefix) => sitemapPath.startsWith(prefix))) {
      failures.push({
        check: 'excluded_prefix_in_sitemap',
        details: sitemapPath,
      });
    }
  }

  for (const row of rows) {
    if (row.policy.index && !sitemapSet.has(row.path)) {
      failures.push({
        check: 'indexable_page_missing_from_sitemap',
        details: row.path,
      });
    }
    if (row.policy.index && row.robots.includes('noindex')) {
      failures.push({
        check: 'indexable_page_has_noindex',
        details: row.path,
      });
    }
    if (!row.policy.index && !row.robots.includes('noindex')) {
      failures.push({
        check: 'non_indexable_page_missing_noindex',
        details: `${row.path} (${row.policy.reason})`,
      });
    }
    if (row.policy.reason === 'canonical_duplicate') {
      if (row.canonicalPath !== row.policy.canonicalPath) {
        failures.push({
          check: 'canonical_duplicate_target_mismatch',
          details: `${row.path} -> ${row.canonicalPath || 'missing'}, expected ${row.policy.canonicalPath}`,
        });
      }
    }
    if (row.policy.index && row.canonical && !row.canonical.startsWith(SITE_URL)) {
      failures.push({
        check: 'canonical_host_mismatch',
        details: `${row.path} -> ${row.canonical}`,
      });
    }
  }

  for (const requiredPath of REQUIRED_INDEX_PATHS) {
    const normalized = normalizePolicyPath(requiredPath);
    if (!sitemapSet.has(normalized)) {
      failures.push({
        check: 'required_path_missing_from_sitemap',
        details: normalized,
      });
    }
  }

  const summary = getIndexPolicySummary(rows.map((row) => row.path));
  const payload = {
    generatedAt,
    generatedDate,
    status: failures.length === 0 ? 'ok' : 'failed',
    summary,
    sitemapCount: sitemapPaths.length,
    sitemapPaths,
    failures,
    samples: [
      ...rows.filter((row) => row.policy.index).slice(0, 30),
      ...rows.filter((row) => !row.policy.index).slice(0, 30),
    ],
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const latestMd = path.join(REPORT_DIR, 'index-quality-policy-audit-latest.md');
  const latestJson = path.join(REPORT_DIR, 'index-quality-policy-audit-latest.json');
  const datedMd = path.join(REPORT_DIR, `index-quality-policy-audit-${generatedDate}.md`);
  fs.writeFileSync(latestMd, renderReport(payload), 'utf8');
  fs.writeFileSync(datedMd, renderReport(payload), 'utf8');
  fs.writeFileSync(latestJson, JSON.stringify(payload, null, 2), 'utf8');

  console.log(JSON.stringify({
    status: payload.status,
    builtHtmlPages: summary.total,
    indexablePages: summary.indexable,
    nonIndexablePages: summary.nonIndexable,
    sitemapUrls: sitemapPaths.length,
    failures: failures.length,
    reports: { latestMd, latestJson, datedMd },
  }, null, 2));

  if (failures.length > 0) process.exitCode = 1;
}

main();
