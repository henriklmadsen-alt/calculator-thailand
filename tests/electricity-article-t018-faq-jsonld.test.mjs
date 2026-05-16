import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  'ค่าไฟ 2569 คิดยังไงจากหน่วยที่ใช้จริง?',
  'ค่า Ft ล่าสุดเท่าไร และกระทบยอดบิลอย่างไรบ้าง?',
  'บ้านใช้ไฟ 300 หน่วย ค่าไฟฟ้าเท่าไรโดยประมาณ?',
  'PEA กับ MEA คิดค่าไฟต่างกันไหม?',
];

test('T018: electricity article FAQ exists in visible page content', () => {
  assert.match(source, /faqData=\{faqData\}/u);
  assert.match(source, /<h2>คำถามที่พบบ่อย \(FAQ\)<\/h2>/u);
});

test('T018: required high-intent electricity FAQ questions appear in visible content', () => {
  for (const question of requiredQuestions) {
    assert.ok(source.includes(question), `missing visible FAQ intent: ${question}`);
  }
});

test('T018: FAQ JSON-LD is mapped from faqData via BlogPostLayout', () => {
  assert.match(source, /const faqData = \[/u);
  assert.match(source, /<BlogPostLayout[\s\S]*faqData=\{faqData\}/u);
});

test('T018: first 4 faqData entries exactly match required intent questions', () => {
  const faqDataBlock = source.match(/const faqData = \[([\s\S]*?)\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');

  const questions = Array.from(faqDataBlock[1].matchAll(/question:\s*'([^']+)'/gu)).map((m) => m[1]);
  assert.ok(questions.length >= 4, 'expected at least 4 FAQ questions');
  assert.deepEqual(questions.slice(0, 4), requiredQuestions);
});
