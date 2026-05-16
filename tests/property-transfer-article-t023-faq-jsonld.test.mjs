import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  'ค่าโอนบ้านทั้งหมดเท่าไร (ค่าโอน + จดจำนอง + ภาษี)?',
  'ผู้ซื้อหรือผู้ขายใครจ่ายค่าโอนบ้านมากกว่ากัน?',
  'ค่าโอนบ้านปี 2569 ถ้าเข้าเกณฑ์ 0.01% ต้องเช็กอะไรบ้าง?',
  'ภาษีธุรกิจเฉพาะกับอากรแสตมป์ ต่างกันอย่างไรและเสียซ้ำไหม?',
];

test('T023: property-transfer article FAQ exists in visible page content', () => {
  assert.match(source, /faqData=\{faqData\}/u);
  assert.match(source, /<h2>คำถามที่พบบ่อย \(FAQ\)<\/h2>/u);
});

test('T023: required high-intent property-transfer FAQ questions appear in visible content', () => {
  for (const question of requiredQuestions) {
    assert.ok(source.includes(question), `missing visible FAQ intent: ${question}`);
  }
});

test('T023: FAQ JSON-LD is mapped from faqData via BlogPostLayout', () => {
  assert.match(source, /const faqData = \[/u);
  assert.match(source, /<BlogPostLayout[\s\S]*faqData=\{faqData\}/u);
});

test('T023: first 4 faqData entries exactly match required intent questions', () => {
  const faqDataBlock = source.match(/const faqData = \[([\s\S]*?)\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');

  const questions = Array.from(faqDataBlock[1].matchAll(/question:\s*'([^']+)'/gu)).map((m) => m[1]);
  assert.ok(questions.length >= 4, 'expected at least 4 FAQ questions');
  assert.deepEqual(questions.slice(0, 4), requiredQuestions);
});
