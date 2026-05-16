import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagesRoot = path.join(root, 'src', 'pages');
const sitemapPath = path.join(root, 'dist', 'sitemap-0.xml');
const sitemapIndexPath = path.join(root, 'dist', 'sitemap-index.xml');

const auditedClusterIds = [
  'income-tax-deduction-article-intent-cluster',
  'income-tax-basics-article-intent-cluster',
  'income-tax-halfyear-article-intent-cluster',
  'income-tax-main-article-intent-cluster',
];

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.name === 'index.astro') out.push(p);
  }
  return out;
}

function getAuditedRoutes() {
  const routes = [];
  for (const filePath of walk(pagesRoot)) {
    const source = fs.readFileSync(filePath, 'utf8');
    if (!auditedClusterIds.some((id) => source.includes(id))) continue;

    const canonicalMatch = source.match(/`\$\{siteUrl\}\/([^`]+?)`;/);
    assert.ok(canonicalMatch, `missing canonical in ${filePath}`);
    routes.push('/' + canonicalMatch[1]);
  }
  return routes.sort();
}

function getUrlEntryMap(xml) {
  const map = new Map();
  const entries = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
  for (const entry of entries) {
    const loc = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = entry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    const priority = entry.match(/<priority>([^<]+)<\/priority>/)?.[1];
    if (loc) map.set(loc, { lastmod, priority });
  }
  return map;
}

const auditedRoutes = getAuditedRoutes();

test('T082: audited route set is discovered from T074-T081 cluster markers', () => {
  assert.equal(auditedRoutes.length, 4, 'expected 4 audited cluster routes');
});

test('T082: audited routes exist in sitemap with non-empty ISO lastmod', () => {
  assert.ok(fs.existsSync(sitemapPath), 'dist/sitemap-0.xml not found');
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const map = getUrlEntryMap(xml);

  for (const route of auditedRoutes) {
    const loc = `https://www.kamnuanlek.com${route}`;
    const item = map.get(loc);
    assert.ok(item, `missing sitemap entry for ${route}`);
    assert.ok(item.lastmod, `missing lastmod for ${route}`);
    assert.match(item.lastmod, isoDatePattern, `invalid ISO lastmod for ${route}`);
  }
});

test('T082: audited routes follow tax-cluster priority rule (0.9)', () => {
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const map = getUrlEntryMap(xml);

  for (const route of auditedRoutes) {
    const loc = `https://www.kamnuanlek.com${route}`;
    const item = map.get(loc);
    assert.ok(item, `missing sitemap entry for ${route}`);
    assert.equal(item.priority, '0.9', `expected priority 0.9 for tax-cluster route ${route}`);
  }
});

test('T082: sitemap-index references sitemap-0.xml with non-empty ISO lastmod', () => {
  assert.ok(fs.existsSync(sitemapIndexPath), 'dist/sitemap-index.xml not found');
  const indexXml = fs.readFileSync(sitemapIndexPath, 'utf8');
  assert.match(indexXml, /<loc>https:\/\/www\.kamnuanlek\.com\/sitemap-0\.xml<\/loc>/u);

  const lastmod = indexXml.match(/<sitemap>[\s\S]*?<lastmod>([^<]+)<\/lastmod>[\s\S]*?<\/sitemap>/)?.[1] ?? '';
  assert.match(lastmod, isoDatePattern, 'invalid sitemap-index lastmod');
});
