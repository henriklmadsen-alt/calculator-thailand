import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Random sample 100 pages
const distPath = path.join(__dirname, 'dist');
const allPages = [];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file === 'index.html') {
      allPages.push(fullPath);
    }
  });
}

walkDir(distPath);

// Random sample
const sampleSize = Math.min(100, allPages.length);
const sample = [];
for (let i = 0; i < sampleSize; i++) {
  const idx = Math.floor(Math.random() * allPages.length);
  sample.push(allPages[idx]);
  allPages.splice(idx, 1);
}

const signals = {
  og: 0,
  twitter: 0,
  schema: 0,
  ga4: 0,
  mobile: 0,
  google_verify: 0,
  pwa: 0,
  sentry: 0
};

sample.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('property="og:title"')) signals.og++;
  if (content.includes('name="twitter:card"')) signals.twitter++;
  if (content.includes('"@type"')) signals.schema++;
  if (content.includes('G-EY67HJ8NDD')) signals.ga4++;
  if (content.includes('viewport')) signals.mobile++;
  if (content.includes('google-site-verification')) signals.google_verify++;
  if (content.includes('manifest.json')) signals.pwa++;
  if (content.includes('sentry')) signals.sentry++;
});

Object.entries(signals).forEach(([key, count]) => {
  const pct = Math.round((count / sampleSize) * 100);
  console.log(`${key}: ${count}/${sampleSize} (${pct}%)`);
});
