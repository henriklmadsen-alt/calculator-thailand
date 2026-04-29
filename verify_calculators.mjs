import fs from 'fs';
import path from 'path';

const distDir = 'dist';

// Core calculators to verify
const coreCalculators = [
  'calculator/electricity-bill/index.html',
  'calculator/land-tax/index.html',
  'calculator/loan-payment/index.html',
  'calculator/overtime-pay/index.html',
  'calculator/property-transfer-tax/index.html',
  'calculator/unit-converter/index.html'
];

// Check core calculators
console.log('=== CORE CALCULATOR VERIFICATION ===');
let found = 0;
for (const calc of coreCalculators) {
  const fullPath = path.join(distDir, calc);
  const exists = fs.existsSync(fullPath);
  if (exists) {
    found++;
  }
  console.log(`${exists ? '✓' : '✗'} ${calc.split('/')[1]}`);
}
console.log(`\nCore calculators present: ${found}/${coreCalculators.length}`);

// Count Thai pages
console.log('\n=== THAI i18n PAGE COUNT ===');
const thaiDirs = ['ด/', 'บทความ/', 'อัตร'];
let thaiFileCount = 0;

function countThaiPages(dir) {
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('.claude')) {
          countThaiPages(fullPath);
        }
      } else if (item.name === 'index.html') {
        // Check if this is a Thai path
        if (fullPath.includes('%') || fullPath.includes('ด-') || fullPath.includes('บทความ') || fullPath.includes('อัตร')) {
          thaiFileCount++;
        }
      }
    }
  } catch (e) {
    // Ignore
  }
}

countThaiPages(distDir);

// Also count by directory inspection
let calculatorDirs = 0, articleDirs = 0, categoryDirs = 0;

try {
  const distItems = fs.readdirSync(distDir, { withFileTypes: true });
  for (const item of distItems) {
    if (item.isDirectory()) {
      const name = item.name;
      if (name.includes('%') || /[฀-๿]/.test(name)) {
        if (name.includes('บทความ')) {
          articleDirs++;
        } else if (name.includes('อัตร') || name.includes('ด-')) {
          calculatorDirs++;
        } else {
          categoryDirs++;
        }
      }
    }
  }
} catch (e) {
  console.log('Error scanning dist root');
}

// Better: check for actual Thai calculator directories
let thaiCalcs = 0;
try {
  const items = fs.readdirSync(distDir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory() && /[฀-๿]/.test(item.name)) {
      thaiCalcs++;
    }
  }
} catch (e) {
  // Ignore
}

console.log(`Thai calculator directories: ~${thaiCalcs}`);
console.log(`(Full detailed count requires deep scan - approximate count from directory inspection)`);
