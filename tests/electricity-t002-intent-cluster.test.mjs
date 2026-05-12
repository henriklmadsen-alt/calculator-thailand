import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณค่าไฟฟ้า/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

test('T002: electricity page includes above-fold intent cluster section id', () => {
  assert.match(source, /<section id="electricity-intent-cluster"/u);
});

test('T002: electricity intent cluster includes top query cues', () => {
  const clusterMatch = source.match(/<section id="electricity-intent-cluster"[\s\S]*?<\/section>/u);
  assert.ok(clusterMatch, 'electricity intent cluster is missing');
  const cluster = clusterMatch[0];
  assert.match(cluster, /ค่าไฟฟ้า.*2569/u);
  assert.match(cluster, /Ft/u);
  assert.match(cluster, /300\s*หน่วย/u);
  assert.match(cluster, /PEA.*MEA|MEA.*PEA/u);
});

test('T002: electricity intent cluster is above primary calculator form', () => {
  const clusterIndex = source.indexOf('<section id="electricity-intent-cluster"');
  const formIndex = source.indexOf('<form id="electricity-form"');
  assert.ok(clusterIndex >= 0, 'intent cluster not found');
  assert.ok(formIndex >= 0, 'primary calculator form not found');
  assert.ok(clusterIndex < formIndex, 'intent cluster must appear above calculator form');
});
