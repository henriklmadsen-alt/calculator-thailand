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

function findLoanPaymentCalculatorPage() {
  const indexFiles = walkIndexFiles('src/pages');
  return indexFiles.find((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    return source.includes('id="loan-payment-intent-cluster"') && source.includes('id="loan-form"');
  });
}

const filePath = findLoanPaymentCalculatorPage();
assert.ok(filePath, 'loan-payment calculator page not found');
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  /ค่างวดเงินกู้เท่าไรต่อเดือน 2569\?/u,
  /ผ่อน 48\/60\/72\/84 งวด ต่างกันเท่าไร\?/u,
  /ดาวน์ 10% 20% 30% ค่างวดต่างกันแค่ไหน\?/u,
  /ดอกเบี้ยต่างกัน 0\.5% กระทบค่างวดเท่าไหร่\?/u,
];

test('T012: loan-payment FAQ section exists in visible page content', () => {
  assert.match(source, /<FAQAccordion faqData=\{faqData\} title="[^"]+" \/>/u);
});

test('T012: loan-payment visible FAQ content includes 4 required high-intent questions', () => {
  for (const pattern of requiredQuestions) {
    assert.match(source, pattern);
  }
});

test('T012: loan-payment FAQ JSON-LD exists and maps directly from faqData', () => {
  assert.match(source, /const jsonLdFaq = \{/u);
  assert.match(source, /'@type': 'FAQPage'/u);
  assert.match(source, /mainEntity: faqData\.map\(\(faq\) => \(\{/u);
  assert.match(source, /acceptedAnswer:/u);
});

test('T012: required FAQ intent questions are present in faqData for JSON-LD parity', () => {
  const faqDataBlock = source.match(/const faqData = \[[\s\S]*?\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');

  for (const pattern of requiredQuestions) {
    assert.match(faqDataBlock[0], pattern);
  }
});
