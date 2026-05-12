import fs from 'fs';
import path from 'path';

const distDir = 'dist';
const signals = { og: 0, twitter: 0, schema: 0, ga4: 0, viewport: 0, sentry: 0, pwa: 0 };
let count = 0;
const pages = [];
const redirectPathPattern = /[\\/](go|calculator)[\\/]/i;

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !file.startsWith('admin') && !file.startsWith('_') && !file.startsWith('.')) {
      walk(fullPath);
    } else if (file === 'index.html' && !fullPath.includes('admin')) {
      pages.push(fullPath);
    }
  });
}

walk(distDir);

// Sample 100 random public pages
const sampled = pages.sort(() => 0.5 - Math.random()).slice(0, 100);

sampled.forEach(htmlPath => {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const normalized = htmlPath.replace(/\\/g, '/');
  const fileName = normalized.split('/').pop() || '';
  const shouldSkip = redirectPathPattern.test(normalized)
    || /^google[a-z0-9]+\.html$/i.test(fileName)
    || /http-equiv=["']refresh["']/i.test(html);
  if (shouldSkip) return;
  if (/og:title|og:description/.test(html)) signals.og++;
  if (/twitter:card|twitter:title/.test(html)) signals.twitter++;
  if (/"@context"|"@type"/.test(html)) signals.schema++;
  if (/G-EY67HJ8NDD/.test(html)) signals.ga4++;
  if (/viewport.*width=device-width/.test(html)) signals.viewport++;
  if (/sentry|Sentry/.test(html)) signals.sentry++;
  if (/manifest\.json|pwa/.test(html)) signals.pwa++;
  count++;
});

console.log(`\n📊 PUBLIC PAGES TRUST SIGNALS (${count} pages, no admin)\n`);
const base = count || 1;
console.log(`OG Tags:          ${signals.og}/${count} (${(signals.og/base*100).toFixed(0)}%) ${signals.og >= count * 0.95 ? '✓' : '⚠'}`);
console.log(`Twitter Card:     ${signals.twitter}/${count} (${(signals.twitter/base*100).toFixed(0)}%) ${signals.twitter >= count * 0.95 ? '✓' : '⚠'}`);
console.log(`Schema.org:       ${signals.schema}/${count} (${(signals.schema/base*100).toFixed(0)}%) ${signals.schema >= count * 0.95 ? '✓' : '⚠'}`);
console.log(`GA4 Tracking:     ${signals.ga4}/${count} (${(signals.ga4/base*100).toFixed(0)}%) ${signals.ga4 >= count * 0.95 ? '✓' : '⚠'}`);
console.log(`Mobile Viewport:  ${signals.viewport}/${count} (${(signals.viewport/base*100).toFixed(0)}%) ${signals.viewport >= count * 0.95 ? '✓' : '⚠'}`);
console.log(`Sentry:           ${signals.sentry}/${count} (${(signals.sentry/base*100).toFixed(0)}%) ${signals.sentry >= count * 0.95 ? '✓' : '⚠'}`);
console.log(`PWA Manifest:     ${signals.pwa}/${count} (${(signals.pwa/base*100).toFixed(0)}%) ${signals.pwa >= count * 0.95 ? '✓' : '⚠'}`);

const healthy = Object.values(signals).every(v => v >= count * 0.95);
console.log(`\n${healthy ? '✅ TRUST SIGNALS HEALTHY' : '⚠️ VARIANCE DETECTED'}\n`);
