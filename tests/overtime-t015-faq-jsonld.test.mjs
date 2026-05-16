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

function findOvertimePage() {
  const files = walkIndexFiles('src/pages');
  return files.find((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    return (
      source.includes('id="ot-form"') &&
      source.includes('FAQAccordion faqData={faqData}') &&
      source.includes('const jsonLdFaq = {')
    );
  });
}

const filePath = findOvertimePage();
assert.ok(filePath, 'overtime calculator page not found');
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  /โอที 1\.5 เท่า คิดค่าแรงต่อชั่วโมงอย่างไร\?/u,
  /โอทีวันหยุด 2 เท่า กับ 3 เท่า ต่างกันอย่างไร\?/u,
  /เงินเดือน 20,000 ทำโอที 10 ชั่วโมง ได้เท่าไหร่\?/u,
  /กฎหมายโอที 2569 กำหนดชั่วโมงสูงสุดเท่าไร\?/u,
];

test('T015: overtime FAQ section exists in visible page content', () => {
  assert.match(source, /<FAQAccordion faqData=\{faqData\} title="[^"]+" \/>/u);
});

test('T015: overtime visible FAQ content includes 4 required high-intent questions', () => {
  for (const pattern of requiredQuestions) {
    assert.match(source, pattern);
  }
});

test('T015: overtime FAQ JSON-LD exists and maps directly from faqData', () => {
  assert.match(source, /const jsonLdFaq = \{/u);
  assert.match(source, /'@type': 'FAQPage'/u);
  assert.match(source, /mainEntity: faqData\.map\(\(faq\) => \(\{/u);
  assert.match(source, /acceptedAnswer:/u);
});

test('T015: required FAQ intent questions are present in faqData for JSON-LD parity', () => {
  const faqDataBlock = source.match(/const faqData = \[[\s\S]*?\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');

  for (const pattern of requiredQuestions) {
    assert.match(faqDataBlock[0], pattern);
  }
});
