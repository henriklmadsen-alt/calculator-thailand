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

function findElectricityArticlePage() {
  const files = walkIndexFiles('src/pages');
  return files.find((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    return (
      source.includes('id="electricity-article-intent-cluster"') &&
      source.includes('ArticleCalculatorCTA') &&
      source.includes('faqData={faqData}')
    );
  });
}

const filePath = findElectricityArticlePage();
assert.ok(filePath, 'electricity supporting article page not found');
const source = fs.readFileSync(filePath, 'utf8');

const clusterId = 'electricity-article-intent-cluster';
const link1 = '/\u0e04\u0e33\u0e19\u0e27\u0e13\u0e04\u0e48\u0e32\u0e44\u0e1f\u0e1f\u0e49\u0e32/';
const link2 = '/\u0e1a\u0e17\u0e04\u0e27\u0e32\u0e21/\u0e04\u0e48\u0e32\u0e44\u0e1f\u0e1f\u0e49\u0e32-mea-\u0e01\u0e31\u0e1a-pea/';

test('T029: electricity article intent cluster exists', () => {
  assert.match(source, new RegExp(`<section id="${clusterId}"`, 'u'));
});

test('T029: intent cluster contains both required links', () => {
  const sectionMatch = source.match(new RegExp(`<section id="${clusterId}"[\\s\\S]*?<\\/section>`, 'u'));
  assert.ok(sectionMatch, 'intent cluster section missing');
  const section = sectionMatch[0];

  assert.match(section, new RegExp(`href="${link1}"`, 'u'));
  assert.match(section, new RegExp(`href="${link2}"`, 'u'));
});

test('T029: intent cluster appears above first calculator CTA block', () => {
  const sectionIndex = source.indexOf(`<section id="${clusterId}"`);
  const firstCtaIndex = source.indexOf('<ArticleCalculatorCTA');

  assert.ok(sectionIndex !== -1, 'intent cluster section not found');
  assert.ok(firstCtaIndex !== -1, 'first ArticleCalculatorCTA not found');
  assert.ok(sectionIndex < firstCtaIndex, 'intent cluster must appear above first calculator CTA block');
});

test('T029: faqData wiring remains intact', () => {
  assert.match(source, /faqData=\{faqData\}/u);
});
