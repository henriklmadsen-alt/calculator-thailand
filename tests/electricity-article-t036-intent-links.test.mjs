import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/บ้านใช้ไฟ-300-หน่วย-ค่าไฟเท่าไร/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

const clusterId = 'electricity-article-secondary-intent-cluster';
const requiredLink1 = '/คำนวณค่าไฟฟ้า/';
const requiredLink2 = '/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/';

test('T036: electricity secondary intent cluster exists', () => {
  assert.match(source, new RegExp(`<section id="${clusterId}"`, 'u'));
});

test('T036: cluster appears above first ArticleCalculatorCTA', () => {
  const sectionIndex = source.indexOf(`<section id="${clusterId}"`);
  const firstCtaIndex = source.indexOf('<ArticleCalculatorCTA');

  assert.ok(sectionIndex !== -1, 'secondary intent cluster section not found');
  assert.ok(firstCtaIndex !== -1, 'first ArticleCalculatorCTA not found');
  assert.ok(sectionIndex < firstCtaIndex, 'secondary intent cluster must appear above first CTA');
});

test('T036: cluster contains both required links', () => {
  const sectionMatch = source.match(
    new RegExp(`<section id="${clusterId}"[\\s\\S]*?<\\/section>`, 'u'),
  );
  assert.ok(sectionMatch, 'secondary intent cluster section not found');

  const section = sectionMatch[0];
  assert.match(section, new RegExp(`href="${requiredLink1}"`, 'u'));
  assert.match(section, new RegExp(`href="${requiredLink2}"`, 'u'));
});

test('T036: cluster id is unique', () => {
  const matches = source.match(new RegExp(`id="${clusterId}"`, 'gu')) ?? [];
  assert.equal(matches.length, 1, 'secondary intent cluster id must appear exactly once');
});

test('T036: faqData wiring remains intact', () => {
  assert.match(source, /faqData=\{faqData\}/u);
});
