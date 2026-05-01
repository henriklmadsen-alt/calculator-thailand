import fs from 'fs';
import path from 'path';

const coreCalcs = [
  'dist/คำนวณค่าไฟฟ้า',
  'dist/คำนวณภาษีเงินได้บุคคลธรรมดา',
  'dist/คำนวณผ่อนกู้',
  'dist/คำนวณเงินเดือนสุทธิ',
  'dist/คำนวณภาษีที่ดิน',
  'dist/แปลงหน่วย'
];

console.log(`\n=== CORE CALCULATORS (6 required) ===`);
let count = 0;
coreCalcs.forEach(calc => {
  const indexPath = path.join(calc, 'index.html');
  const exists = fs.existsSync(indexPath);
  const status = exists ? '✓' : '✗';
  console.log(`${status} ${calc}`);
  if (exists) count++;
});

console.log(`\nCore Calculators: ${count}/6 ${count === 6 ? '✓' : '⚠️'}`);
