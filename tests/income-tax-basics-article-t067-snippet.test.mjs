import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร',
  'index.astro',
);

const source = fs.readFileSync(filePath, 'utf8');

const titleMatch = source.match(/const title = '([^']+)'/);
const descriptionMatch = source.match(/const description = '([^']+)'/);
const h1Match = source.match(/<h1[^>]*>\s*([\s\S]*?)\s*<\/h1>/);

const title = titleMatch?.[1] ?? '';
const description = descriptionMatch?.[1] ?? '';
const h1 = (h1Match?.[1] ?? '').replace(/\s+/g, ' ').trim();

test('T067: title includes 2569 PIT basics + who must file/pay + correct-calculation intent', () => {
  assert.match(title, /2569/u);
  assert.match(title, /ภาษีเงินได้บุคคลธรรมดา/u);
  assert.match(title, /ใครต้องยื่นและจ่ายภาษี/u);
  assert.match(title, /คำนวณภาษีให้ถูกต้อง/u);
});

test('T067: meta description includes same explicit intent set', () => {
  assert.match(description, /2569/u);
  assert.match(description, /ภาษีเงินได้บุคคลธรรมดา/u);
  assert.match(description, /ใครต้องยื่นและจ่ายภาษี/u);
  assert.match(description, /คำนวณภาษีให้ถูกต้อง/u);
});

test('T067: H1 aligns with same intent set', () => {
  assert.match(h1, /2569/u);
  assert.match(h1, /ภาษีเงินได้บุคคลธรรมดา/u);
  assert.match(h1, /ใครต้องยื่นและจ่ายภาษี/u);
  assert.match(h1, /คำนวณภาษีให้ถูกต้อง/u);
});
