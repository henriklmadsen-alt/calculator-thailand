const fs = require('fs');
const path = require('path');
const readline = require('readline');

const signals = {
  og_title: /property="og:title"/,
  og_desc: /property="og:description"/,
  og_image: /property="og:image"/,
  twitter_title: /name="twitter:title"/,
  twitter_desc: /name="twitter:description"/,
  twitter_image: /name="twitter:image"/,
  schema: /<script type="application\/ld\+json">/,
  ga4: /gtag\(|google-analytics|GA_MEASUREMENT_ID/,
  mobile_viewport: /viewport/,
  google_verify: /google-site-verification/,
  hreflang: /rel="alternate"/,
  sentry: /sentry|Sentry/
};

const signalCount = {};
let processedCount = 0;

async function processLine(line) {
  const filePath = line.trim();
  if (!filePath) return;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    processedCount++;
    
    Object.entries(signals).forEach(([key, regex]) => {
      if (!signalCount[key]) signalCount[key] = 0;
      if (regex.test(content)) {
        signalCount[key]++;
      }
    });
  } catch (e) {
    // Skip errors
  }
}

async function main() {
  const rl = readline.createInterface({
    input: fs.createReadStream('sample_pages.txt'),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    await processLine(line);
  }

  console.log(`\n📊 TRUST SIGNAL AUDIT (${processedCount}-page sample)\n`);
  console.log('Signal Coverage:');
  Object.entries(signalCount).forEach(([key, count]) => {
    const pct = Math.round((count / processedCount) * 100);
    console.log(`  ${key.padEnd(20)}: ${count}/${processedCount} (${pct}%)`);
  });
  
  const avgSignal = Math.round(
    Object.values(signalCount).reduce((a, b) => a + b, 0) / 
    (Object.keys(signalCount).length * processedCount) * 100
  );
  console.log(`\n  📈 AVERAGE SIGNAL: ${avgSignal}%`);
}

main();
