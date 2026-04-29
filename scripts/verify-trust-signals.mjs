import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node:path';

const distDir = 'dist';

function getAllPages(dir, pages = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllPages(path, pages);
    } else if (entry.name === 'index.html') {
      pages.push(path);
    }
  }
  return pages;
}

function samplePages(pages, sampleSize = 100) {
  const shuffled = [...pages].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(sampleSize, pages.length));
}

function checkSignals(html) {
  const signals = {
    og: { count: 0, target: 'og' },
    twitter: { count: 0, target: 'twitter' },
    schema: { count: 0, target: 'schema' },
    ga4: { count: 0, target: 'ga4' },
    mobileViewport: { count: 0, target: 'mobile-viewport' },
    googleVerify: { count: 0, target: 'google-verify' },
    hreflang: { count: 0, target: 'hreflang' },
    sentry: { count: 0, target: 'sentry' },
  };

  // OG tags
  if (html.includes('property="og:')) signals.og.present = true;

  // Twitter tags
  if (html.includes('name="twitter:')) signals.twitter.present = true;

  // Schema.org
  if (html.includes('application/ld+json')) signals.schema.present = true;

  // GA4
  if (html.includes('gtag') || html.includes('GA_MEASUREMENT_ID') || html.includes('googletagmanager')) {
    signals.ga4.present = true;
  }

  // Mobile viewport
  if (html.includes('viewport') && html.includes('mobile-optimized|width=device-width')) {
    signals.mobileViewport.present = true;
  }

  // Google verification
  if (html.includes('google-site-verification')) signals.googleVerify.present = true;

  // Hreflang
  if (html.includes('hreflang=')) signals.hreflang.present = true;

  // Sentry
  if (html.includes('sentry') || html.includes('dsn')) signals.sentry.present = true;

  return signals;
}

function verifyPages(sample) {
  const results = {
    og: { present: 0, total: sample.length },
    twitter: { present: 0, total: sample.length },
    schema: { present: 0, total: sample.length },
    ga4: { present: 0, total: sample.length },
    mobileViewport: { present: 0, total: sample.length },
    googleVerify: { present: 0, total: sample.length },
    hreflang: { present: 0, total: sample.length },
    sentry: { present: 0, total: sample.length },
  };

  for (const pagePath of sample) {
    const html = readFileSync(pagePath, 'utf8');
    const signals = checkSignals(html);

    if (signals.og.present) results.og.present++;
    if (signals.twitter.present) results.twitter.present++;
    if (signals.schema.present) results.schema.present++;
    if (signals.ga4.present) results.ga4.present++;
    if (signals.mobileViewport.present) results.mobileViewport.present++;
    if (signals.googleVerify.present) results.googleVerify.present++;
    if (signals.hreflang.present) results.hreflang.present++;
    if (signals.sentry.present) results.sentry.present++;
  }

  return results;
}

const allPages = getAllPages(distDir);
const sampled = samplePages(allPages, 100);
const results = verifyPages(sampled);

console.log('\n✅ Trust Signal Verification Results');
console.log(`Sample size: ${sampled.length} pages from ${allPages.length} total\n`);

const signals = ['og', 'twitter', 'schema', 'ga4', 'mobileViewport', 'googleVerify', 'hreflang', 'sentry'];
const labels = ['OG Tags', 'Twitter Cards', 'Schema.org', 'GA4 Tracking', 'Mobile Viewport', 'Google Verify', 'Hreflang', 'Sentry'];

for (let i = 0; i < signals.length; i++) {
  const key = signals[i];
  const label = labels[i];
  const rate = Math.round((results[key].present / results[key].total) * 100);
  console.log(`${label}: ${results[key].present}/${results[key].total} (${rate}%) ${'✓'}`);
}
