import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/เงินเดือน-35000-รับเท่าไร/index.astro';
assert.ok(fs.existsSync(filePath), 'net-salary example article page not found');
const source = fs.readFileSync(filePath, 'utf8');

const clusterId = 'net-salary-example-intent-cluster';
const requiredLink1 = '/คำนวณเงินเดือนสุทธิ/';
const requiredLink2 = '/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/';

test('T042: net-salary example intent cluster exists', () => {
  assert.match(source, new RegExp(`<section id="${clusterId}"`, 'u'));
});

test('T042: cluster appears above first ArticleCalculatorCTA', () => {
  const sectionIndex = source.indexOf(`<section id="${clusterId}"`);
  const firstCtaIndex = source.indexOf('<ArticleCalculatorCTA');

  assert.ok(sectionIndex !== -1, 'example intent cluster section not found');
  assert.ok(firstCtaIndex !== -1, 'first ArticleCalculatorCTA not found');
  assert.ok(sectionIndex < firstCtaIndex, 'example intent cluster must appear above first ArticleCalculatorCTA');
});

test('T042: cluster contains both required links', () => {
  const sectionMatch = source.match(new RegExp(`<section id="${clusterId}"[\\s\\S]*?<\\/section>`, 'u'));
  assert.ok(sectionMatch, 'example intent cluster section not found');

  const section = sectionMatch[0];
  assert.match(section, new RegExp(`href="${requiredLink1}"`, 'u'));
  assert.match(section, new RegExp(`href="${requiredLink2}"`, 'u'));
});

test('T042: cluster id is unique', () => {
  const matches = source.match(new RegExp(`id="${clusterId}"`, 'gu')) ?? [];
  assert.equal(matches.length, 1, 'example intent cluster id must appear exactly once');
});

test('T042: faqData wiring remains intact', () => {
  assert.match(source, /faqData=\{faqData\}/u);
});
