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

function findIncomeTaxArticlePage() {
  const files = walkIndexFiles('src/pages');
  const marker = /\u0e40\u0e07\u0e34\u0e19\u0e40\u0e14\u0e37\u0e2d\u0e19 40,000 \u0e1a\u0e32\u0e17 \u0e40\u0e2a\u0e35\u0e22\u0e20\u0e32\u0e29\u0e35\u0e40\u0e17\u0e48\u0e32\u0e44\u0e23\u0e43\u0e19\u0e1b\u0e35 2569\?/u;
  return files.find((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    return source.includes('ArticleCalculatorCTA') && source.includes('faqData={faqData}') && marker.test(source);
  });
}

const filePath = findIncomeTaxArticlePage();
assert.ok(filePath, 'income-tax article page not found');
const source = fs.readFileSync(filePath, 'utf8');

const clusterId = 'income-tax-secondary-intent-cluster';
const requiredLink1 = '/\u0e04\u0e33\u0e19\u0e27\u0e13\u0e20\u0e32\u0e29\u0e35\u0e40\u0e07\u0e34\u0e19\u0e44\u0e14\u0e49\u0e1a\u0e38\u0e04\u0e04\u0e25\u0e18\u0e23\u0e23\u0e21\u0e14\u0e32/';
const requiredLink2 = '/\u0e1a\u0e17\u0e04\u0e27\u0e32\u0e21/\u0e20\u0e32\u0e29\u0e35\u0e40\u0e07\u0e34\u0e19\u0e44\u0e14\u0e49-2569-\u0e04\u0e33\u0e19\u0e27\u0e13-\u0e27\u0e34\u0e18\u0e35\u0e25\u0e14\u0e2b\u0e22\u0e48\u0e2d\u0e19/';

test('T038: income-tax secondary intent cluster exists', () => {
  assert.match(source, new RegExp(`<section id="${clusterId}"`, 'u'));
});

test('T038: cluster appears above first ArticleCalculatorCTA', () => {
  const sectionIndex = source.indexOf(`<section id="${clusterId}"`);
  const firstCtaIndex = source.indexOf('<ArticleCalculatorCTA');

  assert.ok(sectionIndex !== -1, 'secondary intent cluster section not found');
  assert.ok(firstCtaIndex !== -1, 'first ArticleCalculatorCTA not found');
  assert.ok(sectionIndex < firstCtaIndex, 'secondary intent cluster must appear above first CTA');
});

test('T038: cluster contains both required links', () => {
  const sectionMatch = source.match(new RegExp(`<section id="${clusterId}"[\\s\\S]*?<\\/section>`, 'u'));
  assert.ok(sectionMatch, 'secondary intent cluster section not found');

  const section = sectionMatch[0];
  assert.match(section, new RegExp(`href="${requiredLink1}"`, 'u'));
  assert.match(section, new RegExp(`href="${requiredLink2}"`, 'u'));
});

test('T038: cluster id is unique', () => {
  const matches = source.match(new RegExp(`id="${clusterId}"`, 'gu')) ?? [];
  assert.equal(matches.length, 1, 'secondary intent cluster id must appear exactly once');
});

test('T038: faqData wiring remains intact', () => {
  assert.match(source, /faqData=\{faqData\}/u);
});
