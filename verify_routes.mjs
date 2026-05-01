import fs from 'fs';

// Read manifest to get actual routes
const manifest = fs.readFileSync('./dist/server/manifest_DzfDelBo.mjs', 'utf-8');

// Core calculators check
const coreCalcs = [
  'คำนวณค่าไฟฟ้า',
  'คำนวณภาษีเงินได้บุคคลธรรมดา',
  'คำนวณผ่อนกู้',
  'คำนวณเงินเดือนสุทธิ',
  'คำนวณภาษีที่ดิน',
  'แปลงหน่วย',
];

console.log('\n=== CORE CALCULATOR VERIFICATION (Thai) ===');
const calcPaths = [
  'dist/server/pages/คำนวณค่าไฟฟ้า.astro.mjs',
  'dist/server/pages/คำนวณภาษีเงินได้บุคคลธรรมดา.astro.mjs',
  'dist/server/pages/คำนวณผ่อนกู้.astro.mjs',
  'dist/server/pages/คำนวณเงินเดือนสุทธิ.astro.mjs',
  'dist/server/pages/คำนวณภาษีที่ดิน.astro.mjs',
  'dist/server/pages/แปลงหน่วย.astro.mjs',
];

let found = 0;
coreCalcs.forEach((calc, idx) => {
  const exists = fs.existsSync(calcPaths[idx]);
  console.log(`${exists ? '✓' : '✗'} ${calc}`);
  if (exists) found++;
});
console.log(`\nCore Calculators: ${found}/6`);

// Count Thai pages
const allPages = fs.readdirSync('dist/server/pages', { recursive: true });
const thaiPages = allPages.filter(f => {
  const str = String(f);
  return str.includes('ค') || str.includes('แ') || str.includes('ว') || 
         str.includes('จ') || str.includes('ก') || str.includes('ม') ||
         str.includes('เ') || str.includes('ท') || str.includes('ล') ||
         str.includes('น') || str.includes('ส') || str.includes('ป') ||
         str.includes('ด') || str.includes('บ') || str.includes('ร') ||
         str.includes('ซ') || str.includes('ถ') || str.includes('อ');
}).length;

console.log(`\n=== THAI LANGUAGE COVERAGE ===`);
console.log(`Thai pages: ${thaiPages}/${allPages.length} (${((thaiPages/allPages.length)*100).toFixed(1)}%)`);
