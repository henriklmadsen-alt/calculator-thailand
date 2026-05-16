import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function walkIndexFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkIndexFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name === 'index.astro') {
      out.push(fullPath);
    }
  }

  return out;
}

function findIncomeTaxPage() {
  const indexFiles = walkIndexFiles('src/pages');
  return indexFiles.find((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    return (
      source.includes('เงินเดือน 40,000 บาท ต้องเสียภาษีเงินได้เท่าไร 2569') &&
      source.includes('FAQAccordion faqData={faqData}') &&
      source.includes("'@type': 'FAQPage'")
    );
  });
}

const filePath = findIncomeTaxPage();
assert.ok(filePath, 'income-tax calculator page not found');
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  'เงินเดือน 40,000 บาท ต้องเสียภาษีเงินได้เท่าไร 2569',
  'ลดหย่อนภาษีเงินได้บุคคลธรรมดามีอะไรบ้าง 2569',
  'ภาษีเงินเดือน คำนวณแบบขั้นบันไดอย่างไร',
  'มี 7 ขั้นภาษี คำนวณแต่ละขั้นอย่างไร',
];

test('T014: income-tax FAQ section exists in visible page content', () => {
  assert.match(source, /<FAQAccordion faqData=\{faqData\} title="[^"]+" \/>/u);
});

test('T014: income-tax visible FAQ content includes 4 required high-intent questions', () => {
  for (const question of requiredQuestions) {
    assert.ok(source.includes(question), `missing visible FAQ question: ${question}`);
  }
});

test('T014: income-tax FAQ JSON-LD exists and maps directly from faqData', () => {
  assert.match(source, /const jsonLdFaq = \{/u);
  assert.match(source, /'@type': 'FAQPage'/u);
  assert.match(source, /mainEntity: faqData\.map\(\(faq\) => \(\{/u);
  assert.match(source, /acceptedAnswer:/u);
});

test('T014: required FAQ intent questions are present in faqData for JSON-LD parity', () => {
  const faqDataBlock = source.match(/const faqData = \[[\s\S]*?\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');

  for (const question of requiredQuestions) {
    assert.ok(faqDataBlock[0].includes(question), `missing faqData question: ${question}`);
  }
});
