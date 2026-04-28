import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildCaptureTargets,
  buildTargetUrl,
  makeCaptureSlug,
  normalizeRoutePath,
  normalizeSiteUrl,
  parsePathList,
} from './run-visual-qa.mjs';

test('normalizeSiteUrl trims trailing slash', () => {
  assert.equal(
    normalizeSiteUrl('https://calculator-thailand-production.up.railway.app/'),
    'https://calculator-thailand-production.up.railway.app'
  );
});

test('normalizeRoutePath keeps absolute URLs unchanged', () => {
  assert.equal(
    normalizeRoutePath('https://calculator-thailand-production.up.railway.app/calc-credit-card-interest/'),
    'https://calculator-thailand-production.up.railway.app/calc-credit-card-interest/'
  );
});

test('parsePathList normalizes comma-separated routes', () => {
  assert.deepEqual(parsePathList(' , /,calc-overtime/, /calc-electricity/  '), [
    '/',
    '/calc-overtime/',
    '/calc-electricity/',
  ]);
});

test('buildTargetUrl resolves relative paths against site url', () => {
  assert.equal(
    buildTargetUrl(
      'https://calculator-thailand-production.up.railway.app/',
      '/calc-credit-card-interest/'
    ),
    'https://calculator-thailand-production.up.railway.app/calc-credit-card-interest/'
  );
});

test('makeCaptureSlug returns stable slug for home route', () => {
  assert.equal(makeCaptureSlug('/', 0), 'home');
});

test('buildCaptureTargets deduplicates identical urls', () => {
  const targets = buildCaptureTargets('https://calculator-thailand-production.up.railway.app', [
    '/',
    '/',
    '/calc-overtime/',
    '/calc-overtime/',
  ]);

  assert.equal(targets.length, 2);
  assert.equal(targets[0].routePath, '/');
  assert.equal(targets[1].routePath, '/calc-overtime/');
});
