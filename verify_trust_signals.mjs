import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get all HTML files
function getAllHtmlFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
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
    
    if (content.includes('property="og:')) {
      signals.og++;
    }
    if (content.includes('name="twitter:')) {
      signals.twitter++;
    }
    if (content.includes('application/ld+json') || content.includes('"@context"')) {
      signals.schema++;
    }
    if (content.includes('gtag') || content.includes('G-') || content.includes('UA-')) {
      signals.ga4++;
    }
    if (content.includes('name="viewport"')) {
      signals.viewport++;
    }
    if (content.includes('google-site-verification')) {
      signals.google_verify++;
    }
    if (content.includes('rel="alternate"') && content.includes('hreflang=')) {
      signals.hreflang++;
    }
    if (content.includes('sentry') || content.includes('Sentry')) {
      signals.sentry++;
    }
  } catch (e) {
    // Silently skip
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
