import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณผ่อนรถ/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

test('T005: car-loan intent cluster exists', () => {
  assert.match(source, /<section id="car-loan-intent-cluster"/u);
});

test('T005: car-loan intent cluster appears above primary calculator form', () => {
  const clusterIndex = source.indexOf('<section id="car-loan-intent-cluster"');
  const formIndex = source.indexOf('<form id="vehicle-form"');
  assert.ok(clusterIndex >= 0, 'car-loan intent cluster not found');
  assert.ok(formIndex >= 0, 'vehicle form not found');
  assert.ok(clusterIndex < formIndex, 'intent cluster must be above vehicle form');
});

test('T005: car-loan intent cluster includes required Thai intent cues', () => {
  const clusterMatch = source.match(/<section id="car-loan-intent-cluster"[\s\S]*?<\/section>/u);
  assert.ok(clusterMatch, 'car-loan intent cluster missing');
  const cluster = clusterMatch[0];
  assert.match(cluster, /ผ่อนรถ.*2569.*ค่างวด/u);
  assert.match(cluster, /10%\/15%\/20%/u);
  assert.match(cluster, /48\/60\/72\/84/u);
  assert.match(cluster, /0\.5%/u);
});
