import fs from 'fs';
import path from 'path';

// Get all HTML files from dist/
const distDir = './dist';
function getHtmlFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  });
  return files;
}

const allFiles = getHtmlFiles(distDir);
console.log(`Total HTML files: ${allFiles.length}`);

// Random sample of 100 files
const sample = [];
for (let i = 0; i < Math.min(100, allFiles.length); i++) {
  const idx = Math.floor(Math.random() * allFiles.length);
  sample.push(allFiles[idx]);
}

// Check trust signals in sample
const signals = {
  og_title: 0,
  og_description: 0,
  og_image: 0,
  twitter_card: 0,
  twitter_title: 0,
  twitter_description: 0,
  schema_json: 0,
  ga4_gtag: 0,
  mobile_viewport: 0,
  google_site_verification: 0,
  pwa_manifest: 0,
  sentry_init: 0,
};

sample.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check for OG
  if (content.includes('property="og:title"')) signals.og_title++;
  if (content.includes('property="og:description"')) signals.og_description++;
  if (content.includes('property="og:image"')) signals.og_image++;
  
  // Check for Twitter
  if (content.includes('name="twitter:card"')) signals.twitter_card++;
  if (content.includes('name="twitter:title"')) signals.twitter_title++;
  if (content.includes('name="twitter:description"')) signals.twitter_description++;
  
  // Check for Schema
  if (content.includes('application/ld+json')) signals.schema_json++;
  
  // Check for GA4
  if (content.includes('G-EY67HJ8NDD')) signals.ga4_gtag++;
  
  // Check for mobile viewport
  if (content.includes('name="viewport"')) signals.mobile_viewport++;
  
  // Check for Google verify
  if (content.includes('google-site-verification')) signals.google_site_verification++;
  
  // Check for PWA manifest
  if (content.includes('rel="manifest"')) signals.pwa_manifest++;
  
  // Check for Sentry
  if (content.includes('Sentry.init')) signals.sentry_init++;
});

// Report
console.log(`\n=== TRUST SIGNAL VERIFICATION (${sample.length}-page sample) ===`);
console.log(`OG Title: ${signals.og_title}/${sample.length} (${Math.round(signals.og_title/sample.length*100)}%)`);
console.log(`OG Description: ${signals.og_description}/${sample.length} (${Math.round(signals.og_description/sample.length*100)}%)`);
console.log(`OG Image: ${signals.og_image}/${sample.length} (${Math.round(signals.og_image/sample.length*100)}%)`);
console.log(`Twitter Card: ${signals.twitter_card}/${sample.length} (${Math.round(signals.twitter_card/sample.length*100)}%)`);
console.log(`Twitter Title: ${signals.twitter_title}/${sample.length} (${Math.round(signals.twitter_title/sample.length*100)}%)`);
console.log(`Twitter Description: ${signals.twitter_description}/${sample.length} (${Math.round(signals.twitter_description/sample.length*100)}%)`);
console.log(`Schema JSON-LD: ${signals.schema_json}/${sample.length} (${Math.round(signals.schema_json/sample.length*100)}%)`);
console.log(`GA4 Tag: ${signals.ga4_gtag}/${sample.length} (${Math.round(signals.ga4_gtag/sample.length*100)}%)`);
console.log(`Mobile Viewport: ${signals.mobile_viewport}/${sample.length} (${Math.round(signals.mobile_viewport/sample.length*100)}%)`);
console.log(`Google Site Verify: ${signals.google_site_verification}/${sample.length} (${Math.round(signals.google_site_verification/sample.length*100)}%)`);
console.log(`PWA Manifest: ${signals.pwa_manifest}/${sample.length} (${Math.round(signals.pwa_manifest/sample.length*100)}%)`);
console.log(`Sentry Init: ${signals.sentry_init}/${sample.length} (${Math.round(signals.sentry_init/sample.length*100)}%)`);
