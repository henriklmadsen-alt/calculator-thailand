import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณผ่อนบ้าน/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  /รีไฟแนนซ์บ้านกับโปะบ้านแบบไหนคุ้มกว่ากัน/u,
  /ดอกเบี้ยต่าง 0\.5% กระทบค่างวดบ้านเท่าไร/u,
  /ผ่อนบ้าน 20\/25\/30 ปีต่างกันอย่างไร/u,
  /รายได้เท่าไรถึงจะผ่อนบ้านไหวและไม่ตึงเกินไป/u,
];

test('T008: home-loan FAQ section exists in visible page content', () => {
  assert.match(source, /<FAQAccordion faqData=\{faqData\} title="คำถามที่พบบ่อย" \/>/u);
});

test('T008: home-loan visible FAQ content includes 4 required high-intent questions', () => {
  for (const pattern of requiredQuestions) {
    assert.match(source, pattern);
  }
});

test('T008: home-loan FAQ JSON-LD exists and maps directly from faqData', () => {
  assert.match(source, /const jsonLdFaq = \{/u);
  assert.match(source, /'@type': 'FAQPage'/u);
  assert.match(source, /mainEntity: faqData\.map\(\(faq\) => \(\{/u);
  assert.match(source, /acceptedAnswer:/u);
});

test('T008: required FAQ intent questions are present in faqData for JSON-LD parity', () => {
  const faqDataBlock = source.match(/const faqData = \[[\s\S]*?\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');

  for (const pattern of requiredQuestions) {
    assert.match(faqDataBlock[0], pattern);
  }
});
