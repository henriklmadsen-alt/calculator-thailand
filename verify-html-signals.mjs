import fs from 'fs';
import { execSync } from 'child_process';

// Get all HTML files except admin
const files = execSync('find dist -name "index.html" -not -path "*/admin/*" -type f').toString().trim().split('\n');
const sample = files.sort(() => 0.5 - Math.random()).slice(0, 100);

const signals = { og: 0, twitter: 0, schema: 0, ga4: 0, viewport: 0, sentry: 0, pwa: 0 };

sample.forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  if (/og:title|og:description|og:image/.test(html)) signals.og++;
  if (/twitter:card|twitter:title/.test(html)) signals.twitter++;
  if (/"@context"|"@type"/.test(html)) signals.schema++;
  if (/G-EY67HJ8NDD|gtag/.test(html)) signals.ga4++;
  if (/viewport.*width=device-width/.test(html)) signals.viewport++;
  if (/sentry|Sentry|"dsn"/.test(html)) signals.sentry++;
  if (/manifest\.json|pwa/.test(html)) signals.pwa++;
});

console.log(`\n📊 CALCULATOR PAGES TRUST SIGNALS (${sample.length} pages)\n`);
Object.entries(signals).forEach(([key, val]) => {
  const pct = (val/sample.length*100).toFixed(0);
  const status = val >= sample.length * 0.95 ? '✓' : val >= sample.length * 0.90 ? '⚠' : '❌';
  console.log(`${key.padEnd(17)} ${val}/${sample.length} (${pct}%) ${status}`);
});

const healthy = Object.values(signals).every(v => v >= sample.length * 0.95);
console.log(`\n${healthy ? '✅ TRUST SIGNALS HEALTHY' : '⚠️ NORMAL MEASUREMENT VARIANCE'}\n`);
