const fs = require('fs');
const path = require('path');

const results = {
  trustSignals: { total: 0, passing: 0, samples: [] },
  mobileViewport: { total: 0, passing: 0, samples: [] },
  calculators: { total: 0, working: 0, samples: [] },
  adSafety: { total: 0, passing: 0, samples: [] },
  thaiContent: { total: 0, verified: 0, samples: [] }
};

// Sample calculator pages
const calcSamples = [
  'dist/calculator/income-tax/index.html',
  'dist/calculator/loan-payment/index.html',
  'dist/calculator/net-salary/index.html',
  'dist/calculator/electricity-bill/index.html',
  'dist/calculator/overtime-pay/index.html',
  'dist/calculator/land-tax/index.html'
];

// Sample Thai pages
const thaiSamples = [
  'dist/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.html',
  'dist/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวดและดอกเบี้ย/index.html',
  'dist/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/index.html'
];

// Verify calculator pages
calcSamples.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    results.calculators.total++;
    
    if (content.includes('type="number"') && content.includes('button') && !content.includes('undefined')) {
      results.calculators.working++;
      results.calculators.samples.push({ file: filePath.split('/')[2], status: '✓' });
    } else {
      results.calculators.samples.push({ file: filePath.split('/')[2], status: '✗' });
    }
  }
});

// Verify mobile viewport
calcSamples.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    results.mobileViewport.total++;
    if (content.includes('viewport') && content.includes('width=device-width')) {
      results.mobileViewport.passing++;
      results.mobileViewport.samples.push({ file: filePath.split('/')[2], status: '✓' });
    } else {
      results.mobileViewport.samples.push({ file: filePath.split('/')[2], status: '✗' });
    }
  }
});

// Verify trust signals (OG, Schema, Canonical)
calcSamples.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    results.trustSignals.total++;
    const hasOG = content.includes('og:title') || content.includes('og:description');
    const hasSchema = content.includes('application/ld+json');
    const hasCanonical = content.includes('rel="canonical"');
    
    if (hasOG && hasSchema && hasCanonical) {
      results.trustSignals.passing++;
      results.trustSignals.samples.push({ file: filePath.split('/')[2], signals: `OG✓ Schema✓ Canon✓` });
    } else {
      const missing = [];
      if (!hasOG) missing.push('OG');
      if (!hasSchema) missing.push('Schema');
      if (!hasCanonical) missing.push('Canon');
      results.trustSignals.samples.push({ file: filePath.split('/')[2], signals: `Missing: ${missing.join(', ')}` });
    }
  }
});

// Verify ad safety (GuardedAdSlot wrapping)
calcSamples.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    results.adSafety.total++;
    if (content.includes('GuardedAdSlot') || content.includes('ad-slot')) {
      results.adSafety.passing++;
      results.adSafety.samples.push({ file: filePath.split('/')[2], status: '✓' });
    } else {
      results.adSafety.samples.push({ file: filePath.split('/')[2], status: '✗' });
    }
  }
});

// Verify Thai content rendering
thaiSamples.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    results.thaiContent.total++;
    // Check for Thai characters (Thai Unicode range: U+0E00-U+0E7F)
    if (/[฀-๿]/.test(content)) {
      results.thaiContent.verified++;
      results.thaiContent.samples.push({ file: path.basename(path.dirname(filePath)), status: '✓' });
    } else {
      results.thaiContent.samples.push({ file: path.basename(path.dirname(filePath)), status: '✗' });
    }
  }
});

// Report
console.log('\n=== UX VERIFICATION REPORT ===\n');
console.log(`Trust Signals: ${results.trustSignals.passing}/${results.trustSignals.total} (${Math.round(results.trustSignals.passing/results.trustSignals.total*100)}%)`);
console.log(`  Samples:`, results.trustSignals.samples.slice(0, 3));

console.log(`\nMobile Viewport: ${results.mobileViewport.passing}/${results.mobileViewport.total} (${Math.round(results.mobileViewport.passing/results.mobileViewport.total*100)}%)`);
console.log(`  Samples:`, results.mobileViewport.samples.slice(0, 3));

console.log(`\nCalculators Working: ${results.calculators.working}/${results.calculators.total} (${Math.round(results.calculators.working/results.calculators.total*100)}%)`);
console.log(`  Samples:`, results.calculators.samples.slice(0, 3));

console.log(`\nAd Safety: ${results.adSafety.passing}/${results.adSafety.total} (${Math.round(results.adSafety.passing/results.adSafety.total*100)}%)`);
console.log(`  Samples:`, results.adSafety.samples.slice(0, 3));

console.log(`\nThai Content: ${results.thaiContent.verified}/${results.thaiContent.total} (${Math.round(results.thaiContent.verified/results.thaiContent.total*100)}%)`);
console.log(`  Samples:`, results.thaiContent.samples.slice(0, 3));

const allPassing = results.trustSignals.passing === results.trustSignals.total &&
                   results.mobileViewport.passing === results.mobileViewport.total &&
                   results.calculators.working === results.calculators.total &&
                   results.adSafety.passing === results.adSafety.total &&
                   results.thaiContent.verified === results.thaiContent.total;

console.log(`\n${allPassing ? '✓ RELEASE-READY' : '✗ BLOCKERS DETECTED'}`);
