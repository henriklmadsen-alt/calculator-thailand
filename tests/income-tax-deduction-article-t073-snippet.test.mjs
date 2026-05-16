import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด',
  'index.astro',
);

const source = fs.readFileSync(filePath, 'utf8');

const titleMatch = source.match(/const title = '([^']+)'/);
const descriptionMatch = source.match(/const description = '([^']+)'/);
const h1Match = source.match(/<h1[^>]*>\s*([\s\S]*?)\s*<\/h1>/);

const title = titleMatch?.[1] ?? '';
const description = descriptionMatch?.[1] ?? '';
const h1 = (h1Match?.[1] ?? '').replace(/\s+/g, ' ').trim();

test('T073: title includes all required deduction-intent terms', () => {
  assert.match(title, /2569/u);
  assert.match(title, /ลดหย่อนภาษี/u);
  assert.match(title, /มีอะไรบ้าง/u);
  assert.match(title, /ประหยัดภาษีอย่างถูกกฎหมาย/u);
});

test('T073: meta description includes same intent set', () => {
  assert.match(description, /2569/u);
  assert.match(description, /ลดหย่อนภาษี/u);
  assert.match(description, /มีอะไรบ้าง/u);
  assert.match(description, /ประหยัดภาษีอย่างถูกกฎหมาย/u);
});

test('T073: H1 aligns with same intent set', () => {
  assert.match(h1, /2569/u);
  assert.match(h1, /ลดหย่อนภาษี/u);
  assert.match(h1, /มีอะไรบ้าง/u);
  assert.match(h1, /ประหยัดภาษีอย่างถูกกฎหมาย/u);
});
