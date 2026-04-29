import fs from 'fs';

const coreCalcs = [
  'dist/คำนวณ-ค่าไฟฟ้า/index.html',
  'dist/คำนวณ-ภาษีที่ดิน/index.html',
  'dist/คำนวณ-ค่าเบี้ยประกันภัย/index.html',
  'dist/คำนวณ-ค่าโอที/index.html',
  'dist/คำนวณ-ภาษีโอนอสังหาริมทรัพย์/index.html',
  'dist/คำนวณ-การแปลงหน่วย/index.html',
];

console.log('=== CORE CALCULATOR PAGES ===');
coreCalcs.forEach(calc => {
  const exists = fs.existsSync(calc);
  console.log(`${exists ? '✓' : '✗'} ${calc}`);
});

// Check Sentry in main layout
console.log('\n=== SENTRY INITIALIZATION CHECK ===');
const layoutPath = 'src/layouts/BaseLayout.astro';
const layoutContent = fs.readFileSync(layoutPath, 'utf8');

if (layoutContent.includes('Sentry.init')) {
  console.log('✓ Sentry.init found in BaseLayout.astro');
  const sentryLines = layoutContent.split('\n').filter(l => l.includes('Sentry'));
  sentryLines.slice(0, 3).forEach(l => console.log(`  ${l.trim()}`));
} else {
  console.log('✗ Sentry.init NOT found in BaseLayout.astro');
}

// Check a sample page for Sentry
console.log('\n=== SAMPLE PAGE SENTRY CHECK ===');
const samplePage = 'dist/คำนวณ-ค่าไฟฟ้า/index.html';
if (fs.existsSync(samplePage)) {
  const content = fs.readFileSync(samplePage, 'utf8');
  const hasSentry = content.includes('Sentry.init') || content.includes('sentry');
  console.log(`${hasSentry ? '✓' : '✗'} Sentry present in sample page`);
  
  // Search for sentry in script tags
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?Sentry[\s\S]*?)<\/script>/);
  if (scriptMatch) {
    console.log('Found Sentry in script tag');
  } else {
    console.log('Sentry not in inline script tags');
  }
}
