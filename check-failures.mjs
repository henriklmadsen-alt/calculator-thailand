import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const distDir = 'dist';

function getAllPages(dir, pages = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllPages(path, pages);
    } else if (entry.name === 'index.html') {
      pages.push(path);
    }
  }
  return pages;
}

function samplePages(pages, sampleSize = 100) {
  const shuffled = [...pages].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(sampleSize, pages.length));
}

const allPages = getAllPages(distDir);
const sampled = samplePages(allPages, 100);

const failures = {
  og: [],
  twitter: [],
  googleVerify: [],
};

for (const pagePath of sampled) {
  const html = readFileSync(pagePath, 'utf8');
  const urlPath = pagePath.replace('dist', '').replace('\index.html', '').replace('/index.html', '') || '/';
  
  if (!html.match(/property="og:[^"]+"/)) {
    failures.og.push(urlPath);
  }
  if (!html.match(/name="twitter:[^"]+"/)) {
    failures.twitter.push(urlPath);
  }
  if (!html.includes('google-site-verification')) {
    failures.googleVerify.push(urlPath);
  }
}

console.log('Pages missing OG tags:', failures.og.length > 0 ? failures.og.slice(0, 5) : 'None');
console.log('Pages missing Twitter cards:', failures.twitter.length > 0 ? failures.twitter.slice(0, 5) : 'None');
console.log('Pages missing Google Verify:', failures.googleVerify.length > 0 ? failures.googleVerify.slice(0, 5) : 'None');
