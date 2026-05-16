import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'เงินเดือน-20000-โอที-10-ชั่วโมง',
  'index.astro',
);

const source = fs.readFileSync(filePath, 'utf8');

const titleMatch = source.match(/const title = '([^']+)'/);
const descriptionMatch = source.match(/const description = '([^']+)'/);
const h1Match = source.match(/<h1[^>]*>\s*([\s\S]*?)\s*<\/h1>/);

const title = titleMatch?.[1] ?? '';
const description = descriptionMatch?.[1] ?? '';
const h1 = (h1Match?.[1] ?? '').replace(/\s+/g, ' ').trim();

test('T060: title contains 2569 take-home + OT legal multipliers intent', () => {
  assert.match(title, /2569/u);
  assert.match(title, /สุทธิ/u);
  assert.match(title, /1\.5x\/2x\/3x/u);
});

test('T060: meta description contains deduction + multipliers + monthly payout intent', () => {
  assert.match(description, /2569/u);
  assert.match(description, /สุทธิ/u);
  assert.match(description, /หัก/u);
  assert.match(description, /1\.5x\/2x\/3x/u);
  assert.match(description, /ต่อเดือน/u);
});

test('T060: H1 aligns with same 2569 take-home and multipliers intent', () => {
  assert.match(h1, /2569/u);
  assert.match(h1, /สุทธิ/u);
  assert.match(h1, /1\.5x\/2x\/3x/u);
  assert.match(h1, /ต่อเดือน/u);
});
