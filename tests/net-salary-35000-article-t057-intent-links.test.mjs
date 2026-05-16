import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'เงินเดือน-35000-รับเท่าไร',
  'index.astro',
);

const source = fs.readFileSync(filePath, 'utf8');
const clusterId = 'net-salary-35000-article-intent-cluster';
const requiredLinks = [
  '/คำนวณเงินเดือนสุทธิ/',
  '/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/',
];

test('T057: intent cluster exists exactly once', () => {
  const idMatches = source.match(new RegExp(`id="${clusterId}"`, 'g')) ?? [];
  assert.equal(idMatches.length, 1, `Expected exactly one ${clusterId} section`);
});

test('T057: intent cluster appears above first ArticleCalculatorCTA', () => {
  const clusterPos = source.indexOf(`id="${clusterId}"`);
  const ctaPos = source.indexOf('<ArticleCalculatorCTA');
  assert.notEqual(clusterPos, -1, 'Cluster section not found');
  assert.notEqual(ctaPos, -1, 'ArticleCalculatorCTA not found');
  assert.ok(clusterPos < ctaPos, 'Intent cluster must appear before first ArticleCalculatorCTA');
});

test('T057: intent cluster contains required internal links', () => {
  const sectionRegex = new RegExp(`<section[^>]*id="${clusterId}"[\\s\\S]*?<\\/section>`, 'm');
  const clusterSection = source.match(sectionRegex)?.[0] ?? '';
  assert.ok(clusterSection.length > 0, 'Cluster section content not found');
  for (const link of requiredLinks) {
    assert.ok(clusterSection.includes(`href="${link}"`), `Missing required link ${link} in cluster`);
  }
});

test('T057: faqData mapping remains intact for JSON-LD parity', () => {
  assert.match(source, /faqData=\{faqData\}/, 'BlogPostLayout must receive faqData prop');
});
