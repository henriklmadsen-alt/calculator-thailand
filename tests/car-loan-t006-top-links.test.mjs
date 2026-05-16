import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณผ่อนรถ/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

test('T006: car-loan intent cluster exists', () => {
  const clusterMatch = source.match(/<section id="car-loan-intent-cluster"[\s\S]*?<\/section>/u);
  assert.ok(clusterMatch, 'car-loan intent cluster missing');
});

test('T006: loan-payment calculator link exists inside intent cluster', () => {
  const clusterMatch = source.match(/<section id="car-loan-intent-cluster"[\s\S]*?<\/section>/u);
  assert.ok(clusterMatch, 'car-loan intent cluster missing');
  const cluster = clusterMatch[0];
  assert.match(cluster, /href="\/calculator\/loan-payment\/"/u);
});

test('T006: car-loan supporting article link exists inside intent cluster', () => {
  const clusterMatch = source.match(/<section id="car-loan-intent-cluster"[\s\S]*?<\/section>/u);
  assert.ok(clusterMatch, 'car-loan intent cluster missing');
  const cluster = clusterMatch[0];
  assert.match(cluster, /href="\/บทความ\/วิธีคำนวณผ่อนรถ-สูตรและเปรียบเทียบ\/"/u);
});
