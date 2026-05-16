import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/คำนวณค่าโอที-2569-กฎหมายแรงงาน/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

test('T016: overtime article title/meta/H1 include OT 2569 + 1.5x/2x/3x + legal quick-check intent', () => {
  assert.match(source, /const title = '.*โอที.*2569.*1\.5x\/2x\/3x.*กฎหมายแรงงาน.*'/u);
  assert.match(source, /const description = '.*โอที 2569.*1\.5x 2x 3x.*กฎหมายแรงงาน.*เร็ว.*'/u);
  assert.match(source, /<h1[^>]*>[\s\S]*โอที 2569[\s\S]*1\.5x\/2x\/3x[\s\S]*กฎหมายแรงงาน[\s\S]*<\/h1>/u);
});

test('T016: above-fold overtime intent cluster exists with query cues', () => {
  assert.match(source, /<section id="overtime-article-intent-cluster"[\s\S]*?<\/section>/u);
  assert.match(source, /โอที 2569 คิดยังไงให้ตรงกฎหมาย/u);
  assert.match(source, /1\.5x 2x 3x ต่างกันเมื่อไร/u);
  assert.match(source, /เช็กสิทธิค่าล่วงเวลาแบบเร็ว/u);

  const sectionPos = source.indexOf('id="overtime-article-intent-cluster"');
  const firstCtaPos = source.indexOf('<ArticleCalculatorCTA');
  assert.ok(sectionPos > -1, 'intent cluster missing');
  assert.ok(firstCtaPos > -1, 'article CTA missing');
  assert.ok(sectionPos < firstCtaPos, 'intent cluster should be above primary CTA block');
});

test('T016: required internal links are present inside the intent cluster block', () => {
  const sectionMatch = source.match(/<section id="overtime-article-intent-cluster"[\s\S]*?<\/section>/u);
  assert.ok(sectionMatch, 'intent cluster section missing');

  const section = sectionMatch[0];
  assert.match(section, /href="\/คำนวณค่าโอที\/"/u);
  assert.match(section, /href="\/คำนวณเงินเดือนสุทธิ\/"/u);
});

test('T016: FAQ source data and layout parity remain wired', () => {
  assert.match(source, /const faqData = \[/u);
  assert.match(source, /<BlogPostLayout[\s\S]*faqData=\{faqData\}/u);
});
