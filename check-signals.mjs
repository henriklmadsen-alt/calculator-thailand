import fs from 'fs';
import path from 'path';

const distDir = 'dist';
let count = 0, noOG = 0, noGA4 = 0, noSentry = 0;

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    if (count > 100) return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) walk(fullPath);
    else if (file === 'index.html') {
      count++;
      const html = fs.readFileSync(fullPath, 'utf8');
      if (!html.includes('og:title')) { noOG++; if (noOG === 1) console.log('First no OG:', fullPath); }
      if (!html.includes('G-EY67HJ8NDD')) noGA4++;
      if (!html.includes('sentry') && !html.includes('Sentry')) { noSentry++; if (noSentry === 1) console.log('First no Sentry:', fullPath); }
    }
  });
}

walk(distDir);
console.log(`Checked ${count} pages: No OG=${noOG}, No GA4=${noGA4}, No Sentry=${noSentry}`);
