const fs = require('fs');
const path = require('path');

// Get all HTML files
function getAllHtmlFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      // Skip node_modules, .git, etc
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('.claude')) {
        files = files.concat(getAllHtmlFiles(fullPath));
      }
    } else if (item.name === 'index.html') {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = getAllHtmlFiles(path.join(__dirname, 'dist'));
console.log(`Found ${allFiles.length} HTML files. Sampling 100 random pages...`);

// Sample 100 random files
const sample = allFiles.sort(() => Math.random() - 0.5).slice(0, Math.min(100, allFiles.length));

const signals = {
  og: 0,
  twitter: 0,
  schema: 0,
  ga4: 0,
  viewport: 0,
  google_verify: 0,
  hreflang: 0,
  sentry: 0
};

for (const file of sample) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for Open Graph
    if (content.includes('property="og:')) {
      signals.og++;
    }
    
    // Check for Twitter Card
    if (content.includes('name="twitter:')) {
      signals.twitter++;
    }
    
    // Check for Schema.org
    if (content.includes('application/ld+json') || content.includes('"@context"')) {
      signals.schema++;
    }
    
    // Check for GA4
    if (content.includes('gtag') || content.includes('G-') || content.includes('UA-')) {
      signals.ga4++;
    }
    
    // Check for viewport meta tag
    if (content.includes('name="viewport"')) {
      signals.viewport++;
    }
    
    // Check for Google Search Console
    if (content.includes('google-site-verification')) {
      signals.google_verify++;
    }
    
    // Check for hreflang
    if (content.includes('rel="alternate"') && content.includes('hreflang=')) {
      signals.hreflang++;
    }
    
    // Check for Sentry
    if (content.includes('sentry') || content.includes('Sentry')) {
      signals.sentry++;
    }
  } catch (e) {
    // Silently skip files that can't be read
  }
}

console.log('\n=== TRUST SIGNAL VERIFICATION ===');
console.log(`Sample size: ${sample.length} pages`);
console.log(`\nResults (pages with signal / total pages):`);
console.log(`OG Tags:           ${signals.og}/${sample.length} (${Math.round(signals.og/sample.length*100)}%)`);
console.log(`Twitter Card:      ${signals.twitter}/${sample.length} (${Math.round(signals.twitter/sample.length*100)}%)`);
console.log(`Schema.org:        ${signals.schema}/${sample.length} (${Math.round(signals.schema/sample.length*100)}%)`);
console.log(`GA4 Tracking:      ${signals.ga4}/${sample.length} (${Math.round(signals.ga4/sample.length*100)}%)`);
console.log(`Mobile Viewport:   ${signals.viewport}/${sample.length} (${Math.round(signals.viewport/sample.length*100)}%)`);
console.log(`Google Verify:     ${signals.google_verify}/${sample.length} (${Math.round(signals.google_verify/sample.length*100)}%)`);
console.log(`hreflang Links:    ${signals.hreflang}/${sample.length} (${Math.round(signals.hreflang/sample.length*100)}%)`);
console.log(`Sentry Tracking:   ${signals.sentry}/${sample.length} (${Math.round(signals.sentry/sample.length*100)}%)`);
