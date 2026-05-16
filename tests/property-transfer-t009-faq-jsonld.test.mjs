import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณค่าธรรมเนียมโอนบ้าน/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  /ค่าโอนบ้านทั้งหมดมีอะไรบ้าง \(ค่าโอน \+ ค่าจดจำนอง \+ ภาษี\)/u,
  /ค่าใช้จ่ายวันโอนบ้าน ใครจ่ายอะไรระหว่างผู้ซื้อกับผู้ขาย/u,
  /ค่าโอนบ้านปี 2569 คิดจากราคาประเมินหรือราคาซื้อขาย/u,
  /บ้านใหม่กับบ้านมือสอง ค่าโอนต่างกันอย่างไร/u,
];

test('T009: property-transfer FAQ section exists in visible page content', () => {
  assert.match(source, /<FAQAccordion faqData=\{faqData\} title="คำถามที่พบบ่อย" \/>/u);
});

test('T009: property-transfer visible FAQ content includes 4 required high-intent questions', () => {
  for (const pattern of requiredQuestions) {
    assert.match(source, pattern);
  }
});

test('T009: property-transfer FAQ JSON-LD exists and maps directly from faqData', () => {
  assert.match(source, /const jsonLdFaq = \{/u);
  assert.match(source, /'@type': 'FAQPage'/u);
  assert.match(source, /mainEntity: faqData\.map\(\(faq\) => \(\{/u);
  assert.match(source, /acceptedAnswer:/u);
});

test('T009: required FAQ intent questions are present in faqData for JSON-LD parity', () => {
  const faqDataBlock = source.match(/const faqData = \[[\s\S]*?\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');

  for (const pattern of requiredQuestions) {
    assert.match(faqDataBlock[0], pattern);
  }
});
