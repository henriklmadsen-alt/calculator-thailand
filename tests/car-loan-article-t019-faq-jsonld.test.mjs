import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/สินเชื่อรถยนต์-2569/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  'ผ่อนรถ 700,000 บาท 5 ปี เดือนละเท่าไร',
  'ดาวน์รถ 10% 15% 20% ต่างกันอย่างไร',
  'ผ่อนรถยนต์ 48/60/72/84 งวด แบบไหนคุ้มกว่า',
  'ดอกเบี้ย 0.5% ต่างกัน ทำให้ค่างวดต่างเท่าไรต่อเดือน',
];

test('T019: car-loan article FAQ exists in visible page content', () => {
  assert.match(source, /<h2>คำถามที่พบบ่อย \(FAQ\)<\/h2>/u);
  assert.match(source, /faqData=\{faqData\}/u);
});

test('T019: required high-intent car-loan FAQ questions appear in visible content', () => {
  for (const question of requiredQuestions) {
    assert.ok(source.includes(question), `missing visible FAQ intent: ${question}`);
  }
});

test('T019: FAQ JSON-LD is mapped from faqData via BlogPostLayout', () => {
  assert.match(source, /const faqData = \[/u);
  assert.match(source, /<BlogPostLayout[\s\S]*faqData=\{faqData\}/u);
});

test('T019: required FAQ questions are ordered as q1-q4 in source for JSON-LD parity', () => {
  const positions = requiredQuestions.map((question) => source.indexOf(question));
  for (let i = 0; i < positions.length; i += 1) {
    assert.ok(positions[i] > -1, `missing ordered FAQ intent #${i + 1}: ${requiredQuestions[i]}`);
    if (i > 0) {
      assert.ok(
        positions[i] > positions[i - 1],
        `FAQ intent order mismatch between #${i} and #${i + 1}`
      );
    }
  }
});
