import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const articlePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร',
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
  'ภาษีครึ่งปี ภ.ง.ด.94 ต้องยื่นเมื่อไร?',
  'ใครบ้างที่ต้องยื่นภาษีครึ่งปี?',
  'ภาษีครึ่งปีคำนวณจากรายได้ช่วงไหน?',
  'ไม่ยื่นภาษีครึ่งปีมีค่าปรับหรือไม่?',
];

test('T072: first 4 faqData questions match high-intent half-year filing set in order', () => {
  const questionMatches = [...articleSource.matchAll(/question:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(questionMatches.length >= 4, 'Expected at least 4 faqData questions');
  assert.deepEqual(questionMatches.slice(0, 4), expectedQuestions);
});

test('T072: visible FAQ accordion renders from faqData mapping', () => {
  assert.match(articleSource, /\{faqData\.map\(\(faq\) => \(/u);
  assert.match(articleSource, /\{faq\.question\}/u);
  assert.match(articleSource, /\{faq\.answer\}/u);
});

test('T072: article passes faqData to layout for JSON-LD parity', () => {
  assert.match(articleSource, /faqData=\{faqData\}/u);
});

test('T072: FAQPage JSON-LD is generated from faqData in layout', () => {
  assert.match(layoutSource, /'@type':\s*'FAQPage'/u);
  assert.match(layoutSource, /mainEntity:\s*faqData\.map\(/u);
  assert.match(layoutSource, /name:\s*faq\.question/u);
  assert.match(layoutSource, /text:\s*faq\.answer/u);
  assert.match(layoutSource, /jsonLdFaq && <script type="application\/ld\+json"/u);
});
