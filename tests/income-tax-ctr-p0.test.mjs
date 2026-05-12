import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณภาษีเงินได้บุคคลธรรมดา/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

test('income-tax page ships 2569 intent-aligned snippet without misleading wording', () => {
  assert.match(source, /คำนวณภาษีเงินได้บุคคลธรรมดา 2569/u);
  assert.match(source, /ลดหย่อนภาษี/u);
  assert.match(source, /ภาษีเงินเดือน/u);
  assert.doesNotMatch(source, /อบต/u);
});

test('income-tax page has above-fold intent cue cluster section', () => {
  assert.match(source, /id="income-tax-intent-cluster"/u);
  assert.match(source, /คำถามที่คนค้นหาก่อนคำนวณภาษีเงินได้/u);
  assert.match(source, /คำนวณภาษีเงินได้บุคคลธรรมดา 2569/u);
  assert.match(source, /ลดหย่อนภาษีมีอะไรบ้าง/u);
  assert.match(source, /ภาษีเงินเดือน/u);
});

test('income-tax intent cluster includes required article and net-salary links', () => {
  const intentBlockMatch = source.match(/<section id="income-tax-intent-cluster"[\s\S]*?<\/section>/u);
  assert.ok(intentBlockMatch, 'income-tax intent block is missing');
  const intentBlock = intentBlockMatch[0];
  assert.match(intentBlock, /href="\/บทความ\/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน\/"/u);
  assert.match(intentBlock, /href="\/คำนวณเงินเดือนสุทธิ\/"/u);
});

test('income-tax page keeps FAQ accordion and FAQ JSON-LD script', () => {
  assert.match(source, /<FAQAccordion\s+faqData=\{faqData\}\s+title="คำถามที่พบบ่อย"\s*\/>/u);
  assert.match(source, /set:html=\{JSON\.stringify\(jsonLdFaq\)\}/u);
});
