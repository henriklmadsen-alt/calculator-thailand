import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/รีไฟแนนซ์บ้าน-vs-โปะบ้าน-แบบไหนคุ้ม-2569/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  'รีไฟแนนซ์บ้านกับโปะบ้าน แบบไหนช่วยลดดอกเบี้ยรวมได้มากกว่า?',
  'โปะบ้านทุกเดือนกับโปะเป็นก้อน ช่วยลดดอกเบี้ยต่างกันแค่ไหน?',
  'รีไฟแนนซ์และโปะบ้านพร้อมกันได้ไหม เพื่อให้ผ่อนหมดเร็วขึ้น?',
  'รีไฟแนนซ์บ้านมีค่าใช้จ่ายอะไรบ้าง และต้องคุ้มกี่ปีถึงควรทำ?',
];

test('T020: home-loan article FAQ exists in visible page content', () => {
  assert.match(source, /faqData=\{faqData\}/u);
  assert.match(source, /<h2>คำถามที่พบบ่อย \(FAQ\)<\/h2>/u);
});

test('T020: required high-intent home-loan FAQ questions appear in visible content', () => {
  for (const question of requiredQuestions) {
    assert.ok(source.includes(question), `missing visible FAQ intent: ${question}`);
  }
});

test('T020: FAQ JSON-LD is mapped from faqData via BlogPostLayout', () => {
  assert.match(source, /const faqData = \[/u);
  assert.match(source, /<BlogPostLayout[\s\S]*faqData=\{faqData\}/u);
});

test('T020: first 4 faqData entries exactly match required intent questions', () => {
  const faqDataBlock = source.match(/const faqData = \[([\s\S]*?)\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');

  const questions = Array.from(faqDataBlock[1].matchAll(/question:\s*'([^']+)'/gu)).map((m) => m[1]);
  assert.ok(questions.length >= 4, 'expected at least 4 FAQ questions');
  assert.deepEqual(questions.slice(0, 4), requiredQuestions);
});
