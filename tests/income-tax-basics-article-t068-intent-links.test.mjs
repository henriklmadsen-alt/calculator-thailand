import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/index.astro';
assert.ok(fs.existsSync(filePath), 'income-tax basics article page not found');

const source = fs.readFileSync(filePath, 'utf8');
const clusterId = 'income-tax-basics-article-intent-cluster';
const requiredLinks = [
  '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
  '/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/',
];

test('T068: intent cluster id exists exactly once', () => {
  const idMatches = source.match(new RegExp(`id="${clusterId}"`, 'g')) ?? [];
  assert.equal(idMatches.length, 1, `Expected exactly one ${clusterId} section`);
});

test('T068: intent cluster appears above first ArticleCalculatorCTA', () => {
  const sectionIndex = source.indexOf(`id="${clusterId}"`);
  const firstCtaIndex = source.indexOf('<ArticleCalculatorCTA');

  assert.ok(sectionIndex !== -1, 'intent cluster section not found');
  assert.ok(firstCtaIndex !== -1, 'first ArticleCalculatorCTA not found');
  assert.ok(sectionIndex < firstCtaIndex, 'intent cluster must appear above first ArticleCalculatorCTA');
});

test('T068: intent cluster contains both required internal links', () => {
  const sectionMatch = source.match(new RegExp(`<section[^>]*id="${clusterId}"[\\s\\S]*?<\\/section>`, 'u'));
  assert.ok(sectionMatch, 'intent cluster section missing');
  const section = sectionMatch[0];

  for (const link of requiredLinks) {
    assert.match(section, new RegExp(`href="${link}"`, 'u'), `missing required link ${link}`);
  }
});

test('T068: faqData wiring remains intact', () => {
  assert.match(source, /faqData=\{faqData\}/u);
});
