import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณผ่อนบ้าน/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

test('T007: home-loan title covers monthly payment + refinance vs paydown intent', () => {
  assert.match(source, /const pageTitle = '.*2569.*ค่างวด.*รีไฟแนนซ์.*โปะบ้าน.*';/u);
});

test('T007: home-loan meta description includes refinance-vs-paydown comparison intent', () => {
  assert.match(source, /const pageDescription = '.*ค่างวดรายเดือน.*รีไฟแนนซ์.*โปะบ้าน.*';/u);
});

test('T007: home-loan H1 aligns with refinance-vs-paydown snippet intent', () => {
  const h1Match = source.match(/<h1[^>]*>[\s\S]*?<\/h1>/u);
  assert.ok(h1Match, 'home-loan H1 missing');
  const h1 = h1Match[0];
  assert.match(h1, /2569/u);
  assert.match(h1, /ค่างวด/u);
  assert.match(h1, /รีไฟแนนซ์/u);
  assert.match(h1, /โปะบ้าน/u);
});
