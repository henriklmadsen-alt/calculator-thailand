import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  'เงินเดือน 30,000 บาท รับสุทธิเท่าไรหลังหักภาษีและประกันสังคม?',
  'เงินเดือน 50,000 บาท รับสุทธิเท่าไรต่อเดือน?',
  'โบนัสและโอทีต้องคำนวณรวมกับเงินเดือนสุทธิอย่างไร?',
  'แต่งงานแล้ว ภาษีเงินเดือนสุทธิลดลงได้แค่ไหน?',
];

test('T022: net-salary article FAQ exists in visible page content', () => {
  assert.match(source, /faqData=\{faqData\}/u);
  assert.match(source, /<h2>คำถามที่พบบ่อย \(FAQ\)<\/h2>/u);
});

test('T022: required high-intent net-salary FAQ questions appear in visible content', () => {
  for (const question of requiredQuestions) {
    assert.ok(source.includes(question), `missing visible FAQ intent: ${question}`);
  }
});

test('T022: FAQ JSON-LD is mapped from faqData via BlogPostLayout', () => {
  assert.match(source, /const faqData = \[/u);
  assert.match(source, /<BlogPostLayout[\s\S]*faqData=\{faqData\}/u);
});

test('T022: first 4 faqData entries exactly match required intent questions', () => {
  const faqDataBlock = source.match(/const faqData = \[([\s\S]*?)\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');

  const questions = Array.from(faqDataBlock[1].matchAll(/question:\s*'([^']+)'/gu)).map((m) => m[1]);
  assert.ok(questions.length >= 4, 'expected at least 4 FAQ questions');
  assert.deepEqual(questions.slice(0, 4), requiredQuestions);
});
