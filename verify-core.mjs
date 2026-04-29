import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

// Check core calculators
const coreCalcs = [
  'electricity-bill',
  'land-tax', 
  'loan-payment',
  'overtime-pay',
  'property-transfer-tax',
  'unit-converter'
];

const missing = [];
for (const calc of coreCalcs) {
  const thaiPath = path.join(distDir, 'คำนวณ-' + calc.replace(/-/g, '-'), 'index.html');
  const enPath = path.join(distDir, 'calculator', calc, 'index.html');
  
  if (!fs.existsSync(thaiPath) && !fs.existsSync(enPath)) {
    missing.push(calc);
  }
}

console.log(`Core calculators: ${6 - missing.length}/6 present`);
if (missing.length > 0) console.log(`Missing: ${missing.join(', ')}`);

// Count Thai pages
const getAllPages = (dir) => {
  let count = 0;
  const walk = (currentPath) => {
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      if (item === 'admin') continue;
      const fullPath = path.join(currentPath, item);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (item === 'index.html') {
        count++;
      }
    }
  };
  walk(dir);
  return count;
};

const totalPages = getAllPages(distDir);
const thaiPageDirs = fs.readdirSync(distDir).filter(d => /^[ก-ฮ]/.test(d)).length;

console.log(`\nTotal pages: ${totalPages}`);
console.log(`Thai root directories: ${thaiPageDirs}`);
