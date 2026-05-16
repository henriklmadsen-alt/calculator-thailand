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

function findCreditCardCalculatorPage() {
  const indexFiles = walkIndexFiles('src/pages');
  return indexFiles.find((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    return (
      source.includes('supportingArticleHrefOverride') &&
      source.includes('Loan Installment Calculator') &&
      source.includes('FAQAccordion faqData={faqData}')
    );
  });
}

const filePath = findCreditCardCalculatorPage();
assert.ok(filePath, 'credit-card-interest calculator page not found');
const source = fs.readFileSync(filePath, 'utf8');

const titleMatch = source.match(/const pageTitle = pageTitleOverride \|\| '([^']+)'/u);
const descriptionMatch = source.match(/const pageDescription = pageDescriptionOverride \|\| '([^']+)'/u);
const headingMatch = source.match(/const heading = headingOverride \|\| '([^']+)'/u);

assert.ok(titleMatch, 'pageTitle default snippet missing');
assert.ok(descriptionMatch, 'pageDescription default snippet missing');
assert.ok(headingMatch, 'heading default snippet missing');

const title = titleMatch[1];
const description = descriptionMatch[1];
const heading = headingMatch[1];

const interestPattern = /\u0e14\u0e2d\u0e01\u0e40\u0e1a\u0e35\u0e49\u0e22/u; // ดอกเบี้ย
const minimumPattern = /\u0e02\u0e31\u0e49\u0e19\u0e15\u0e48\u0e33/u; // ขั้นต่ำ
const payoffPattern = /\u0e1b\u0e34\u0e14\u0e2b\u0e19\u0e35\u0e49/u; // ปิดหนี้
const yearPattern = /2569/u;

test('T010: title includes dual intent (interest + minimum payment payoff) with 2569', () => {
  assert.match(title, interestPattern);
  assert.match(title, minimumPattern);
  assert.match(title, payoffPattern);
  assert.match(title, yearPattern);
});

test('T010: meta description includes dual intent and 2569', () => {
  assert.match(description, interestPattern);
  assert.match(description, minimumPattern);
  assert.match(description, payoffPattern);
  assert.match(description, yearPattern);
});

test('T010: H1 aligns with dual intent and 2569', () => {
  assert.match(heading, interestPattern);
  assert.match(heading, minimumPattern);
  assert.match(heading, payoffPattern);
  assert.match(heading, yearPattern);
});
