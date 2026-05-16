import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const articlePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด',
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
  'ลดหย่อนภาษี 2569 มีอะไรบ้าง?',
  'ลดหย่อนภาษีเงินได้บุคคลธรรมดาได้สูงสุดเท่าไร?',
  'SSF/RMF ลดหย่อนภาษีได้เท่าไร?',
  'วางแผนลดหย่อนอย่างไรให้ประหยัดภาษีได้มากที่สุด?',
];

test('T075: first 4 FAQ intents are present in order', () => {
  const questionMatches = [...articleSource.matchAll(/question:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(questionMatches.length >= 4, 'Expected at least 4 faqData questions');
  assert.deepEqual(questionMatches.slice(0, 4), expectedQuestions);
});

test('T075: faqData keeps ordered question-answer pairs for visible FAQ output', () => {
  const faqBlocks = [...articleSource.matchAll(/question:\s*'([^']+)'\s*,\s*answer:\s*'([^']+)'/g)];
  assert.ok(faqBlocks.length >= 4, 'Expected at least 4 FAQ question-answer pairs');
  assert.deepEqual(
    faqBlocks.slice(0, 4).map((m) => m[1]),
    expectedQuestions,
    'First 4 visible FAQ intents must stay in order',
  );
  for (const [, question, answer] of faqBlocks.slice(0, 4)) {
    assert.ok(question.trim().length > 0, 'FAQ question must not be empty');
    assert.ok(answer.trim().length > 0, 'FAQ answer must not be empty');
  }
});

test('T075: FAQ JSON-LD parity is mapped from the same faqData', () => {
  assert.match(articleSource, /faqData=\{faqData\}/u);
  assert.match(layoutSource, /'@type':\s*'FAQPage'/u);
  assert.match(layoutSource, /mainEntity:\s*faqData\.map\(/u);
  assert.match(layoutSource, /name:\s*faq\.question/u);
  assert.match(layoutSource, /text:\s*faq\.answer/u);
  assert.match(layoutSource, /jsonLdFaq && <script type="application\/ld\+json"/u);
});
