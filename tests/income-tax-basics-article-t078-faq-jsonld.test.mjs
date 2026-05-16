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
  'ภาษีเงินได้บุคคลธรรมดาคำนวณอย่างไรในปี 2569?',
  'ใครต้องยื่นภาษีเงินได้บุคคลธรรมดา?',
  'คำนวณภาษีจากเงินเดือนต้องเริ่มจากอะไร?',
  'วางแผนค่าลดหย่อนอย่างไรให้เสียภาษีถูกต้องและไม่พลาดสิทธิ?',
];

test('T078: first 4 FAQ intents are present in order', () => {
  const questionMatches = [...articleSource.matchAll(/question:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(questionMatches.length >= 4, 'Expected at least 4 faqData questions');
  assert.deepEqual(questionMatches.slice(0, 4), expectedQuestions);
});

test('T078: visible FAQ renders from faqData mapping', () => {
  assert.match(articleSource, /\{faqData\.map\(\(faq\) => \(/u);
  assert.match(articleSource, /\{faq\.question\}/u);
  assert.match(articleSource, /\{faq\.answer\}/u);
});

test('T078: FAQ JSON-LD parity is mapped from same faqData', () => {
  assert.match(articleSource, /faqData=\{faqData\}/u);
  assert.match(layoutSource, /'@type':\s*'FAQPage'/u);
  assert.match(layoutSource, /mainEntity:\s*faqData\.map\(/u);
  assert.match(layoutSource, /name:\s*faq\.question/u);
  assert.match(layoutSource, /text:\s*faq\.answer/u);
  assert.match(layoutSource, /jsonLdFaq && <script type="application\/ld\+json"/u);
});
