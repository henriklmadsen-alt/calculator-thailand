import fs from 'fs';
import path from 'path';

const coreCalcs = [
  'electricity-bill',
  'land-tax',
  'loan-payment',
  'overtime-pay',
  'property-transfer-tax',
  'unit-converter'
];

const distDir = 'dist';
const found = {};
const missing = [];

coreCalcs.forEach(calc => {
  found[calc] = false;
});

function searchForCalc(dir, calcName) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        if (file.includes(calcName) || file.includes(calcName.replace(/-/g, '_'))) {
          return true;
        }
        if (searchForCalc(filePath, calcName)) {
          return true;
        }
      } else if (file === 'index.html') {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(calcName) || content.includes(calcName.replace(/-/g, ' '))) {
          return true;
        }
      }
    }
  } catch (e) {
    // Ignore
  }
  return false;
}

coreCalcs.forEach(calc => {
  if (fs.existsSync(path.join(distDir, calc))) {
    found[calc] = true;
  } else if (searchForCalc(distDir, calc)) {
    found[calc] = true;
  }
});

console.log('=== CORE CALCULATORS ===');
let present = 0;
coreCalcs.forEach(calc => {
  const status = found[calc] ? '✓' : '✗';
  console.log(`${status} ${calc}`);
  if (found[calc]) present++;
});

console.log(`\nPresent: ${present}/${coreCalcs.length}`);

// Count Thai pages
const getAllHtmlFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file === 'index.html') {
      fileList.push(filePath);
    }
  });
  return fileList;
};

const allFiles = getAllHtmlFiles(distDir);
let thaiPages = 0;
const thaiChars = /[฀-๿]/; // Thai Unicode range

allFiles.forEach(file => {
  const dirPath = path.dirname(file);
  if (thaiChars.test(dirPath)) {
    thaiPages++;
  }
});

console.log(`\n=== THAI PAGES ===`);
console.log(`Thai pages: ${thaiPages}/${allFiles.length} (${Math.round((thaiPages/allFiles.length)*100)}%)`);
