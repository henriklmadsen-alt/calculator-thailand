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

function findCarLoanArticlePage() {
  const files = walkIndexFiles('src/pages');
  const marker = /\u0e1c\u0e48\u0e2d\u0e19\u0e23\u0e16 700,000 \u0e1a\u0e32\u0e17 5 \u0e1b\u0e35 \u0e40\u0e14\u0e37\u0e2d\u0e19\u0e25\u0e30\u0e40\u0e17\u0e48\u0e32\u0e44\u0e23/u;
  return files.find((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    return source.includes('ArticleCalculatorCTA') && source.includes('faqData={faqData}') && marker.test(source);
  });
}

const filePath = findCarLoanArticlePage();
assert.ok(filePath, 'car-loan supporting article page not found');
const source = fs.readFileSync(filePath, 'utf8');

const clusterId = 'car-loan-article-intent-cluster';
const link1 = '/\u0e04\u0e33\u0e19\u0e27\u0e13\u0e1c\u0e48\u0e2d\u0e19\u0e23\u0e16/';
const link2 = '/\u0e1a\u0e17\u0e04\u0e27\u0e32\u0e21/\u0e27\u0e34\u0e18\u0e35\u0e04\u0e33\u0e19\u0e27\u0e13\u0e1c\u0e48\u0e2d\u0e19\u0e23\u0e16-\u0e2a\u0e39\u0e15\u0e23\u0e41\u0e25\u0e30\u0e40\u0e1b\u0e23\u0e35\u0e22\u0e1a\u0e40\u0e17\u0e35\u0e22\u0e1a/';

test('T026: car-loan article intent cluster exists', () => {
  assert.match(source, new RegExp(`<section id="${clusterId}"`, 'u'));
});

test('T026: intent cluster contains both required links', () => {
  const sectionMatch = source.match(new RegExp(`<section id="${clusterId}"[\\s\\S]*?<\\/section>`, 'u'));
  assert.ok(sectionMatch, 'intent cluster section missing');
  const section = sectionMatch[0];

  assert.match(section, new RegExp(`href="${link1}"`, 'u'));
  assert.match(section, new RegExp(`href="${link2}"`, 'u'));
});

test('T026: intent cluster appears above first calculator CTA block', () => {
  const sectionIndex = source.indexOf(`<section id="${clusterId}"`);
  const firstCtaIndex = source.indexOf('<ArticleCalculatorCTA');

  assert.ok(sectionIndex !== -1, 'intent cluster section not found');
  assert.ok(firstCtaIndex !== -1, 'first ArticleCalculatorCTA not found');
  assert.ok(sectionIndex < firstCtaIndex, 'intent cluster must appear above first calculator CTA block');
});

test('T026: faqData wiring remains intact', () => {
  assert.match(source, /faqData=\{faqData\}/u);
});