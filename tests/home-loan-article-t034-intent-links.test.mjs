import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/สินเชื่อบ้าน-2569-MLR/index.astro';
assert.ok(fs.existsSync(filePath), 'home-loan secondary article page not found');
const source = fs.readFileSync(filePath, 'utf8');

const clusterId = 'home-loan-secondary-intent-cluster';
const link1 = '/คำนวณผ่อนบ้าน/';
const link2 = '/บทความ/รีไฟแนนซ์บ้าน-vs-โปะบ้าน-แบบไหนคุ้ม-2569/';

test('T034: home-loan secondary intent cluster exists', () => {
  assert.match(source, new RegExp(`<section id="${clusterId}"`, 'u'));
});

test('T034: home-loan secondary intent cluster id is unique', () => {
  const matches = source.match(new RegExp(`<section id="${clusterId}"`, 'gu')) ?? [];
  assert.equal(matches.length, 1, 'home-loan secondary intent cluster must exist exactly once');
});

test('T034: intent cluster contains both required links', () => {
  const sectionMatch = source.match(new RegExp(`<section id="${clusterId}"[\\s\\S]*?<\\/section>`, 'u'));
  assert.ok(sectionMatch, 'intent cluster section missing');
  const section = sectionMatch[0];

  assert.match(section, new RegExp(`href="${link1}"`, 'u'));
  assert.match(section, new RegExp(`href="${link2}"`, 'u'));
});

test('T034: intent cluster appears above first article CTA', () => {
  const sectionIndex = source.indexOf(`<section id="${clusterId}"`);
  const firstCtaIndex = source.indexOf('<ArticleCalculatorCTA');

  assert.ok(sectionIndex !== -1, 'intent cluster section not found');
  assert.ok(firstCtaIndex !== -1, 'first ArticleCalculatorCTA not found');
  assert.ok(sectionIndex < firstCtaIndex, 'intent cluster must appear above first ArticleCalculatorCTA');
});

test('T034: faqData wiring remains intact', () => {
  assert.match(source, /faqData=\{faqData\}/u);
});
