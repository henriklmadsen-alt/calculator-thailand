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

function findNetSalaryPage() {
  const files = walkIndexFiles('src/pages');
  return files.find((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    return (
      source.includes('id="net-salary-intent-cluster"') &&
      source.includes('id="gross-salary"') &&
      source.includes('FAQAccordion faqData={faqData}')
    );
  });
}

const filePath = findNetSalaryPage();
assert.ok(filePath, 'net-salary calculator page not found');
const source = fs.readFileSync(filePath, 'utf8');

const requiredQuestions = [
  /\u0e40\u0e07\u0e34\u0e19\u0e40\u0e14\u0e37\u0e2d\u0e19\u0e40\u0e17\u0e48\u0e32\u0e44\u0e23\u0e16\u0e36\u0e07\u0e08\u0e30\u0e23\u0e39\u0e49\u0e40\u0e07\u0e34\u0e19\u0e2a\u0e38\u0e17\u0e18\u0e34/u, // เงินเดือนเท่าไรถึงจะรู้เงินสุทธิ
  /\u0e42\u0e1a\u0e19\u0e31\u0e2a\u0e2b\u0e23\u0e37\u0e2d\u0e42\u0e2d\u0e17\u0e35/u, // โบนัสหรือโอที
  /\u0e02\u0e36\u0e49\u0e19\u0e40\u0e07\u0e34\u0e19\u0e40\u0e14\u0e37\u0e2d\u0e19/u, // ขึ้นเงินเดือน
  /\u0e40\u0e07\u0e34\u0e19\u0e2a\u0e38\u0e17\u0e18\u0e34\u0e40\u0e1b\u0e49\u0e32\u0e2b\u0e21\u0e32\u0e22/u, // เงินสุทธิเป้าหมาย
];

test('T010: net-salary FAQ section exists in visible page content', () => {
  assert.match(source, /<FAQAccordion faqData=\{faqData\} title="[^"]+" \/>/u);
});

test('T010: net-salary visible FAQ includes 4 required high-intent questions', () => {
  for (const pattern of requiredQuestions) {
    assert.match(source, pattern);
  }
});

test('T010: net-salary FAQ JSON-LD exists and maps directly from faqData', () => {
  assert.match(source, /const jsonLdFaq = \{/u);
  assert.match(source, /'@type': 'FAQPage'/u);
  assert.match(source, /mainEntity: faqData\.map\(\(faq\) => \(\{/u);
  assert.match(source, /acceptedAnswer:/u);
});

test('T010: required FAQ intent questions are present inside faqData for JSON-LD parity', () => {
  const faqDataBlock = source.match(/const faqData = \[[\s\S]*?\];/u);
  assert.ok(faqDataBlock, 'faqData block missing');

  for (const pattern of requiredQuestions) {
    assert.match(faqDataBlock[0], pattern);
  }
});
