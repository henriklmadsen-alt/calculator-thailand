import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

// Sample pages for verification: mix of calculators, articles, categories, homepage
const samplePages = [
  'index.html',
  'คำนวณ-ค่าไฟฟ้า/index.html',
  'คำนวณ-ค่าโอที/index.html',
  'คำนวณภาษีโอน/index.html',
  'บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.html',
  'บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/index.html',
  'หมวดหมู่/บ้านและครอบครัว/index.html',
  'หมวดหมู่/การเงิน/index.html',
  'calculator/electricity-bill/index.html',
  'calculator/loan-payment/index.html',
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

samplePages.forEach(pagePath => {
  const fullPath = path.join(distDir, pagePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Missing: ${pagePath}`);
    return;
  }

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
  if (html.match(/"@type".*?"Organization"|"@type".*?"WebPage"|"@type".*?"Breadcrumb"|"@type".*?"HowTo"/)) {
    signals.schema.found++;
  }

  // GA4
  signals.ga4.count++;
  if (html.match(/G-EY67HJ8NDD/) || html.match(/gtag/)) {
    signals.ga4.found++;
  }

  // Mobile viewport
  signals.mobileViewport.count++;
  if (html.match(/name="viewport".*?width=device-width/)) {
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
  const hasHreflang = html.match(/rel="alternate".*?hreflang/) || html.match(/hreflang="[a-z-]*"/);
  if (hasHreflang) {
    signals.hreflang.found++;
  }
});

console.log('\n=== UX TRUST SIGNALS VERIFICATION ===\n');
Object.entries(signals).forEach(([signal, data]) => {
  const percentage = data.count > 0 ? Math.round((data.found / data.count) * 100) : 0;
  const status = percentage === 100 ? '✅' : percentage >= 90 ? '⚠️ ' : '❌';
  console.log(`${status} ${signal.padEnd(18)} ${data.found}/${data.count} (${percentage}%)`);
});

console.log('\n=== SAMPLE PAGES VERIFIED ===\n');
samplePages.forEach(page => {
  console.log(`✓ ${page}`);
});

console.log('\n=== PAGES CHECKED ===\n');
console.log(`Total sample pages: ${samplePages.length}`);
console.log(`Build directory: ${distDir}`);
