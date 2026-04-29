import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

// Sample pages: correct Thai paths with dash-slug format
const samplePages = [
  'index.html',
  'คำนวณ-apr/index.html',
  'คำนวณ-bmi/index.html',
  'calculator/electricity-bill/index.html',
  'calculator/loan-payment/index.html',
  'calculator/unit-converter/index.html',
  'บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.html',
  'หมวดหมู่/การเงิน/index.html',
];

const signals = {
  og: { count: 0, found: 0 },
  twitter: { count: 0, found: 0 },
  schema: { count: 0, found: 0 },
  ga4: { count: 0, found: 0 },
  mobileViewport: { count: 0, found: 0 },
  googleVerify: { count: 0, found: 0 },
  canonical: { count: 0, found: 0 },
  hreflang: { count: 0, found: 0 },
};

const missingPages = [];
const checkedPages = [];

samplePages.forEach(pagePath => {
  const fullPath = path.join(distDir, pagePath);
  if (!fs.existsSync(fullPath)) {
    missingPages.push(pagePath);
    return;
  }

  checkedPages.push(pagePath);
  const html = fs.readFileSync(fullPath, 'utf-8');

  // OG tags
  signals.og.count++;
  if (html.match(/property="og:title"/) && html.match(/property="og:description"/)) {
    signals.og.found++;
  }

  // Twitter Card
  signals.twitter.count++;
  if (html.match(/name="twitter:card"/) || html.match(/property="twitter:card"/)) {
    signals.twitter.found++;
  }

  // Schema markup
  signals.schema.count++;
  if (html.match(/"@type"/) && (html.match(/"@context"/) || html.match(/application\/ld\+json/))) {
    signals.schema.found++;
  }

  // GA4
  signals.ga4.count++;
  if (html.match(/G-EY67HJ8NDD/)) {
    signals.ga4.found++;
  }

  // Mobile viewport
  signals.mobileViewport.count++;
  if (html.match(/name="viewport"/)) {
    signals.mobileViewport.found++;
  }

  // Google verification
  signals.googleVerify.count++;
  if (html.match(/google-site-verification/)) {
    signals.googleVerify.found++;
  }

  // Canonical
  signals.canonical.count++;
  if (html.match(/rel="canonical"/)) {
    signals.canonical.found++;
  }

  // hreflang
  signals.hreflang.count++;
  if (html.match(/rel="alternate"/) && html.match(/hreflang/)) {
    signals.hreflang.found++;
  }
});

console.log('\n╔════════════════════════════════════════════╗');
console.log('║     UX HEARTBEAT — TRUST SIGNALS (2671)     ║');
console.log('╚════════════════════════════════════════════╝\n');

Object.entries(signals).forEach(([signal, data]) => {
  if (data.count === 0) return;
  const percentage = Math.round((data.found / data.count) * 100);
  const status = percentage === 100 ? '✅' : percentage >= 90 ? '⚠️ ' : '❌';
  console.log(`  ${status} ${signal.padEnd(18)} ${String(data.found).padStart(2)}/${data.count} (${String(percentage).padStart(3)}%)`);
});

console.log('\n╔════════════════════════════════════════════╗');
console.log('║         PAGES VERIFIED / MISSING            ║');
console.log('╚════════════════════════════════════════════╝\n');
console.log(`  ✓ Verified: ${checkedPages.length}/${samplePages.length} pages`);
if (missingPages.length > 0) {
  console.log(`  ❌ Missing: ${missingPages.length} pages`);
  missingPages.forEach(p => console.log(`     - ${p}`));
}

console.log('\n╔════════════════════════════════════════════╗');
console.log('║         BUILD ARTIFACTS SUMMARY             ║');
console.log('╚════════════════════════════════════════════╝\n');

// Count HTML files
const countHtmlFiles = (dir) => {
  let count = 0;
  const walk = (d) => {
    fs.readdirSync(d).forEach(file => {
      const full = path.join(d, file);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (file.endsWith('.html')) count++;
    });
  };
  walk(dir);
  return count;
};

const htmlCount = countHtmlFiles(distDir);
console.log(`  📄 HTML pages: ${htmlCount}`);

// Check core calculators
const coreCalcs = ['electricity-bill', 'land-tax', 'loan-payment', 'overtime-pay', 'property-transfer-tax', 'unit-converter'];
const foundCalcs = coreCalcs.filter(calc => fs.existsSync(path.join(distDir, 'calculator', calc, 'index.html')));
console.log(`  🧮 Core calculators: ${foundCalcs.length}/${coreCalcs.length}`);
if (foundCalcs.length < coreCalcs.length) {
  const missing = coreCalcs.filter(c => !foundCalcs.includes(c));
  missing.forEach(m => console.log(`     ❌ Missing: ${m}`));
}

console.log('\n');
