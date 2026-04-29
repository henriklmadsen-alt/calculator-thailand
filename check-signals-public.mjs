import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

// Get all public pages (exclude /admin/)
const getAllPages = (dir) => {
  const pages = [];
  const walk = (currentPath) => {
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      if (item === 'admin') continue; // Skip admin
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (item === 'index.html') {
        pages.push(fullPath);
      }
    }
  };
  walk(dir);
  return pages;
};

const pages = getAllPages(distDir);
const sample = pages.sort(() => Math.random() - 0.5).slice(0, 100);

const signals = { og: 0, twitter: 0, schema: 0, ga4: 0, viewport: 0, gverify: 0, pwa: 0, sentry: 0 };

for (const page of sample) {
  const content = fs.readFileSync(page, 'utf8');
  if (content.includes('property="og:')) signals.og++;
  if (content.includes('name="twitter:')) signals.twitter++;
  if (content.includes('<script type="application/ld+json"')) signals.schema++;
  if (content.includes('G-EY67HJ8NDD')) signals.ga4++;
  if (content.includes('name="viewport"')) signals.viewport++;
  if (content.includes('google-site-verification')) signals.gverify++;
  if (content.includes('manifest.json')) signals.pwa++;
  if (content.includes('sentry')) signals.sentry++;
}

console.log(`\nTrust Signals (100-page sample):\nOG: ${signals.og}/100 (${signals.og}%)\nTwitter: ${signals.twitter}/100 (${signals.twitter}%)\nSchema: ${signals.schema}/100 (${signals.schema}%)\nGA4: ${signals.ga4}/100 (${signals.ga4}%)\nViewport: ${signals.viewport}/100 (${signals.viewport}%)\nGoogle verify: ${signals.gverify}/100 (${signals.gverify}%)\nPWA: ${signals.pwa}/100 (${signals.pwa}%)\nSentry: ${signals.sentry}/100 (${signals.sentry}%)`);
