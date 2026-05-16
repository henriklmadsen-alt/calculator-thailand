import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/index.astro';
assert.ok(fs.existsSync(filePath), 'income-tax main article page not found');

const source = fs.readFileSync(filePath, 'utf8');

const expectedQuestions = [
  'ยื่นภาษีเงินได้ปี 2569 ต้องเตรียมข้อมูลอะไรบ้าง?',
  'คำนวณภาษีเงินได้จากเงินเดือนต้องเริ่มตรงไหน?',
  'ค่าลดหย่อนแบบไหนช่วยลดภาษีได้คุ้มที่สุดในปี 2569?',
  'ควรเลือกหักภาษีรายเดือนเท่าไรเพื่อไม่ต้องจ่ายเพิ่มตอนยื่นจริง?',
];

test('T081: first 4 FAQ intents are present in strict order', () => {
  const questionMatches = [...source.matchAll(/question:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(questionMatches.length >= 4, 'expected at least 4 FAQ questions');
  assert.deepEqual(questionMatches.slice(0, 4), expectedQuestions);
});

test('T081: visible FAQ is rendered from faqData', () => {
  assert.match(source, /\{faqData\.map\(\(faq\) => \(/u);
  assert.match(source, /<summary[^>]*>\s*\{faq\.question\}\s*<\/summary>/u);
  assert.match(source, /\{faq\.answer\}/u);
});

test('T081: FAQ JSON-LD parity wiring remains mapped from faqData', () => {
  assert.match(source, /faqData=\{faqData\}/u);
});
