import fs from 'fs';
import path from 'path';

const distDir = 'dist';
const htmlFiles = [];

// Recursively find all HTML files
function findHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findHtmlFiles(fullPath);
    } else if (file.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  });
}

findHtmlFiles(distDir);

// Shuffle and sample 100 files
const shuffled = htmlFiles.sort(() => Math.random() - 0.5);
const sample = shuffled.slice(0, 100);

console.log(`Total HTML files: ${htmlFiles.length}`);
console.log(`Sample size: ${sample.length}`);
console.log(`\n=== Trust Signal Verification ===\n`);

const signals = {
  og: { count: 0, name: 'Open Graph (OG)' },
  twitter: { count: 0, name: 'Twitter Card' },
  schema: { count: 0, name: 'Schema.org JSON-LD' },
  ga4: { count: 0, name: 'Google Analytics 4' },
  mobile: { count: 0, name: 'Mobile Viewport' },
  google_verify: { count: 0, name: 'Google Site Verification' },
  hreflang: { count: 0, name: 'Hreflang' },
  sentry: { count: 0, name: 'Sentry' }
};

const thaiPages = [];

sample.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check trust signals
    if (content.includes('og:title') || content.includes('og:description')) signals.og.count++;
    if (content.includes('twitter:card')) signals.twitter.count++;
    if (content.includes('application/ld+json')) signals.schema.count++;
    if (content.includes('gtag') || content.includes('GA_MEASUREMENT_ID')) signals.ga4.count++;
    if (content.includes('viewport')) signals.mobile.count++;
    if (content.includes('google-site-verification')) signals.google_verify.count++;
    if (content.includes('hreflang')) signals.hreflang.count++;
    if (content.includes('sentry') || content.includes('Sentry')) signals.sentry.count++;
    
    // Track Thai pages
    if (content.includes('lang="th"') || filePath.includes('คำนวณ')) {
      thaiPages.push(filePath);
    }
  } catch (e) {
    console.error(`Error reading ${filePath}: ${e.message}`);
  }
});

// Calculate percentages
Object.keys(signals).forEach(key => {
  const percent = (signals[key].count / sample.length * 100).toFixed(1);
  const check = percent >= 95 ? '✓' : '⚠';
  console.log(`${check} ${signals[key].name}: ${signals[key].count}/${sample.length} (${percent}%)`);
});

const avgSignal = (Object.values(signals).reduce((sum, s) => sum + s.count, 0) / (sample.length * Object.keys(signals).length) * 100).toFixed(1);
console.log(`\nAverage Trust Signal Coverage: ${avgSignal}%`);
console.log(`\nThai Pages in Sample: ${thaiPages.length}/${sample.length} (${(thaiPages.length/sample.length*100).toFixed(1)}%)`);
