import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  'เงินเดือน 40,000 บาท เสียภาษีเท่าไรในปี 2569?',
  'ลดหย่อนภาษีอะไรช่วยประหยัดภาษีได้มากที่สุดในปี 2569?',
  'ยื่นภาษีล่าช้ากว่ากำหนด มีค่าปรับและเงินเพิ่มอย่างไร?',
  'มนุษย์เงินเดือนต้องเตรียมเอกสารอะไรบ้างก่อนยื่นภาษี?',
];

test('T024: income-tax article FAQ exists in visible page content', () => {
  assert.match(source, /faqData=\{faqData\}/u);
  assert.match(source, /<h2>คำถามที่พบบ่อย \(FAQ\)<\/h2>/u);
});

test('T024: required high-intent income-tax FAQ questions appear in visible content', () => {
  for (const question of requiredQuestions) {
    assert.ok(source.includes(question), `missing visible FAQ intent: ${question}`);
  }
});

test('T024: FAQ JSON-LD is mapped from faqData via BlogPostLayout', () => {
  assert.match(source, /const faqData = \[/u);
  assert.match(source, /<BlogPostLayout[\s\S]*faqData=\{faqData\}/u);
});

test('T024: first 4 faqData entries exactly match required intent questions', () => {
  const faqDataBlock = source.match(/const faqData = \[([\s\S]*?)\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');

  const questions = Array.from(faqDataBlock[1].matchAll(/question:\s*'([^']+)'/gu)).map((m) => m[1]);
  assert.ok(questions.length >= 4, 'expected at least 4 FAQ questions');
  assert.deepEqual(questions.slice(0, 4), requiredQuestions);
});
