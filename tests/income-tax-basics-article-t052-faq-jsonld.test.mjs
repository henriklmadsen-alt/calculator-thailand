import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร',
  'index.astro',
);

const source = fs.readFileSync(filePath, 'utf8');

const expectedQuestions = [
  'ภาษีเงินได้บุคคลธรรมดาคืออะไร?',
  'ใครต้องยื่นภาษีเงินได้บุคคลธรรมดา?',
  'ขั้นภาษีเงินได้บุคคลธรรมดา 2569 มีกี่ขั้น?',
  'ค่าลดหย่อนภาษีเงินได้บุคคลธรรมดามีอะไรบ้าง?',
];

test('T052: first 4 faqData questions match required basics intent set in order', () => {
  const questionMatches = [...source.matchAll(/question:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(questionMatches.length >= 4, 'Expected at least 4 faqData questions');
  assert.deepEqual(questionMatches.slice(0, 4), expectedQuestions);
});

test('T052: FAQ accordion renders from faqData mapping', () => {
  assert.match(source, /\{faqData\.map\(\(faq\) => \(/, 'FAQ accordion must map from faqData');
  assert.match(source, /\{faq\.question\}/, 'FAQ accordion must render faq.question');
  assert.match(source, /\{faq\.answer\}/, 'FAQ accordion must render faq.answer');
});

test('T052: faqData wiring preserved for FAQ JSON-LD parity', () => {
  assert.match(source, /faqData=\{faqData\}/, 'BlogPostLayout must receive faqData prop');
});
