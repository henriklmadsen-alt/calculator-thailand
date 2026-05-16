const fs = require('fs');
const path = require('path');

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร',
  'index.astro',
);

const nextQuestions = [
  'ภาษีครึ่งปี ภ.ง.ด.94 ต้องยื่นเมื่อไร?',
  'ใครบ้างที่ต้องยื่นภาษีครึ่งปี?',
  'ภาษีครึ่งปีคำนวณจากรายได้ช่วงไหน?',
  'ไม่ยื่นภาษีครึ่งปีมีค่าปรับหรือไม่?',
];

let source = fs.readFileSync(filePath, 'utf8');
let idx = 0;
source = source.replace(/question:\s*'[^']*'/g, (m) => {
  if (idx < nextQuestions.length) {
    const replacement = `question: '${nextQuestions[idx]}'`;
    idx += 1;
    return replacement;
  }
  return m;
});

if (idx !== nextQuestions.length) {
  throw new Error(`Expected to replace ${nextQuestions.length} questions, replaced ${idx}`);
}

fs.writeFileSync(filePath, source, 'utf8');
console.log('updated_questions_count=' + idx);
