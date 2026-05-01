import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

const signals = {
  og: /og:title/,
  twitter: /twitter:title/,
  schema: /@context/,
  ga4: /gtag|ga4/,
  mobile: /mobile-web-app-capable|viewport.*width=device-width/,
  google: /google-site-verification/,
  hreflang: /hreflang/,
};

function checkPage(file) {
  const html = fs.readFileSync(file, 'utf8');
  const result = {};
  
  for (const [key, regex] of Object.entries(signals)) {
    result[key] = regex.test(html) ? 1 : 0;
  }
  return result;
}

function walkDir(dir) {
  const pages = [];
  const stack = [dir];
  
  while (stack.length) {
    const current = stack.pop();
    const items = fs.readdirSync(current);
    
    for (const item of items) {
      const fullPath = path.join(current, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        stack.push(fullPath);
      } else if (item === 'index.html') {
        pages.push(fullPath);
      }
    }
  }
  return pages;
}

const pages = walkDir(distDir);
const sample = pages.sort(() => Math.random() - 0.5).slice(0, 100);

const stats = {};
for (const key of Object.keys(signals)) {
  stats[key] = 0;
}

for (const page of sample) {
  const result = checkPage(page);
  for (const [key, val] of Object.entries(result)) {
    stats[key] += val;
  }
}

console.log(`=== Trust Signals (${sample.length}-page sample) ===`);
for (const [key, count] of Object.entries(stats)) {
  const pct = (count * 100 / sample.length).toFixed(1);
  console.log(`${key}: ${pct}% (${count}/${sample.length})`);
}

const avg = Object.values(stats).reduce((a, b) => a + b, 0) / Object.keys(stats).length;
console.log(`\nAverage: ${(avg * 100 / sample.length).toFixed(1)}%`);
