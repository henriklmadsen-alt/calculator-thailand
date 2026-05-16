import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร',
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
  /ภาษีครึ่งปี 2569/u,
  /ภ\.ง\.ด\.94/u,
  /ใครบ้างต้องยื่น/u,
  /คำนวณเท่าไร/u,
];

test('T070: title includes all required half-year tax intent terms', () => {
  for (const intent of requiredIntents) {
    assert.match(title, intent);
  }
});

test('T070: meta description includes same intent set', () => {
  for (const intent of requiredIntents) {
    assert.match(description, intent);
  }
});

test('T070: H1 aligns with same intent set', () => {
  for (const intent of requiredIntents) {
    assert.match(h1, intent);
  }
});
