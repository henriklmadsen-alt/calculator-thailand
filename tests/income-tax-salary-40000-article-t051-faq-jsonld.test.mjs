import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'คำนวณภาษีพนักงานเงินเดือน-40000-บาท',
  'index.astro',
);

const source = fs.readFileSync(filePath, 'utf8');

const expectedQuestions = [
  'เงินเดือน 40,000 บาท ต้องเสียภาษีเท่าไร?',
  'เงินเดือน 40,000 บาท เงินสุทธิที่ได้รับจริงเท่าไร?',
  'มีวิธีลดภาษีอย่างไรสำหรับเงินเดือน 40,000',
  'เงินเดือน 40,000 บาท ต้องยื่นภาษีไหม?',
];

test('T051: first 4 faqData questions match required 40,000-baht intent set in order', () => {
  const questionMatches = [...source.matchAll(/question:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(questionMatches.length >= 4, 'Expected at least 4 faqData questions');
  assert.deepEqual(questionMatches.slice(0, 4), expectedQuestions);
});

test('T051: FAQ accordion renders from faqData mapping', () => {
  assert.match(source, /\{faqData\.map\(\(faq\) => \(/, 'FAQ accordion must map from faqData');
  assert.match(source, /\{faq\.question\}/, 'FAQ accordion must render faq.question');
  assert.match(source, /\{faq\.answer\}/, 'FAQ accordion must render faq.answer');
});

test('T051: faqData wiring preserved for FAQ JSON-LD parity', () => {
  assert.match(source, /faqData=\{faqData\}/, 'BlogPostLayout must receive faqData prop');
});
