import test from 'node:test';
import assert from 'node:assert/strict';

import { commitsMatch, normalizeSha } from './verify-railway-release.mjs';

test('normalizeSha trims and lowercases values', () => {
  assert.equal(normalizeSha('  AbC123  '), 'abc123');
});

test('commitsMatch returns true for identical SHAs', () => {
  assert.equal(commitsMatch('abc1234', 'abc1234'), true);
});

test('commitsMatch returns true when expected is full and deployed is prefix', () => {
  assert.equal(commitsMatch('abc1234def999', 'abc1234'), true);
});

test('commitsMatch returns true when expected is prefix and deployed is full', () => {
  assert.equal(commitsMatch('abc1234', 'abc1234def999'), true);
});

test('commitsMatch returns false for unrelated SHAs', () => {
  assert.equal(commitsMatch('abc1234', 'def5678'), false);
});

