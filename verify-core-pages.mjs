import fs from 'fs';

const corePages = [
  'dist/calculator/electricity-bill/index.html',
  'dist/calculator/land-tax/index.html',
  'dist/calculator/loan-payment/index.html',
  'dist/calculator/overtime-pay/index.html',
  'dist/calculator/property-transfer-tax/index.html',
  'dist/calculator/unit-converter/index.html',
];

console.log('=== CORE CALCULATOR PAGES (English) ===');
const signals = {
  og: 0, twitter: 0, schema: 0, ga4: 0, mobile: 0, verify: 0, pwa: 0
};

corePages.forEach(page => {
  if (fs.existsSync(page)) {
    console.log(`✓ ${page}`);
    const content = fs.readFileSync(page, 'utf8');
    
    // Count signals for this page
    if (content.includes('property="og:')) signals.og++;
    if (content.includes('name="twitter:')) signals.twitter++;
    if (content.includes('application/ld+json')) signals.schema++;
    if (content.includes('G-EY67HJ8NDD')) signals.ga4++;
    if (content.includes('name="viewport"')) signals.mobile++;
    if (content.includes('google-site-verification')) signals.verify++;
    if (content.includes('rel="manifest"')) signals.pwa++;
  } else {
    console.log(`✗ ${page}`);
  }
});

console.log(`\n=== SIGNAL COVERAGE (${corePages.length} core pages) ===`);
console.log(`OG: ${signals.og}/${corePages.length}`);
console.log(`Twitter: ${signals.twitter}/${corePages.length}`);
console.log(`Schema: ${signals.schema}/${corePages.length}`);
console.log(`GA4: ${signals.ga4}/${corePages.length}`);
console.log(`Mobile: ${signals.mobile}/${corePages.length}`);
console.log(`Verify: ${signals.verify}/${corePages.length}`);
console.log(`PWA: ${signals.pwa}/${corePages.length}`);

// Check main layout for Sentry
console.log('\n=== LAYOUT FILES CHECK ===');
const layouts = fs.readdirSync('src/layouts');
console.log(`Layouts found: ${layouts.join(', ')}`);

// Check if Sentry script in HTML
const sample = fs.readFileSync(corePages[0], 'utf8');
const sentryInSample = sample.includes('Sentry') || sample.includes('sentry');
console.log(`\nSentry initialization in sample page: ${sentryInSample ? '✓ YES' : '✗ NO'}`);
