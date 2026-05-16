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
    if (entry.isFile() && entry.name === 'index.astro') out.push(fullPath);
  }
  return out;
}

function findPropertyTransferArticlePage() {
  const files = walkIndexFiles('src/pages');
  return files.find((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    return (
      source.includes('/บทความ/คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง/') &&
      source.includes('ArticleCalculatorCTA') &&
      source.includes('faqData={faqData}')
    );
  });
}

const filePath = findPropertyTransferArticlePage();
assert.ok(filePath, 'property-transfer supporting article page not found');
const source = fs.readFileSync(filePath, 'utf8');

const clusterId = 'property-transfer-article-intent-cluster';
const link1 = '/คำนวณค่าธรรมเนียมโอนบ้าน/';
const link2 = '/คำนวณผ่อนบ้าน/';

test('T030: property-transfer article intent cluster exists', () => {
  assert.match(source, new RegExp(`<section id="${clusterId}"`, 'u'));
});

test('T030: intent cluster contains both required links', () => {
  const sectionMatch = source.match(new RegExp(`<section id="${clusterId}"[\\s\\S]*?<\\/section>`, 'u'));
  assert.ok(sectionMatch, 'intent cluster section missing');
  const section = sectionMatch[0];

  assert.match(section, new RegExp(`href="${link1}"`, 'u'));
  assert.match(section, new RegExp(`href="${link2}"`, 'u'));
});

test('T030: intent cluster appears above first calculator CTA block', () => {
  const sectionIndex = source.indexOf(`<section id="${clusterId}"`);
  const firstCtaIndex = source.indexOf('<ArticleCalculatorCTA');

  assert.ok(sectionIndex !== -1, 'intent cluster section not found');
  assert.ok(firstCtaIndex !== -1, 'first ArticleCalculatorCTA not found');
  assert.ok(sectionIndex < firstCtaIndex, 'intent cluster must appear above first calculator CTA block');
});

test('T030: faqData wiring remains intact', () => {
  assert.match(source, /faqData=\{faqData\}/u);
});
