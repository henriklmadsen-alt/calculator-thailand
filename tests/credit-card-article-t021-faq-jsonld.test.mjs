import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  'จ่ายขั้นต่ำบัตรเครดิตทุกเดือน ทำไมหนี้ลดช้า?',
  'หนี้บัตรเครดิต 50,000 บาท จ่ายขั้นต่ำเท่าไร และหมดหนี้เมื่อไร?',
  'โปะบัตรเครดิตแบบไหนก่อน ระหว่างดอกเบี้ยสูงกับยอดเล็ก?',
  'รวมหนี้บัตรเครดิตหลายใบ ช่วยลดดอกเบี้ยและปิดหนี้เร็วขึ้นไหม?',
];

test('T021: credit-card article FAQ exists in visible page content', () => {
  assert.match(source, /faqData=\{faqData\}/u);
  assert.match(source, /<h2>คำถามที่พบบ่อย \(FAQ\)<\/h2>/u);
});

test('T021: required high-intent credit-card FAQ questions appear in visible content', () => {
  for (const question of requiredQuestions) {
    assert.ok(source.includes(question), `missing visible FAQ intent: ${question}`);
  }
});

test('T021: FAQ JSON-LD is mapped from faqData via BlogPostLayout', () => {
  assert.match(source, /const faqData = \[/u);
  assert.match(source, /<BlogPostLayout[\s\S]*faqData=\{faqData\}/u);
});

test('T021: first 4 faqData entries exactly match required intent questions', () => {
  const faqDataBlock = source.match(/const faqData = \[([\s\S]*?)\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');

  const questions = Array.from(faqDataBlock[1].matchAll(/question:\s*'([^']+)'/gu)).map((m) => m[1]);
  assert.ok(questions.length >= 4, 'expected at least 4 FAQ questions');
  assert.deepEqual(questions.slice(0, 4), requiredQuestions);
});
