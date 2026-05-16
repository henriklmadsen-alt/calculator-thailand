import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน',
  'index.astro',
);

const source = fs.readFileSync(filePath, 'utf8');

const expectedQuestions = [
  'คำนวณภาษีเงินได้บุคคลธรรมดา 2569 อย่างไร?',
  'เงินเดือน 40,000 บาท เสียภาษีเท่าไร?',
  'ลดหย่อนภาษีอะไรได้บ้าง ในปี 2569?',
  'ยื่นภาษีล่าช้ากว่ากำหนด มีค่าปรับอย่างไร?',
];

test('T049: first 4 faqData questions match required high-intent set in order', () => {
  const questionMatches = [...source.matchAll(/question:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(questionMatches.length >= 4, 'Expected at least 4 faqData questions');
  assert.deepEqual(questionMatches.slice(0, 4), expectedQuestions);
});

test('T049: FAQ accordion renders from faqData mapping', () => {
  assert.match(source, /\{faqData\.map\(\(faq\) => \(/, 'FAQ accordion must map from faqData');
  assert.match(source, /\{faq\.question\}/, 'FAQ accordion must render faq.question');
  assert.match(source, /\{faq\.answer\}/, 'FAQ accordion must render faq.answer');
});

test('T049: faqData wiring preserved for FAQ JSON-LD parity', () => {
  assert.match(source, /faqData=\{faqData\}/, 'BlogPostLayout must receive faqData prop');
});
