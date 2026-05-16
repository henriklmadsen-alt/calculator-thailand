import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const articlePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน',
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
  'เงินเดือนเท่านี้ต้องจ่ายภาษีประมาณเท่าไรในปี 2569?',
  'ค่าลดหย่อนตัวไหนช่วยลดภาษีได้มากที่สุดสำหรับมนุษย์เงินเดือน?',
  'ภาษีที่ถูกหักรายเดือนต่างจากยอดภาษีสิ้นปีอย่างไร?',
  'วางแผนภาษีแบบถูกกฎหมายอย่างไรเพื่อไม่ให้จ่ายขาดหรือเกิน?',
];

test('T066: first 4 FAQ intents are present in visible FAQ order', () => {
  const questionMatches = [...articleSource.matchAll(/question:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(questionMatches.length >= 4, 'Expected at least 4 faqData questions');
  assert.deepEqual(questionMatches.slice(0, 4), expectedQuestions);

  assert.match(articleSource, /\{faqData\.map\(\(faq\) => \(/u);
  assert.match(articleSource, /\{faq\.question\}/u);
  assert.match(articleSource, /\{faq\.answer\}/u);
});

test('T066: FAQPage JSON-LD generation is present', () => {
  assert.match(layoutSource, /'@type':\s*'FAQPage'/u, 'FAQPage JSON-LD type missing');
  assert.match(layoutSource, /mainEntity:\s*faqData\.map\(/u, 'FAQ JSON-LD must map from faqData');
  assert.match(layoutSource, /name:\s*faq\.question/u, 'FAQ JSON-LD question mapping missing');
  assert.match(layoutSource, /text:\s*faq\.answer/u, 'FAQ JSON-LD answer mapping missing');
  assert.match(layoutSource, /jsonLdFaq && <script type="application\/ld\+json"/u, 'FAQ JSON-LD script output missing');
});

test('T066: JSON-LD content parity path uses article faqData', () => {
  const questionMatches = [...articleSource.matchAll(/question:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.deepEqual(questionMatches.slice(0, 4), expectedQuestions);
  assert.match(articleSource, /faqData=\{faqData\}/u, 'Article must pass faqData prop to layout');
});
