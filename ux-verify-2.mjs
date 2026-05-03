import fs from 'fs';
import path from 'path';

const distDir = './dist';

// Check Thai content coverage
let thaiDirs = 0;
let englishCalcs = 0;
let totalDirs = 0;

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      totalDirs++;
      // Check if directory name contains Thai characters
      const hasThai = /[฀-๿]/.test(file);
      if (hasThai) {
        thaiDirs++;
      }
      walkDir(filePath);
    }
  });
}

walkDir(distDir);

// Count English calculators
const calcDir = path.join(distDir, 'calculator');
if (fs.existsSync(calcDir)) {
  const calcFiles = fs.readdirSync(calcDir);
  englishCalcs = calcFiles.length;
}

console.log('=== CONTENT COVERAGE ===\n');
console.log(`Thai directories: ${thaiDirs}/${totalDirs} (${Math.round(thaiDirs/totalDirs*100)}%)`);
console.log(`English calculators: ${englishCalcs}\n`);

// Check for ad safety issues - missing slots
console.log('=== AD SAFETY COVERAGE ===');
const samplePages = [
  './dist/index.html',
  './dist/calculator/income-tax/index.html',
  './dist/คำนวณ-klc0001-เงินเดือนสุทธิ/index.html',
  './dist/หมวดหมู่/การเงิน/index.html'
];

let pageIssues = [];
samplePages.forEach(pagePath => {
  if (fs.existsSync(pagePath)) {
    const html = fs.readFileSync(pagePath, 'utf-8');
    const hasCalc = html.includes('calculator') || html.includes('Calculator');
    const hasAdSlot = html.includes('GuardedAdSlot') || html.includes('data-ad-slot') || html.includes('ins.js');
    
    if (hasCalc && !hasAdSlot) {
      pageIssues.push(path.relative(distDir, pagePath));
    }
  }
});

if (pageIssues.length === 0) {
  console.log('✓ All sample calculator pages have ad protection\n');
} else {
  console.log(`⚠ ${pageIssues.length} pages missing ad protection:`);
  pageIssues.forEach(p => console.log(`  - ${p}`));
  console.log();
}

// Check accessibility and semantic HTML on sample
console.log('=== ACCESSIBILITY CHECKS (5 sample) ===');
const samples = [
  './dist/index.html',
  './dist/calculator/income-tax/index.html',
  './dist/คำนวณ-klc0001-เงินเดือนสุทธิ/index.html',
  './dist/หมวดหมู่/การเงิน/index.html',
  './dist/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.html'
];

let a11y = { lang: 0, heading: 0, alt: 0, focus: 0 };
samples.forEach(pagePath => {
  if (fs.existsSync(pagePath)) {
    const html = fs.readFileSync(pagePath, 'utf-8');
    if (html.includes('lang="')) a11y.lang++;
    if (html.includes('<h1') || html.includes('<h2')) a11y.heading++;
    if (html.includes('alt=')) a11y.alt++;
    if (html.includes(':focus') || html.includes('focus-')) a11y.focus++;
  }
});

console.log(`Language attribute: ${a11y.lang}/5`);
console.log(`Heading hierarchy: ${a11y.heading}/5`);
console.log(`Image alt text: ${a11y.alt}/5`);
console.log(`Focus states: ${a11y.focus}/5\n`);

// Check for trust/disclaimer presence
console.log('=== TRUST DISCLAIMERS ===');
let disclaimerCount = 0;
const disclaimerSamples = [
  './dist/calculator/income-tax/index.html',
  './dist/calculator/net-salary/index.html',
  './dist/คำนวณ-klc0001-เงินเดือนสุทธิ/index.html'
];

disclaimerSamples.forEach(pagePath => {
  if (fs.existsSync(pagePath)) {
    const html = fs.readFileSync(pagePath, 'utf-8');
    if (html.includes('disclaimer') || html.includes('ข้อแม้') || html.includes('ประมาณการ')) {
      disclaimerCount++;
    }
  }
});

console.log(`Disclaimers/caveats found: ${disclaimerCount}/${disclaimerSamples.length}\n`);
console.log('=== VERIFICATION COMPLETE ===');
