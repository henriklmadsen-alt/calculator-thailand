import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

// Get 100 random calculator directories
const allCalcDirs = fs.readdirSync(distDir).filter(f => f.startsWith('คำนวณ-'));
const sampleDirs = allCalcDirs.sort(() => Math.random() - 0.5).slice(0, 100);

const results = {
  og: [], twitter: [], schema: [], ga4: [], viewport: [],
  googleVerify: [], pwa: [], sentry: [], total: 0
};

sampleDirs.forEach(dir => {
  const indexPath = path.join(distDir, dir, 'index.html');
  if (!fs.existsSync(indexPath)) return;
  
  const html = fs.readFileSync(indexPath, 'utf8');
  results.total++;
  
  if (html.includes('property="og:')) results.og.push(true); else results.og.push(false);
  if (html.includes('name="twitter:')) results.twitter.push(true); else results.twitter.push(false);
  
  // More detailed schema check
  const hasSchema = html.includes('"@type"') || html.includes("'@type'");
  results.schema.push(hasSchema);
  
  if (html.includes('G-EY67HJ8NDD')) results.ga4.push(true); else results.ga4.push(false);
  if (html.includes('viewport') && html.includes('width=device-width')) results.viewport.push(true); else results.viewport.push(false);
  if (html.includes('google-site-verification')) results.googleVerify.push(true); else results.googleVerify.push(false);
  if (html.includes('manifest.json')) results.pwa.push(true); else results.pwa.push(false);
  if (html.includes('Sentry') || html.includes('sentry')) results.sentry.push(true); else results.sentry.push(false);
});

const metrics = ['og', 'twitter', 'schema', 'ga4', 'viewport', 'googleVerify', 'pwa', 'sentry'];
const output = [];
metrics.forEach(key => {
  const count = results[key].filter(v => v).length;
  const pct = Math.round((count / results.total) * 100);
  output.push(`${key}: ${count}/${results.total} (${pct}%)`);
});

console.log(output.join('\n'));
console.log(`\nSample: ${results.total} pages`);
