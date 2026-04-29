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

const allPages = getAllPages(distDir);

// Look for pages without proper title tags or meta descriptions
const issues = [];

for (const pagePath of allPages.slice(0, 100)) {
  const html = readFileSync(pagePath, 'utf8');
  const urlPath = pagePath.replace('dist', '').replace('\index.html', '').replace('/index.html', '') || '/';
  
  // Skip redirect pages
  if (html.includes('noindex')) continue;
  
  // Check for title tag
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : '';
  
  // Check for meta description
  const hasDescription = html.includes('name="description"');
  
  // Check if title is too short (less than 30 chars is usually not optimal)
  if (title.length < 30) {
    issues.push({ page: urlPath, type: 'short-title', title });
  }
  
  // Check for missing description
  if (!hasDescription) {
    issues.push({ page: urlPath, type: 'missing-description' });
  }
}

console.log('SEO Issues Found:');
console.log(`Short titles (< 30 chars): ${issues.filter(i => i.type === 'short-title').length}`);
console.log(`Missing descriptions: ${issues.filter(i => i.type === 'missing-description').length}`);
if (issues.length > 0) {
  console.log('\nFirst 3 issues:');
  issues.slice(0, 3).forEach(i => console.log(`  ${i.page}: ${i.type}`));
}
