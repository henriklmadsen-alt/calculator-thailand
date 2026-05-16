import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/index.astro';
assert.ok(fs.existsSync(filePath), 'net-salary core article page not found');

const source = fs.readFileSync(filePath, 'utf8');
const clusterId = 'net-salary-core-article-intent-cluster';
const requiredLinks = [
  '/คำนวณเงินเดือนสุทธิ/',
  '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
];

test('T062: intent cluster id exists exactly once', () => {
  const idMatches = source.match(new RegExp(`id="${clusterId}"`, 'g')) ?? [];
  assert.equal(idMatches.length, 1, `Expected exactly one ${clusterId} section`);
});

test('T062: intent cluster appears above first CTA block', () => {
  const sectionIndex = source.indexOf(`id="${clusterId}"`);
  const firstCtaIndex = source.indexOf('bg-primary-50');

  assert.ok(sectionIndex !== -1, 'intent cluster section not found');
  assert.ok(firstCtaIndex !== -1, 'first CTA block marker not found');
  assert.ok(sectionIndex < firstCtaIndex, 'intent cluster must appear above first CTA block');
});

test('T062: intent cluster contains both required internal links', () => {
  const sectionMatch = source.match(new RegExp(`<section[^>]*id="${clusterId}"[\\s\\S]*?<\\/section>`, 'u'));
  assert.ok(sectionMatch, 'intent cluster section missing');
  const section = sectionMatch[0];

  for (const link of requiredLinks) {
    assert.match(section, new RegExp(`href="${link}"`, 'u'), `missing required link ${link}`);
  }
});

test('T062: faqData wiring remains intact', () => {
  assert.match(source, /faqData=\{faqData\}/u);
});
