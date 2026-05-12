import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณผ่อนบ้าน/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

test('home-loan page ships dual-intent snippet for monthly payment and refinance', () => {
  assert.match(source, /ผ่อนบ้านรายเดือน\+เทียบรีไฟแนนซ์ 2569/u);
  assert.match(source, /ค่างวดรายเดือน/u);
  assert.match(source, /รีไฟแนนซ์/u);
});

test('home-loan page has above-fold intent cue section', () => {
  assert.match(source, /id="home-loan-intent-cluster"/u);
  assert.match(source, /คำถามที่คนค้นหาก่อนคำนวณผ่อนบ้าน/u);
  assert.match(source, /ผ่อนบ้าน 3 ล้าน 30 ปี เดือนละเท่าไร/u);
  assert.match(source, /รีไฟแนนซ์บ้านคุ้มไหม/u);
});

test('home-loan top intent block includes refinance article and installment calculator links', () => {
  const intentBlockMatch = source.match(
    /<section id="home-loan-intent-cluster"[\s\S]*?<\/section>/u,
  );
  assert.ok(intentBlockMatch, 'home-loan intent block is missing');
  const intentBlock = intentBlockMatch[0];
  assert.match(intentBlock, /href="\/บทความ\/รีไฟแนนซ์บ้าน-vs-โปะบ้าน-แบบไหนคุ้ม-2569\/"/u);
  assert.match(intentBlock, /href="\/calculator\/loan-payment\/"/u);
});
