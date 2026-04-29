import fs from 'fs';
import path from 'path';

const coreCalcs = [
  'dist/calculator/electricity-bill/index.html',
  'dist/calculator/land-tax/index.html',
  'dist/calculator/loan-payment/index.html',
  'dist/calculator/overtime-pay/index.html',
  'dist/calculator/property-transfer-tax/index.html',
  'dist/calculator/unit-converter/index.html'
];

console.log('\n🔧 CORE CALCULATOR VERIFICATION\n');
let allPresent = true;

coreCalcs.forEach(calc => {
  const exists = fs.existsSync(calc);
  console.log(`${exists ? '✓' : '❌'} ${path.basename(path.dirname(calc))}`);
  if (!exists) allPresent = false;
  
  if (exists) {
    const html = fs.readFileSync(calc, 'utf8');
    const hasForm = /<form|<input|<button/.test(html);
    const hasCalcLogic = /calculate|result|compute/i.test(html);
    console.log(`   └─ Form: ${hasForm ? '✓' : '❌'}, Logic: ${hasCalcLogic ? '✓' : '❌'}`);
  }
});

console.log(`\n${allPresent ? '✅ ALL CORE CALCULATORS PRESENT' : '❌ MISSING CORE CALCULATORS'}\n`);
