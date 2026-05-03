import fs from 'fs';
import path from 'path';

const distDir = './dist';
const sampleSize = 30;
const trust_signals = {
  og_image: 0,
  og_title: 0,
  og_description: 0,
  viewport: 0,
  canonical: 0,
  schema: 0,
  organization_schema: 0,
  faq_schema: 0,
  breadcrumb_schema: 0
};

let filesChecked = 0;
let totalFiles = 0;
let htmlFiles = [];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file === 'index.html') {
      htmlFiles.push(filePath);
    }
  });
}

walkDir(distDir);
totalFiles = htmlFiles.length;
const sampleFiles = htmlFiles.sort(() => Math.random() - 0.5).slice(0, sampleSize);

sampleFiles.forEach((file) => {
  const html = fs.readFileSync(file, 'utf-8');
  filesChecked++;
  
  // Check trust signals
  if (html.includes('<meta property="og:image"')) trust_signals.og_image++;
  if (html.includes('<meta property="og:title"')) trust_signals.og_title++;
  if (html.includes('<meta property="og:description"')) trust_signals.og_description++;
  if (html.includes('<meta name="viewport"')) trust_signals.viewport++;
  if (html.includes('<link rel="canonical"')) trust_signals.canonical++;
  if (html.includes('<script type="application/ld+json"')) trust_signals.schema++;
  if (html.includes('"@type":"Organization"')) trust_signals.organization_schema++;
  if (html.includes('"@type":"FAQPage"') || html.includes('"@type":"Question"')) trust_signals.faq_schema++;
  if (html.includes('"@type":"BreadcrumbList"')) trust_signals.breadcrumb_schema++;
});

// Calculate percentages
const percentages = {};
Object.keys(trust_signals).forEach(key => {
  percentages[key] = Math.round((trust_signals[key] / filesChecked) * 100);
});

console.log('=== UX VERIFICATION HEARTBEAT ===\n');
console.log(`Total HTML pages: ${totalFiles}`);
console.log(`Sample checked: ${filesChecked}\n`);
console.log('=== TRUST SIGNALS ===');
Object.keys(trust_signals).forEach(key => {
  console.log(`${key}: ${percentages[key]}% (${trust_signals[key]}/${filesChecked})`);
});

const avgTrust = Math.round(Object.values(percentages).reduce((a,b) => a+b, 0) / Object.keys(trust_signals).length);
console.log(`\nAverage trust signals: ${avgTrust}%`);

// Check for core calculators
const coreCalcs = [
  'calculator/income-tax',
  'calculator/net-salary',
  'calculator/electricity-bill',
  'calculator/loan-payment',
  'calculator/overtime-pay',
  'calculator/property-transfer-tax'
];

console.log('\n=== CORE CALCULATORS ===');
let coreFound = 0;
coreCalcs.forEach(calc => {
  const exists = fs.existsSync(path.join(distDir, calc, 'index.html'));
  console.log(`${calc}: ${exists ? '✓' : '✗'}`);
  if (exists) coreFound++;
});
console.log(`Core calcs verified: ${coreFound}/${coreCalcs.length}`);

// Check mobile responsiveness on sample
let mobileOK = 0;
sampleFiles.slice(0, 10).forEach(file => {
  const html = fs.readFileSync(file, 'utf-8');
  if (html.includes('viewport') && html.includes('width=device-width')) {
    mobileOK++;
  }
});
console.log(`\nMobile viewport (10 sample): ${mobileOK}/10`);

// Check for GuardedAdSlots
let adSlotsFound = 0;
sampleFiles.slice(0, 15).forEach(file => {
  const html = fs.readFileSync(file, 'utf-8');
  if (html.includes('GuardedAdSlot') || html.includes('data-ad-slot')) {
    adSlotsFound++;
  }
});
console.log(`Ad slots protected (15 sample): ${adSlotsFound}/15`);
