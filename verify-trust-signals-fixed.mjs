import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

// Get all HTML files
const getAllHtmlFiles = (dir) => {
  const files = [];
  const walk = (currentPath) => {
    const items = fs.readdirSync(currentPath);
    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.html')) {
        files.push(fullPath);
      }
    });
  };
  walk(dir);
  return files;
};

// Get random sample
const getRandomSample = (arr, size) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, size);
};

// Parse HTML and check signals
const checkTrustSignals = (htmlFile) => {
  const content = fs.readFileSync(htmlFile, 'utf8');
  const relPath = path.relative(distDir, htmlFile);
  
  const signals = {
    file: relPath,
    og: (content.match(/property="og:/g) || []).length > 0 ? 1 : 0,
    twitter: (content.match(/name="twitter:/g) || []).length > 0 ? 1 : 0,
    schema: (content.match(/<script type="application\/ld\+json">/g) || []).length > 0 ? 1 : 0,
    ga4: content.includes('G-EY67HJ8NDD') ? 1 : 0,
    viewport: content.includes('viewport') ? 1 : 0,
    googleVerify: (content.match(/google-site-verification/g) || []).length > 0 ? 1 : 0,
    pwaManifest: content.includes('manifest.json') ? 1 : 0,
    sentry: content.includes('sentry') ? 1 : 0,
  };
  
  return signals;
};

// Main
const allFiles = getAllHtmlFiles(distDir);
console.log(`Total HTML files: ${allFiles.length}`);

const sample = getRandomSample(allFiles, Math.min(100, allFiles.length));
console.log(`Checking ${sample.length} random pages...\n`);

const results = sample.map(file => checkTrustSignals(file));

// Aggregate stats
const stats = {
  'OG Tags': { pass: 0, total: sample.length },
  'Twitter Card': { pass: 0, total: sample.length },
  'Schema Markup': { pass: 0, total: sample.length },
  'GA4': { pass: 0, total: sample.length },
  'Mobile Viewport': { pass: 0, total: sample.length },
  'Google Verify': { pass: 0, total: sample.length },
  'PWA Manifest': { pass: 0, total: sample.length },
  'Sentry': { pass: 0, total: sample.length },
};

results.forEach(r => {
  if (r.og) stats['OG Tags'].pass++;
  if (r.twitter) stats['Twitter Card'].pass++;
  if (r.schema) stats['Schema Markup'].pass++;
  if (r.ga4) stats['GA4'].pass++;
  if (r.viewport) stats['Mobile Viewport'].pass++;
  if (r.googleVerify) stats['Google Verify'].pass++;
  if (r.pwaManifest) stats['PWA Manifest'].pass++;
  if (r.sentry) stats['Sentry'].pass++;
});

// Report
console.log('=== TRUST SIGNALS SUMMARY ===\n');
let allPass = true;
Object.entries(stats).forEach(([signal, data]) => {
  const pct = Math.round((data.pass / data.total) * 100);
  const status = pct >= 95 ? '✓' : pct >= 80 ? '⚠' : '✗';
  if (pct < 95) allPass = false;
  console.log(`${status} ${signal.padEnd(20)}: ${data.pass}/${data.total} (${pct}%)`);
});

console.log(`\n${allPass ? '✓ ALL SIGNALS GREEN (95%+)' : '⚠ Some signals below 95%'}\n`);

console.log('=== SAMPLE PAGES VERIFIED ===');
results.slice(0, 10).forEach(r => {
  const allSignals = r.og && r.twitter && r.schema && r.ga4 && r.viewport && r.googleVerify && r.sentry ? '✓' : '⚠';
  console.log(`${allSignals} ${r.file}`);
});

