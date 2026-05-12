import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const filePath = 'src/pages/คำนวณค่าไฟฟ้า/index.astro';
const source = fs.readFileSync(filePath, 'utf8');

test('T001: electricity page title is explicit for 2569 + Ft + PEA + MEA intent', () => {
  const titleMatch = source.match(/const pageTitle = '([^']+)'/u);
  assert.ok(titleMatch, 'pageTitle is missing');
  const title = titleMatch[1];
  assert.match(title, /2569/u);
  assert.match(title, /Ft/u);
  assert.match(title, /PEA/u);
  assert.match(title, /MEA/u);
});

test('T001: electricity page meta description is explicit for 2569 + Ft + PEA + MEA intent', () => {
  const descriptionMatch = source.match(/const pageDescription = '([^']+)'/u);
  assert.ok(descriptionMatch, 'pageDescription is missing');
  const description = descriptionMatch[1];
  assert.match(description, /2569/u);
  assert.match(description, /Ft/u);
  assert.match(description, /PEA/u);
  assert.match(description, /MEA/u);
});

test('T001: electricity page H1 includes Ft with 2569 + PEA/MEA intent', () => {
  const h1Match = source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/u);
  assert.ok(h1Match, 'H1 is missing');
  const h1 = h1Match[1];
  assert.match(h1, /2569/u);
  assert.match(h1, /PEA|MEA/u);
  assert.match(h1, /Ft/u);
});
