import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/index.astro';
assert.ok(fs.existsSync(filePath), 'income-tax deduction article page not found');
const source = fs.readFileSync(filePath, 'utf8');

const clusterId = 'income-tax-deduction-intent-cluster';
const requiredLink1 = '/คำนวณภาษีเงินได้บุคคลธรรมดา/';
const requiredLink2 = '/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/';

test('T047: income-tax deduction intent cluster exists', () => {
  assert.match(source, new RegExp(`<section id="${clusterId}"`, 'u'));
});

test('T047: cluster appears above first ArticleCalculatorCTA', () => {
  const sectionIndex = source.indexOf(`<section id="${clusterId}"`);
  const firstCtaIndex = source.indexOf('<ArticleCalculatorCTA');

  assert.ok(sectionIndex !== -1, 'deduction intent cluster section not found');
  assert.ok(firstCtaIndex !== -1, 'first ArticleCalculatorCTA not found');
  assert.ok(sectionIndex < firstCtaIndex, 'deduction intent cluster must appear above first ArticleCalculatorCTA');
});

test('T047: cluster contains both required links', () => {
  const sectionMatch = source.match(new RegExp(`<section id="${clusterId}"[\\s\\S]*?<\\/section>`, 'u'));
  assert.ok(sectionMatch, 'deduction intent cluster section not found');

  const section = sectionMatch[0];
  assert.match(section, new RegExp(`href="${requiredLink1}"`, 'u'));
  assert.match(section, new RegExp(`href="${requiredLink2}"`, 'u'));
});

test('T047: cluster id is unique', () => {
  const matches = source.match(new RegExp(`id="${clusterId}"`, 'gu')) ?? [];
  assert.equal(matches.length, 1, 'deduction intent cluster id must appear exactly once');
});

test('T047: faqData wiring remains intact', () => {
  assert.match(source, /faqData=\{faqData\}/u);
});
