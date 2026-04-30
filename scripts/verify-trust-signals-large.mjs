import fs from 'fs';
import path from 'path';

const distDir = 'dist';
const getAllHtmlFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
};

const allFiles = getAllHtmlFiles(distDir);
const sampleSize = Math.min(300, allFiles.length);
const sampled = allFiles.sort(() => Math.random() - 0.5).slice(0, sampleSize);

const signals = {
  og_title: /<meta property="og:title"/,
  og_description: /<meta property="og:description"/,
  og_image: /<meta property="og:image"/,
  twitter_card: /<meta name="twitter:card"/,
  schema: /<script type="application\/ld\+json"/,
  ga4: /gtag|GA_MEASUREMENT_ID|google-analytics/i,
  viewport: /<meta name="viewport"/,
  google_verify: /<meta name="google-site-verification"/,
  hreflang: /<link rel="alternate" hreflang=/,
  sentry: /Sentry|sentry\.io/i
};

const results = {};
for (const signal in signals) {
  results[signal] = 0;
}

sampled.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  for (const signal in signals) {
    if (signals[signal].test(content)) {
      results[signal]++;
    }
  }
});

console.log(`=== TRUST SIGNALS (${sampleSize} sample) ===`);
let total = 0;
for (const signal in results) {
  const percentage = Math.round((results[signal] / sampleSize) * 100);
  console.log(`${signal}: ${percentage}% (${results[signal]}/${sampleSize})`);
  total += results[signal];
}

const avg = Math.round((total / Object.keys(results).length / sampleSize) * 100);
console.log(`\nAverage: ${avg}%`);
