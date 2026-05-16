import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'เงินเดือน-20000-โอที-10-ชั่วโมง',
  'index.astro',
);

const source = fs.readFileSync(filePath, 'utf8');

const expectedQuestions = [
  'เงินเดือน 20,000 บาท ทำโอที 10 ชั่วโมง ได้เงินสุทธิรวมเท่าไร?',
  'โอทีวันทำงาน 1.5 เท่า คิดจากฐานเงินเดือน 20,000 อย่างไร?',
  'โอทีวันหยุด 2 เท่า และ 3 เท่า ต่างกันเท่าไรเมื่อทำ 10 ชั่วโมง?',
  'ค่าโอทีต้องรวมคำนวณภาษีและประกันสังคมหรือไม่?',
];

test('T058: first 4 FAQ intent questions exist in strict order', () => {
  const questionMatches = [...source.matchAll(/question:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(questionMatches.length >= 4, 'Expected at least 4 faqData questions');
  assert.deepEqual(questionMatches.slice(0, 4), expectedQuestions);
});

test('T058: visible FAQ renders from faqData mapping', () => {
  assert.match(source, /\{faqData\.map\(\(faq\) => \(/, 'FAQ accordion must map from faqData');
  assert.match(source, /\{faq\.question\}/, 'FAQ accordion must render faq.question');
  assert.match(source, /\{faq\.answer\}/, 'FAQ accordion must render faq.answer');
});

test('T058: faqData mapping remains intact for FAQ JSON-LD parity', () => {
  assert.match(source, /faqData=\{faqData\}/, 'BlogPostLayout must receive faqData prop');
});
