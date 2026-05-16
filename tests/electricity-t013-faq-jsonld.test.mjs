import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณค่าไฟฟ้า/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  /ค่าไฟฟ้า 2569 คิดอย่างไรจากหน่วยที่ใช้จริง\?/u,
  /Ft ล่าสุดเท่าไร และกระทบยอดบิลแค่ไหน\?/u,
  /บ้านใช้ไฟ 300 หน่วย ค่าไฟประมาณเท่าไร\?/u,
  /PEA กับ MEA คิดค่าไฟต่างกันหรือไม่\?/u,
];

test('T013: electricity FAQ section exists in visible page content', () => {
  assert.match(source, /<FAQAccordion faqData=\{faqData\} title="[^"]+" \/>/u);
});

test('T013: electricity visible FAQ content includes 4 required high-intent questions', () => {
  for (const pattern of requiredQuestions) {
    assert.match(source, pattern);
  }
});

test('T013: electricity FAQ JSON-LD exists and maps directly from faqData', () => {
  assert.match(source, /const jsonLdFaq = \{/u);
  assert.match(source, /'@type': 'FAQPage'/u);
  assert.match(source, /mainEntity: faqData\.map\(\(faq\) => \(\{/u);
  assert.match(source, /acceptedAnswer:/u);
});

test('T013: required FAQ intent questions are present in faqData for JSON-LD parity', () => {
  const faqDataBlock = source.match(/const faqData = \[[\s\S]*?\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');

  for (const pattern of requiredQuestions) {
    assert.match(faqDataBlock[0], pattern);
  }
});
