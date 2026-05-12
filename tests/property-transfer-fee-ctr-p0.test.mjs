import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณค่าธรรมเนียมโอนบ้าน/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

test('property-transfer-fee page ships full-cost dual intent snippet', () => {
  assert.match(source, /ค่าธรรมเนียมโอนบ้าน\+ค่าใช้จ่ายวันโอน 2569/u);
  assert.match(source, /ค่าโอน \+ ค่าจดจำนอง \+ ภาษี/u);
});

test('property-transfer-fee page has above-fold transfer intent cue block', () => {
  assert.match(source, /id="transfer-fee-intent-cluster"/u);
  assert.match(source, /คำถามที่คนค้นหาก่อนวันโอนบ้าน/u);
  assert.match(source, /ค่าโอนบ้าน 3 ล้าน เท่าไหร่/u);
  assert.match(source, /ค่าจดจำนองคิดยังไง/u);
});

test('property-transfer-fee top intent block links to transfer article and home-loan calculator', () => {
  const intentBlockMatch = source.match(
    /<section id="transfer-fee-intent-cluster"[\s\S]*?<\/section>/u,
  );
  assert.ok(intentBlockMatch, 'transfer-fee intent block is missing');
  const intentBlock = intentBlockMatch[0];
  assert.match(
    intentBlock,
    /href="\/บทความ\/คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง\/"/u,
  );
  assert.match(intentBlock, /href="\/คำนวณผ่อนบ้าน\/"/u);
});
