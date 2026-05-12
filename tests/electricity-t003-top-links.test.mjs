import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณค่าไฟฟ้า/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

test('T003: electricity intent cluster exists', () => {
  assert.match(source, /<section id="electricity-intent-cluster"/u);
});

test('T003: electricity intent cluster includes both required top links', () => {
  const clusterMatch = source.match(/<section id="electricity-intent-cluster"[\s\S]*?<\/section>/u);
  assert.ok(clusterMatch, 'electricity intent cluster is missing');
  const cluster = clusterMatch[0];

  assert.match(cluster, /href="\/บทความ\/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ\/"/u);
  assert.match(cluster, /href="\/บทความ\/ภาษีมูลค่าเพิ่ม-7-คิดยังไง-สูตรบวกภาษี-ถอดภาษี-ตั้งราคาขายให้ไม่ขาดทุน\/"/u);
});
