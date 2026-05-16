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

const requiredIntents = [
  /ภาษีเงินได้บุคคลธรรมดา 2569/u,
  /ใครต้องยื่นภาษี/u,
  /คำนวณภาษี/u,
];

test('T076: title includes all required intent terms', () => {
  for (const pattern of requiredIntents) {
    assert.match(title, pattern);
  }
});

test('T076: meta description includes same intent set', () => {
  for (const pattern of requiredIntents) {
    assert.match(description, pattern);
  }
});

test('T076: H1 aligns with same intent set', () => {
  for (const pattern of requiredIntents) {
    assert.match(h1, pattern);
  }
});
