import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี',
  'index.astro',
);

const source = fs.readFileSync(filePath, 'utf8');

const titleMatch = source.match(/const title = '([^']+)'/);
const descriptionMatch = source.match(/const description = '([^']+)'/);
const h1Match = source.match(/<h1[^>]*>\s*([\s\S]*?)\s*<\/h1>/);

const title = titleMatch?.[1] ?? '';
const description = descriptionMatch?.[1] ?? '';
const h1 = (h1Match?.[1] ?? '').replace(/\s+/g, ' ').trim();

test('T061: title contains explicit 2569 + tax/social security + take-home monthly intent', () => {
  assert.match(title, /2569/u);
  assert.match(title, /หลังหักภาษีและประกันสังคม/u);
  assert.match(title, /รับจริงต่อเดือน/u);
});

test('T061: meta description contains same net-salary-after-deductions intent', () => {
  assert.match(description, /2569/u);
  assert.match(description, /สุทธิ/u);
  assert.match(description, /หลังหักภาษีและประกันสังคม/u);
  assert.match(description, /รับจริงต่อเดือน/u);
});

test('T061: H1 aligns with same 2569 take-home after deductions intent', () => {
  assert.match(h1, /2569/u);
  assert.match(h1, /หลังหักภาษีและประกันสังคม/u);
  assert.match(h1, /รับจริงต่อเดือน/u);
});
