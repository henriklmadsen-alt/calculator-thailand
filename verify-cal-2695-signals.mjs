#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');

// Core calculator paths to verify
const corePages = [
  'calculator/electricity-bill/index.html',
  'calculator/land-tax/index.html',
  'calculator/loan-payment/index.html',
  'calculator/overtime-pay/index.html',
  'calculator/property-transfer-tax/index.html',
  'calculator/unit-converter/index.html',
  'index.html',
];

// Trust signal checks
function checkTrustSignals(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const signals = {
      og_title: /property="og:title"/g.test(content),
      og_description: /property="og:description"/g.test(content),
      og_image: /property="og:image"/g.test(content),
      twitter_card: /name="twitter:card"/g.test(content),
      schema: /<script[^>]*type="application\/ld\+json"/g.test(content),
      ga4: /gtag|google-analytics|G-/g.test(content),
      mobile_viewport: /name="viewport"/g.test(content),
      google_verify: /google-site-verification/g.test(content),
    };
    return signals;
  } catch (e) {
    return null;
  }
}

let passed = 0;
let failed = 0;

console.log('CAL-2695 QA Heartbeat — Trust Signals Spot-Check\n');

for (const page of corePages) {
  const filePath = path.join(distDir, page);
  if (fs.existsSync(filePath)) {
    const signals = checkTrustSignals(filePath);
    const signalCount = Object.values(signals).filter(Boolean).length;
    const status = signalCount >= 6 ? '✓' : '⚠';
    console.log(`${status} ${page}: ${signalCount}/8 signals`);
    if (signalCount >= 6) passed++;
    else failed++;
  } else {
    console.log(`✗ ${page}: NOT FOUND`);
    failed++;
  }
}

console.log(`\nResult: ${passed}/${corePages.length} pages passed trust signals`);
process.exit(failed > 0 ? 1 : 0);
