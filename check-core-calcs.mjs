import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');

// Core calculators by Thai slug
const core = [
  'คำนวณ-ค่าไฟฟ้า',
  'คำนวณ-ค่าที่ดิน',
  'คำนวณ-สินเชื่อ',
  'คำนวณ-ค่าล่วงเวลา',
  'คำนวณ-ค่าอากร',
  'คำนวณ-หน่วย'
];

console.log('📋 CORE CALCULATORS VERIFICATION:\n');
const signals = ['og', 'twitter', 'schema', 'ga4', 'viewport', 'gverify'];

core.forEach(slug => {
  const file = path.join(distDir, slug, 'index.html');
  if (!fs.existsSync(file)) {
    console.log(`❌ ${slug} — FILE NOT FOUND`);
    return;
  }
  
  const content = fs.readFileSync(file, 'utf8');
  const checks = {
    og: content.includes('property="og:'),
    twitter: content.includes('name="twitter:'),
    schema: content.includes('"@context":"https://schema.org"'),
    ga4: content.includes('G-EY67HJ8NDD'),
    viewport: content.includes('name="viewport"'),
    gverify: content.includes('google-site-verification'),
  };
  
  const allGood = Object.values(checks).every(v => v);
  const status = allGood ? '✓' : '⚠';
  console.log(`${status} ${slug}`);
  if (!allGood) {
    Object.entries(checks).forEach(([k, v]) => {
      if (!v) console.log(`    ✗ Missing ${k}`);
    });
  }
});
