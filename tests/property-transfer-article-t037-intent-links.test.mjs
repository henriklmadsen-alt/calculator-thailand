import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

const clusterId = 'property-transfer-secondary-intent-cluster';
const requiredLink1 = '/คำนวณค่าธรรมเนียมโอนบ้าน/';
const requiredLink2 = '/บทความ/คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง/';

test('T037: property-transfer secondary intent cluster exists', () => {
  assert.match(source, new RegExp(`<section id="${clusterId}"`, 'u'));
});

test('T037: cluster appears above first ArticleCalculatorCTA', () => {
  const sectionIndex = source.indexOf(`<section id="${clusterId}"`);
  const firstCtaIndex = source.indexOf('<ArticleCalculatorCTA');

  assert.ok(sectionIndex !== -1, 'secondary intent cluster section not found');
  assert.ok(firstCtaIndex !== -1, 'first ArticleCalculatorCTA not found');
  assert.ok(sectionIndex < firstCtaIndex, 'secondary intent cluster must appear above first CTA');
});

test('T037: cluster contains both required links', () => {
  const sectionMatch = source.match(
    new RegExp(`<section id="${clusterId}"[\\s\\S]*?<\\/section>`, 'u'),
  );
  assert.ok(sectionMatch, 'secondary intent cluster section not found');

  const section = sectionMatch[0];
  assert.match(section, new RegExp(`href="${requiredLink1}"`, 'u'));
  assert.match(section, new RegExp(`href="${requiredLink2}"`, 'u'));
});

test('T037: cluster id is unique', () => {
  const matches = source.match(new RegExp(`id="${clusterId}"`, 'gu')) ?? [];
  assert.equal(matches.length, 1, 'secondary intent cluster id must appear exactly once');
});

test('T037: faqData wiring remains intact', () => {
  assert.match(source, /faqData=\{faqData\}/u);
});
