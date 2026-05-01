const fs = require('fs');
const path = require('path');

// Find all HTML files
const getAllHtmlFiles = (dir) => {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllHtmlFiles(fullPath));
    } else if (item.name === 'index.html') {
      files.push(fullPath);
    }
  }
  return files;
};

// Sample random files
const sampleFiles = (files, n) => {
  const sample = [];
  const indices = new Set();
  while (indices.size < Math.min(n, files.length)) {
    indices.add(Math.floor(Math.random() * files.length));
  }
  return Array.from(indices).map(i => files[i]);
};

// Check trust signals
const checkTrustSignals = (html) => {
  const signals = {
    og: html.includes('property="og:') || html.includes("property='og:"),
    twitter: html.includes('name="twitter:'),
    schema: html.includes('application/ld+json'),
    ga4: html.includes('gtag') || html.includes('google-analytics'),
    mobile: html.includes('viewport'),
    google: html.includes('google-site-verification') || html.includes('googled') || html.includes('robots'),
    hreflang: html.includes('hreflang'),
    sentry: html.includes('sentry') || html.includes('@sentry/'),
  };
  return signals;
};

const allFiles = getAllHtmlFiles('./dist');
const sample = sampleFiles(allFiles, 100);

const results = {
  og: 0, twitter: 0, schema: 0, ga4: 0, mobile: 0, google: 0, hreflang: 0, sentry: 0, total: 0
};

sample.forEach(file => {
  const html = fs.readFileSync(file, 'utf-8');
  const signals = checkTrustSignals(html);
  Object.keys(signals).forEach(key => {
    if (signals[key]) results[key]++;
  });
  results.total++;
});

// Calculate percentages
const percentages = {};
Object.keys(results).forEach(key => {
  if (key !== 'total') {
    percentages[key] = ((results[key] / results.total) * 100).toFixed(1);
  }
});

console.log('\n=== TRUST SIGNAL AUDIT (100-page sample) ===');
console.log(`OG Tags: ${percentages.og}%`);
console.log(`Twitter Cards: ${percentages.twitter}%`);
console.log(`Schema Markup: ${percentages.schema}%`);
console.log(`GA4 Analytics: ${percentages.ga4}%`);
console.log(`Mobile Viewport: ${percentages.mobile}%`);
console.log(`Google Verify: ${percentages.google}%`);
console.log(`Hreflang: ${percentages.hreflang}%`);
console.log(`Sentry Error: ${percentages.sentry}%`);

const avg = (Object.values(percentages).reduce((a, b) => a + parseFloat(b), 0) / 8).toFixed(1);
console.log(`\nAverage Trust Score: ${avg}%`);
