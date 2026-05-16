const fs = require('fs');
const path = require('path');

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด',
  'index.astro',
);

const nextQuestions = [
  'ลดหย่อนภาษี 2569 มีอะไรบ้าง?',
  'ลดหย่อนภาษีเงินได้บุคคลธรรมดาได้สูงสุดเท่าไร?',
  'SSF/RMF ลดหย่อนภาษีได้เท่าไร?',
  'วางแผนลดหย่อนอย่างไรให้ประหยัดภาษีได้มากที่สุด?',
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
