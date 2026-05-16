import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/เงินเดือนสุทธิ-คืออะไร/index.astro';
assert.ok(fs.existsSync(filePath), 'net-salary basics article page not found');
const source = fs.readFileSync(filePath, 'utf8');

const clusterId = 'net-salary-basics-intent-cluster';
const link1 = '/คำนวณเงินเดือนสุทธิ/';
const link2 = '/คำนวณภาษีเงินได้บุคคลธรรมดา/';

test('T032: net-salary basics intent cluster exists', () => {
  assert.match(source, new RegExp(`<section id="${clusterId}"`, 'u'));
});

test('T032: intent cluster contains both required links', () => {
  const sectionMatch = source.match(new RegExp(`<section id="${clusterId}"[\\s\\S]*?<\\/section>`, 'u'));
  assert.ok(sectionMatch, 'intent cluster section missing');
  const section = sectionMatch[0];

  assert.match(section, new RegExp(`href="${link1}"`, 'u'));
  assert.match(section, new RegExp(`href="${link2}"`, 'u'));
});

test('T032: intent cluster appears above first article CTA', () => {
  const sectionIndex = source.indexOf(`<section id="${clusterId}"`);
  const firstCtaIndex = source.indexOf('<ArticleCalculatorCTA');

  assert.ok(sectionIndex !== -1, 'intent cluster section not found');
  assert.ok(firstCtaIndex !== -1, 'first ArticleCalculatorCTA not found');
  assert.ok(sectionIndex < firstCtaIndex, 'intent cluster must appear above first ArticleCalculatorCTA');
});

test('T032: faqData wiring remains intact', () => {
  assert.match(source, /faqData=\{faqData\}/u);
});
