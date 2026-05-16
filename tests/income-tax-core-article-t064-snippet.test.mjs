import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน',
  'index.astro',
);

const source = fs.readFileSync(filePath, 'utf8');

const titleMatch = source.match(/const title = '([^']+)'/);
const descriptionMatch = source.match(/const description = '([^']+)'/);
const h1Match = source.match(/<h1[^>]*>\s*([\s\S]*?)\s*<\/h1>/);

const title = titleMatch?.[1] ?? '';
const description = descriptionMatch?.[1] ?? '';
const h1 = (h1Match?.[1] ?? '').replace(/\s+/g, ' ').trim();

test('T064: title contains explicit 2569 tax-calculation + legal deduction-planning intent', () => {
  assert.match(title, /2569/u);
  assert.match(title, /คำนวณภาษีเงินได้/u);
  assert.match(title, /ลดหย่อนภาษี/u);
  assert.match(title, /ถูกกฎหมาย/u);
});

test('T064: meta description contains same dual intent', () => {
  assert.match(description, /2569/u);
  assert.match(description, /คำนวณภาษีเงินได้/u);
  assert.match(description, /ลดหย่อนภาษี/u);
  assert.match(description, /ถูกกฎหมาย/u);
});

test('T064: H1 aligns with same 2569 calculation + legal deduction intent', () => {
  assert.match(h1, /2569/u);
  assert.match(h1, /คำนวณภาษีเงินได้/u);
  assert.match(h1, /ลดหย่อนภาษี/u);
  assert.match(h1, /ถูกกฎหมาย/u);
});
