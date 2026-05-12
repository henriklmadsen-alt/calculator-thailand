import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const redirectPathPattern = /[\\/](go|calculator)[\\/]/i;

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

function shouldSkipPage(filePath, content) {
  const normalized = filePath.replace(/\\/g, '/');
  const fileName = normalized.split('/').pop() || '';
  if (redirectPathPattern.test(normalized)) return true;
  if (/^google[a-z0-9]+\.html$/i.test(fileName)) return true;
  return /http-equiv=["']refresh["']/i.test(content);
}

const signals = { og: 0, twitter: 0, schema: 0, ga4: 0, viewport: 0, gverify: 0, pwa: 0, sentry: 0 };

let evaluatedCount = 0;
for (const page of sample) {
  const content = fs.readFileSync(page, 'utf8');
  if (shouldSkipPage(page, content)) continue;
  evaluatedCount++;
  if (content.includes('property="og:')) signals.og++;
  if (content.includes('name="twitter:')) signals.twitter++;
  if (content.includes('<script type="application/ld+json"')) signals.schema++;
  if (content.includes('G-EY67HJ8NDD')) signals.ga4++;
  if (content.includes('name="viewport"')) signals.viewport++;
  if (content.includes('google-site-verification')) signals.gverify++;
  if (content.includes('manifest.json')) signals.pwa++;
  if (content.includes('sentry')) signals.sentry++;
}

const base = evaluatedCount || 1;
console.log(`\nTrust Signals (${evaluatedCount} evaluated from 100-page sample):\nOG: ${signals.og}/${evaluatedCount} (${Math.round((signals.og / base) * 100)}%)\nTwitter: ${signals.twitter}/${evaluatedCount} (${Math.round((signals.twitter / base) * 100)}%)\nSchema: ${signals.schema}/${evaluatedCount} (${Math.round((signals.schema / base) * 100)}%)\nGA4: ${signals.ga4}/${evaluatedCount} (${Math.round((signals.ga4 / base) * 100)}%)\nViewport: ${signals.viewport}/${evaluatedCount} (${Math.round((signals.viewport / base) * 100)}%)\nGoogle verify: ${signals.gverify}/${evaluatedCount} (${Math.round((signals.gverify / base) * 100)}%)\nPWA: ${signals.pwa}/${evaluatedCount} (${Math.round((signals.pwa / base) * 100)}%)\nSentry: ${signals.sentry}/${evaluatedCount} (${Math.round((signals.sentry / base) * 100)}%)`);
