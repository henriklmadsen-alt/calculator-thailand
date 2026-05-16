import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const filePath = 'src/pages/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/index.astro';
assert.ok(fs.existsSync(filePath), 'net-salary supporting article page not found');
const source = fs.readFileSync(filePath, 'utf8');

const clusterId = 'net-salary-article-intent-cluster';
const link1 = '/คำนวณเงินเดือนสุทธิ/';
const link2 = '/คำนวณภาษีเงินได้บุคคลธรรมดา/';

test('T031: net-salary article intent cluster exists', () => {
  assert.match(source, new RegExp(`<section id="${clusterId}"`, 'u'));
});

test('T031: intent cluster contains both required links', () => {
  const sectionMatch = source.match(new RegExp(`<section id="${clusterId}"[\\s\\S]*?<\\/section>`, 'u'));
  assert.ok(sectionMatch, 'intent cluster section missing');
  const section = sectionMatch[0];

  assert.match(section, new RegExp(`href="${link1}"`, 'u'));
  assert.match(section, new RegExp(`href="${link2}"`, 'u'));
});

test('T031: intent cluster appears above first CTA block', () => {
  const sectionIndex = source.indexOf(`<section id="${clusterId}"`);
  const firstCtaIndex = source.indexOf('bg-primary-50');

  assert.ok(sectionIndex !== -1, 'intent cluster section not found');
  assert.ok(firstCtaIndex !== -1, 'first CTA block marker not found');
  assert.ok(sectionIndex < firstCtaIndex, 'intent cluster must appear above first CTA block');
});

test('T031: faqData wiring remains intact', () => {
  assert.match(source, /faqData=\{faqData\}/u);
});
