import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

// Check hreflang on Thai and English versions
const testPages = [
  { path: 'index.html', name: 'Homepage (Thai root)' },
  { path: 'คำนวณ-apr/index.html', name: 'Calculator (Thai)' },
  { path: 'en/index.html', name: 'Homepage (English)' },
  { path: 'en/คำนวณ-apr/index.html', name: 'Calculator (English)' },
];

console.log('\n╔════════════════════════════════════════════╗');
console.log('║   HREFLANG VERIFICATION (Bilingual Setup)   ║');
console.log('╚════════════════════════════════════════════╝\n');

testPages.forEach(test => {
  const fullPath = path.join(distDir, test.path);
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Missing: ${test.name} at ${test.path}`);
    return;
  }

  const html = fs.readFileSync(fullPath, 'utf-8');
  const hreflangMatches = html.match(/rel="alternate"[^>]*hreflang="[^"]*"/g) || [];
  
  console.log(`✅ ${test.name}`);
  hreflangMatches.forEach(match => {
    const langMatch = match.match(/hreflang="([^"]*)"/);
    if (langMatch) {
      console.log(`   ├─ ${langMatch[1]}`);
    }
  });
});

console.log('\n╔════════════════════════════════════════════╗');
console.log('║     CORE CALCULATORS VERIFICATION           ║');
console.log('╚════════════════════════════════════════════╝\n');

const coreCalcs = [
  { slug: 'คำนวณ-ค่าไฟฟ้า', en: 'electricity-bill', name: 'Electricity Bill' },
  { slug: 'คำนวณ-ค่าโอที', en: 'overtime-pay', name: 'Overtime Pay' },
  { slug: 'คำนวณภาษีโอน', en: 'property-transfer-tax', name: 'Property Transfer Tax' },
  { slug: 'คำนวณ-ค่าเช่า', en: 'loan-payment', name: 'Loan Payment' },
  { slug: 'คำนวณ-ภาษีอากร', en: 'land-tax', name: 'Land Tax' },
  { slug: 'เครื่องคำนวณ-หน่วย', en: 'unit-converter', name: 'Unit Converter' },
];

let foundCount = 0;
coreCalcs.forEach(calc => {
  const thaiPath = path.join(distDir, calc.slug, 'index.html');
  const enPath = path.join(distDir, 'en', calc.slug, 'index.html');
  
  const thaiExists = fs.existsSync(thaiPath);
  const enExists = fs.existsSync(enPath);
  
  if (thaiExists || enExists) {
    foundCount++;
    const status = thaiExists && enExists ? '✅' : thaiExists ? '⚠️ ' : enExists ? '⚠️ ' : '❌';
    console.log(`${status} ${calc.name}`);
    if (thaiExists) console.log(`   ├─ Thai: ${calc.slug}/`);
    if (enExists) console.log(`   └─ English: en/${calc.slug}/`);
  }
});

console.log(`\n  Total: ${foundCount}/${coreCalcs.length} calculators present`);
console.log('\n');
