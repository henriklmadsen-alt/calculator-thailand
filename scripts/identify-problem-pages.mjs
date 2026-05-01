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

function checkSignals(html) {
  return {
    hasOG: !!html.match(/property="og:[^"]+"/),
    hasTwitter: !!html.match(/name="twitter:[^"]+"/),
    hasSchema: html.includes('application/ld+json'),
    hasGA4: html.includes('gtag') || html.includes('google-analytics'),
    hasMobileViewport: html.includes('name="viewport"') || html.includes('content="width=device-width'),
    hasGoogleVerify: html.includes('google-site-verification'),
    hasHreflang: html.includes('hreflang'),
    isNoindex: html.includes('noindex'),
  };
}

const allPages = getAllPages(distDir);
const problemPages = [];

for (const pagePath of allPages) {
  const html = readFileSync(pagePath, 'utf8');
  const signals = checkSignals(html);
  
  if (signals.isNoindex) continue; // Skip redirects
  
  const signalCount = Object.values(signals).slice(0, 7).filter(Boolean).length;
  if (signalCount < 7) {
    const missing = [];
    if (!signals.hasOG) missing.push('OG');
    if (!signals.hasTwitter) missing.push('Twitter');
    if (!signals.hasSchema) missing.push('Schema');
    if (!signals.hasGA4) missing.push('GA4');
    if (!signals.hasMobileViewport) missing.push('Mobile');
    if (!signals.hasGoogleVerify) missing.push('GoogleVerify');
    if (!signals.hasHreflang) missing.push('Hreflang');
    
    problemPages.push({
      path: pagePath.replace(distDir, '').replace('\index.html', '').replace('/index.html', '') || '/',
      missing,
      count: signalCount
    });
  }
}

console.log('Problem pages found:', problemPages.length);
problemPages.forEach(p => {
  console.log(`${p.path.padEnd(60)} - Missing ${7 - p.count} (${p.missing.join(', ')})`);
});

// Export as JSON for processing
console.log('\nJSON:');
console.log(JSON.stringify(problemPages, null, 2));
