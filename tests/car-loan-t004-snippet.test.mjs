import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณผ่อนรถ/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

test('T004: car-loan title includes 2569 + down payment + term comparison intent', () => {
  const titleMatch = source.match(/const pageTitle = '([^']+)'/u);
  assert.ok(titleMatch, 'pageTitle is missing');
  const title = titleMatch[1];
  assert.match(title, /2569/u);
  assert.match(title, /ดาวน์/u);
  assert.match(title, /48\/60\/72\/84/u);
});

test('T004: car-loan meta includes 2569 + term/rate compare intent', () => {
  const descriptionMatch = source.match(/const pageDescription = '([^']+)'/u);
  assert.ok(descriptionMatch, 'pageDescription is missing');
  const description = descriptionMatch[1];
  assert.match(description, /2569/u);
  assert.match(description, /ดาวน์/u);
  assert.match(description, /เทียบ/u);
  assert.match(description, /ดอกเบี้ย/u);
  assert.match(description, /48\/60\/72\/84/u);
});

test('T004: car-loan H1 aligns with down payment + term/rate comparison intent', () => {
  const h1Match = source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/u);
  assert.ok(h1Match, 'H1 is missing');
  const h1 = h1Match[1];
  assert.match(h1, /ผ่อนรถ/u);
  assert.match(h1, /ดาวน์/u);
  assert.match(h1, /ดอกเบี้ย/u);
  assert.match(h1, /48\/60\/72\/84/u);
});
