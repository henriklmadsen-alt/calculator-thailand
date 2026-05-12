import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณค่าโอที/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

test('overtime page ships dual-intent snippet for OT 2569 and legal multipliers', () => {
  assert.match(source, /คำนวณค่าโอที.*2569/u);
  assert.match(source, /1\.5.*2.*3/u);
  assert.match(source, /ตามกฎหมายแรงงานไทย/u);
});

test('overtime page includes above-fold intent cluster section with query cues', () => {
  assert.match(source, /id="overtime-intent-cluster"/u);
  assert.match(source, /คำถามที่คนค้นหาก่อนคำนวณค่าโอที/u);
  assert.match(source, /โอที 1\.5 เท่า คิดยังไง/u);
  assert.match(source, /โอทีวันหยุด 2 เท่า 3 เท่า/u);
});

test('overtime intent block has article and net-salary internal links', () => {
  const intentBlockMatch = source.match(/<section id="overtime-intent-cluster"[\s\S]*?<\/section>/u);
  assert.ok(intentBlockMatch, 'overtime intent block is missing');
  const intentBlock = intentBlockMatch[0];
  assert.match(intentBlock, /href="\/บทความ\/คำนวณค่าโอที-2569-กฎหมายแรงงาน\/"/u);
  assert.match(intentBlock, /href="\/คำนวณเงินเดือนสุทธิ\/"/u);
});

test('overtime page keeps FAQ accordion and FAQ JSON-LD script', () => {
  assert.match(source, /<FAQAccordion\s+faqData=\{faqData\}\s+title="คำถามที่พบบ่อย"\s*\/>/u);
  assert.match(source, /set:html=\{JSON\.stringify\(jsonLdFaq\)\}/u);
});
