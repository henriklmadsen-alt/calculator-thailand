import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณผ่อนกู้/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

test('loan-payment page ships explicit 2569 snippet for monthly installment, total interest, and term-rate compare intent', () => {
  assert.match(source, /คำนวณผ่อนกู้.*2569/u);
  assert.match(source, /ค่างวดรายเดือน/u);
  assert.match(source, /ดอกเบี้ยรวม/u);
  assert.match(source, /เทียบ(ดอกเบี้ย|ระยะเวลา)/u);
});

test('loan-payment page has above-fold loan-payment intent cluster section', () => {
  assert.match(source, /id="loan-payment-intent-cluster"/u);
  assert.match(source, /คำถามที่คนค้นหาก่อนคำนวณผ่อนกู้/u);
  assert.match(source, /ค่างวดเงินกู้เท่าไร/u);
  assert.match(source, /ดอกเบี้ยรวม/u);
  assert.match(source, /เทียบดอกเบี้ยกับระยะเวลาผ่อน/u);
});

test('loan-payment intent block includes required top cluster links', () => {
  const intentBlockMatch = source.match(/<section id="loan-payment-intent-cluster"[\s\S]*?<\/section>/u);
  assert.ok(intentBlockMatch, 'loan-payment intent block is missing');
  const intentBlock = intentBlockMatch[0];
  assert.match(intentBlock, /href="\/คำนวณผ่อนบ้าน\/"/u);
  assert.match(intentBlock, /href="\/คำนวณผ่อนรถ\/"/u);
});

test('loan-payment page keeps FAQ accordion and FAQ JSON-LD script', () => {
  assert.match(source, /<FAQAccordion\s+faqData=\{faqData\}\s+title="คำถามที่พบบ่อย"\s*\/>/u);
  assert.match(source, /set:html=\{JSON\.stringify\(jsonLdFaq\)\}/u);
});
