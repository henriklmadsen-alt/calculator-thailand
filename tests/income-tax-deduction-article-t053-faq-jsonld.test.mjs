import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด',
  'index.astro',
);

const source = fs.readFileSync(filePath, 'utf8');

const expectedQuestions = [
  'ลดหย่อนภาษีมีอะไรบ้าง ปี 2569?',
  'ลดหย่อนภาษีเงินได้บุคคลธรรมดามีอะไรบ้าง?',
  'ลดหย่อนภาษีมีอะไรบ้างที่ใช้ได้ตามกฎหมาย?',
  'ลดหย่อนภาษีต้องมีเอกสารอะไรบ้าง?',
];

test('T053: first 4 faqData questions match required deduction intent set in order', () => {
  const questionMatches = [...source.matchAll(/question:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(questionMatches.length >= 4, 'Expected at least 4 faqData questions');
  assert.deepEqual(questionMatches.slice(0, 4), expectedQuestions);
});

test('T053: faqData keeps at least 4 question-answer entries for visible FAQ rendering', () => {
  const questions = [...source.matchAll(/question:\s*'([^']+)'/g)];
  const answers = [...source.matchAll(/answer:\s*'([^']+)'/g)];
  assert.ok(questions.length >= 4, 'Expected at least 4 FAQ questions');
  assert.ok(answers.length >= 4, 'Expected at least 4 FAQ answers');
});

test('T053: faqData wiring preserved for FAQ JSON-LD parity', () => {
  assert.match(source, /faqData=\{faqData\}/, 'BlogPostLayout must receive faqData prop');
});
