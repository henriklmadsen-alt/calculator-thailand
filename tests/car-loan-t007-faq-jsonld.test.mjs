import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณผ่อนรถ/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  /คำนวณค่างวดรถยนต์อย่างไรให้ใกล้เคียงความจริงที่สุด/u,
  /ผ่อน 48\/60\/72\/84 งวดต่างกันอย่างไร/u,
  /ดอกเบี้ยต่าง 0\.5% กระทบค่างวด/u,
  /รีไฟแนนซ์รถช่วยลดค่างวดได้จริงหรือไม่/u,
];

test('T007: car-loan FAQ section exists in visible page content', () => {
  assert.match(source, /<FAQAccordion faqData=\{faqData\} title="คำถามที่พบบ่อย" \/>/u);
});

test('T007: car-loan visible FAQ content includes 4 required high-intent questions', () => {
  for (const pattern of requiredQuestions) {
    assert.match(source, pattern);
  }
});

test('T007: car-loan FAQ JSON-LD exists and maps directly from faqData', () => {
  assert.match(source, /const jsonLdFaq = \{/u);
  assert.match(source, /'@type': 'FAQPage'/u);
  assert.match(source, /mainEntity: faqData\.map\(\(faq\) => \(\{/u);
  assert.match(source, /<script type="application\/ld\+json" set:html=\{JSON\.stringify\(jsonLdFaq\)\} \/>/u);
});

test('T007: required FAQ intent questions are present in faqData for JSON-LD parity', () => {
  for (const pattern of requiredQuestions) {
    assert.match(source, pattern);
  }
  const faqDataBlock = source.match(/const faqData = \[[\s\S]*?\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');
  for (const pattern of requiredQuestions) {
    assert.match(faqDataBlock[0], pattern);
  }
});
