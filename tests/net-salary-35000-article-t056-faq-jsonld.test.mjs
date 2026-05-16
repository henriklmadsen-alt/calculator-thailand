import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'เงินเดือน-35000-รับเท่าไร',
  'index.astro',
);

const source = fs.readFileSync(filePath, 'utf8');

const expectedQuestions = [
  'เงินเดือน 35,000 บาท รับสุทธิเท่าไรหลังหักประกันสังคมและภาษี?',
  'เงินเดือน 35,000 บาท ต้องเสียภาษีเดือนละเท่าไร?',
  'เงินเดือน 35,000 บาท ถ้าสมัครกองทุนสำรองเลี้ยงชีพจะเหลือเท่าไร?',
  'เงินเดือน 35,000 บาท ลดภาษีอย่างไรให้เงินสุทธิเพิ่มขึ้น?',
];

test('T056: first 4 FAQ intent questions exist in order', () => {
  const questionMatches = [...source.matchAll(/question:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(questionMatches.length >= 4, 'Expected at least 4 faqData questions');
  assert.deepEqual(questionMatches.slice(0, 4), expectedQuestions);
});

test('T056: FAQ accordion renders from faqData mapping', () => {
  assert.match(source, /\{faqData\.map\(\(faq\) => \(/, 'FAQ accordion must map from faqData');
  assert.match(source, /\{faq\.question\}/, 'FAQ accordion must render faq.question');
  assert.match(source, /\{faq\.answer\}/, 'FAQ accordion must render faq.answer');
});

test('T056: faqData wiring remains intact for JSON-LD parity', () => {
  assert.match(source, /faqData=\{faqData\}/, 'BlogPostLayout must receive faqData prop');
});
