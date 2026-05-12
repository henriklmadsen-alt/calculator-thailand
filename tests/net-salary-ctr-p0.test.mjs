import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณเงินเดือนสุทธิ/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

test('net-salary page ships dual-intent 2569 snippet copy', () => {
  assert.match(source, /เงินเดือนสุทธิหลังหักภาษี\+ประกันสังคม 2569/u);
  assert.match(source, /เงินเดือนรับจริงหลังหักภาษีและประกันสังคม/u);
});

test('net-salary page shows above-fold intent query cue block', () => {
  assert.match(source, /id="net-salary-intent-cluster"/u);
  assert.match(source, /คำถามที่คนค้นหาก่อนคำนวณเงินเดือนสุทธิ/u);
  assert.match(source, /เงินเดือน 30000 หักอะไรบ้าง/u);
  assert.match(source, /เงินเดือน 40000 ได้สุทธิเท่าไหร่/u);
});

test('net-salary page has both cluster links in the top intent block', () => {
  const intentBlockMatch = source.match(
    /<section id="net-salary-intent-cluster"[\s\S]*?<\/section>/u,
  );
  assert.ok(intentBlockMatch, 'intent block is missing');
  const intentBlock = intentBlockMatch[0];
  assert.match(intentBlock, /href="\/คำนวณภาษีเงินได้บุคคลธรรมดา\/"/u);
  assert.match(intentBlock, /href="\/คำนวณประกันสังคม\/"/u);
});
