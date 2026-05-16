import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/คำนวณค่าโอที-2569-กฎหมายแรงงาน/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  'โอที 1.5 เท่า คิดจากเงินเดือนหรือค่าแรงต่อชั่วโมง?',
  'โอทีวันหยุด 2 เท่า กับ 3 เท่า ต่างกันอย่างไร?',
  'ทำโอทีเกินวันละ 3 ชั่วโมง ผิดกฎหมายแรงงานไหม?',
  'นายจ้างไม่จ่ายโอทีหรือจ่ายไม่ครบ ต้องทำอย่างไร?',
];

test('T017: overtime article FAQ section exists in visible page content', () => {
  assert.match(source, /<BlogPostLayout[\s\S]*faqData=\{faqData\}/u);
});

test('T017: required legal-intent overtime questions appear in visible article content', () => {
  for (const question of requiredQuestions) {
    assert.ok(source.includes(question), `missing visible FAQ intent: ${question}`);
  }
});

test('T017: FAQ JSON-LD is generated from faqData in BlogPostLayout', () => {
  assert.match(source, /const faqData = \[/u);
  assert.match(source, /<BlogPostLayout[\s\S]*faqData=\{faqData\}/u);
});

test('T017: first 4 faqData items match the required legal-intent questions', () => {
  const faqDataBlock = source.match(/const faqData = \[([\s\S]*?)\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');

  const questions = Array.from(faqDataBlock[1].matchAll(/question:\s*'([^']+)'/gu)).map((m) => m[1]);
  assert.ok(questions.length >= 4, 'expected at least 4 FAQ questions');
  assert.deepEqual(questions.slice(0, 4), requiredQuestions);
});
