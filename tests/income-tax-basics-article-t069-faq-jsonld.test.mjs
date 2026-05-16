import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const articlePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร',
  'index.astro',
);

const layoutPath = path.join(
  process.cwd(),
  'src',
  'layouts',
  'BlogPostLayout.astro',
);

const articleSource = fs.readFileSync(articlePath, 'utf8');
const layoutSource = fs.readFileSync(layoutPath, 'utf8');

const expectedQuestions = [
  'ภาษีเงินได้บุคคลธรรมดา 2569 คืออะไร และใครต้องยื่นแบบ?',
  'เงินเดือนเท่าไรในปี 2569 ถึงต้องเสียภาษีเงินได้บุคคลธรรมดา?',
  'คำนวณภาษีเงินได้บุคคลธรรมดา 2569 ให้ถูกต้องต้องเริ่มจากอะไร?',
  'ค่าลดหย่อนภาษีเงินได้บุคคลธรรมดา 2569 อะไรช่วยลดภาษีได้มากที่สุด?',
];

test('T069: first 4 faqData questions match high-intent PIT basics set in order', () => {
  const questionMatches = [...articleSource.matchAll(/question:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(questionMatches.length >= 4, 'Expected at least 4 faqData questions');
  assert.deepEqual(questionMatches.slice(0, 4), expectedQuestions);
});

test('T069: visible FAQ accordion renders from faqData mapping', () => {
  assert.match(articleSource, /\{faqData\.map\(\(faq\) => \(/u);
  assert.match(articleSource, /\{faq\.question\}/u);
  assert.match(articleSource, /\{faq\.answer\}/u);
});

test('T069: article passes faqData to layout for JSON-LD parity', () => {
  assert.match(articleSource, /faqData=\{faqData\}/u);
});

test('T069: FAQPage JSON-LD is generated from faqData in layout', () => {
  assert.match(layoutSource, /'@type':\s*'FAQPage'/u);
  assert.match(layoutSource, /mainEntity:\s*faqData\.map\(/u);
  assert.match(layoutSource, /name:\s*faq\.question/u);
  assert.match(layoutSource, /text:\s*faq\.answer/u);
  assert.match(layoutSource, /jsonLdFaq && <script type="application\/ld\+json"/u);
});
