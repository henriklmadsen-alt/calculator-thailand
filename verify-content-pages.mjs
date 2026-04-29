import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');

const walk = (dir) => {
  const files = [];
  const walkDir = (d) => {
    const entries = fs.readdirSync(d);
    for (const entry of entries) {
      const fullPath = path.join(d, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.endsWith('index.html')) {
        const relPath = path.relative(distDir, fullPath);
        // Exclude redirect pages: /calculator/*, /go/*, /admin/*
        if (!relPath.includes('/calculator/') && !relPath.includes('/go/') && !relPath.includes('/admin/')) {
          files.push(fullPath);
        }
      }
    }
  };
  walkDir(dir);
  return files;
};

const files = walk(distDir);
console.log(`📊 Content pages (excluding redirects): ${files.length}`);

const sample = files.sort(() => 0.5 - Math.random()).slice(0, Math.min(100, files.length));
console.log(`🔍 Checking ${sample.length} random content pages...\n`);

const signals = { og: 0, twitter: 0, schema: 0, ga4: 0, viewport: 0, gverify: 0, pwa: 0, sentry: 0 };

sample.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('property="og:')) signals.og++;
  if (content.includes('name="twitter:')) signals.twitter++;
  if (content.includes('"@context":"https://schema.org"')) signals.schema++;
  if (content.includes('G-EY67HJ8NDD')) signals.ga4++;
  if (content.includes('name="viewport"')) signals.viewport++;
  if (content.includes('google-site-verification')) signals.gverify++;
  if (content.includes('manifest.json')) signals.pwa++;
  if (content.includes('sentry')) signals.sentry++;
});

const metrics = [
  ['OG tags', signals.og],
  ['Twitter Card', signals.twitter],
  ['Schema.org markup', signals.schema],
  ['GA4 tracking', signals.ga4],
  ['Mobile viewport', signals.viewport],
  ['Google verify', signals.gverify],
  ['PWA manifest', signals.pwa],
  ['Sentry monitoring', signals.sentry],
];

console.log('✅ TRUST SIGNALS (content pages only):\n');
metrics.forEach(([name, count]) => {
  const pct = ((count / sample.length) * 100).toFixed(0);
  const icon = count === sample.length ? '✓' : count >= (sample.length * 0.98) ? '✓' : '⚠';
  console.log(`  ${icon} ${name.padEnd(25)} ${count}/${sample.length} (${pct}%)`);
});

const allGreen = Object.values(signals).every(v => v >= sample.length * 0.98);
console.log(`\n🎯 Status: ${allGreen ? 'GREEN ✓' : 'MIXED'}`);
