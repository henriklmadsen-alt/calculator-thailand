#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const outPath = path.join(repoRoot, 'public', 'llms-full.txt');
const siteUrl = 'https://www.kamnuanlek.com';

function extractLocs(xml) {
  const out = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    out.push(m[1].trim());
  }
  return out;
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.text();
}

async function main() {
  const indexUrl = `${siteUrl}/sitemap-index.xml`;
  const indexXml = await fetchText(indexUrl);
  const childSitemaps = extractLocs(indexXml);

  const all = new Set();
  for (const child of childSitemaps) {
    const childXml = await fetchText(child);
    for (const loc of extractLocs(childXml)) {
      if (loc.startsWith(siteUrl)) all.add(loc);
    }
  }

  const urls = Array.from(all).sort((a, b) => a.localeCompare(b));
  const now = new Date().toISOString();

  const lines = [
    '# Kamnuanlek.com - Complete URL Inventory (Synced from Sitemap)',
    `# Synced at: ${now}`,
    `# Source: ${indexUrl}`,
    `# Total URLs: ${urls.length}`,
    '',
    ...urls,
    '',
  ];

  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log(`Wrote ${urls.length} URLs to ${outPath}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
