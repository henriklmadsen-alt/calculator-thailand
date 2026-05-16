import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร',
  'index.astro',
);

const source = fs.readFileSync(filePath, 'utf8');

const expectedQuestions = [
  'ภาษีครึ่งปี 2569 ต้องยื่นไหม?',
  'ภาษีครึ่งปีคำนวณอย่างไร?',
  'มนุษย์เงินเดือนต้องยื่นภาษีครึ่งปีไหม?',
  'ยื่นภาษีครึ่งปี ช่วงไหน?',
];

test('T050: first 4 faqData questions match required intent set in order', () => {
  const questionMatches = [...source.matchAll(/question:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(questionMatches.length >= 4, 'Expected at least 4 faqData questions');
  assert.deepEqual(questionMatches.slice(0, 4), expectedQuestions);
});

test('T050: FAQ accordion renders from faqData mapping', () => {
  assert.match(source, /\{faqData\.map\(\(faq\) => \(/, 'FAQ accordion must map from faqData');
  assert.match(source, /\{faq\.question\}/, 'FAQ accordion must render faq.question');
  assert.match(source, /\{faq\.answer\}/, 'FAQ accordion must render faq.answer');
});

test('T050: faqData wiring preserved for FAQ JSON-LD parity', () => {
  assert.match(source, /faqData=\{faqData\}/, 'BlogPostLayout must receive faqData prop');
});
