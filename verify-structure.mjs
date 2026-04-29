import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

const countDirs = (dir) => {
  try {
    return fs.readdirSync(dir).length;
  } catch {
    return 0;
  }
};

const countHtmlFiles = (dir) => {
  let count = 0;
  const walk = (d) => {
    try {
      fs.readdirSync(d).forEach(file => {
        const full = path.join(d, file);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) walk(full);
        else if (file.endsWith('.html')) count++;
      });
    } catch (e) {}
  };
  walk(dir);
  return count;
};

const categories = countDirs(path.join(distDir, 'หมวดหมู่'));
const articles = countDirs(path.join(distDir, 'บทความ'));
const calculators = countDirs(path.join(distDir, 'คำนวณ-calculator'));
const total = countHtmlFiles(distDir);

console.log('\n╔════════════════════════════════════════════╗');
console.log('║  UX HEARTBEAT CAL-2671 — BUILD STRUCTURE   ║');
console.log('╚════════════════════════════════════════════╝\n');

console.log(`  📊 Total HTML pages: ${total}`);
console.log(`  📁 Categories: ${categories} directories`);
console.log(`  📰 Articles: ${articles} directories`);
console.log(`  🧮 Thai calculators: ${calculators}+ directories\n`);

// Verify homepage and key pages
const keyPages = [
  'index.html',
  'เกี่ยวกับเรา/index.html',
  'ติดต่อเรา/index.html',
  'นโยบายความเป็นส่วนตัว/index.html',
  'คำแนะนำการใช้/index.html',
];

console.log('  Key pages verification:');
keyPages.forEach(page => {
  const fullPath = path.join(distDir, page);
  const exists = fs.existsSync(fullPath);
  console.log(`    ${exists ? '✅' : '❌'} ${page}`);
});

console.log('\n  Mobile optimizations present:');
// Check homepage for mobile optimizations
const homepageHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
const checks = {
  'Responsive viewport': /"viewport".*?width=device-width/.test(homepageHtml),
  'Mobile-first CSS': /@media.*?max-width/.test(homepageHtml),
  'Touch-friendly icons': /apple-touch-icon|apple-mobile-web-app/.test(homepageHtml),
  'PWA manifest': /manifest.json/.test(homepageHtml),
  'No viewport meta conflicts': !homepageHtml.match(/viewport.*?width=\d+px/),
};

Object.entries(checks).forEach(([check, passes]) => {
  console.log(`    ${passes ? '✅' : '❌'} ${check}`);
});

console.log('\n');
