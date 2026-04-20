import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  containsMojibake,
  containsThaiText,
  diffExpectedRoutes,
  evaluateSurfaceResult,
} from './release-visual-integrity-lib.mjs';

test('detects mojibake markers and ignores valid Thai text', () => {
  assert.equal(containsMojibake('Kamnuanlek คำนวณภาษี'), false);
  assert.equal(containsMojibake('à¸„à¸³à¸™à¸§à¸“à¸ à¸²à¸©à¸µ'), true);
  assert.equal(containsMojibake('ค่าผ่อนบ้าน�ผิดรูปแบบ'), true);
});

test('detects Thai text presence correctly', () => {
  assert.equal(containsThaiText('ภาษีเงินได้บุคคลธรรมดา'), true);
  assert.equal(containsThaiText('Calculate tax now'), false);
});

test('computes missing and unexpected routes', () => {
  const diff = diffExpectedRoutes(
    ['/a/', '/b/', '/c/'],
    ['/b/', '/c/', '/d/'],
  );

  assert.deepEqual(diff.missingRoutes, ['/a/']);
  assert.deepEqual(diff.unexpectedRoutes, ['/d/']);
});

test('fails surface result when any critical check fails', () => {
  const failed = evaluateSurfaceResult({
    httpStatus: 200,
    visible: true,
    thaiTextOk: true,
    mojibakeDetected: false,
    contrastFailureCount: 2,
    hasOverflow: false,
  });
  assert.equal(failed.pass, false);
  assert.match(failed.reasons.join(' '), /contrast/i);

  const passed = evaluateSurfaceResult({
    httpStatus: 200,
    visible: true,
    thaiTextOk: true,
    mojibakeDetected: false,
    contrastFailureCount: 0,
    hasOverflow: false,
  });
  assert.equal(passed.pass, true);
  assert.deepEqual(passed.reasons, []);
});

test('layout chrome copy contains no mojibake sequences', () => {
  const baseLayout = readFileSync(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
  const blogLayout = readFileSync(new URL('../src/layouts/BlogPostLayout.astro', import.meta.url), 'utf8');

  assert.equal(containsMojibake(baseLayout), false);
  assert.equal(containsMojibake(blogLayout), false);
});

test('dark theme defines contrast-safe overrides for hero and trust surfaces', () => {
  const themeCss = readFileSync(new URL('../src/styles/theme.css', import.meta.url), 'utf8');

  assert.equal(themeCss.includes("html[data-theme='dark'] .from-sky-50"), true);
  assert.equal(themeCss.includes("html[data-theme='dark'] .via-white"), true);
  assert.equal(themeCss.includes("html[data-theme='dark'] .to-emerald-50"), true);
  assert.equal(themeCss.includes("html[data-theme='dark'] .bg-slate-50\\/70"), true);
});

test('homepage hero primary CTA uses AA-safe light-mode contrast class', () => {
  const homepage = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');

  assert.match(homepage, /class=\"[^\"]*bg-primary-700[^\"]*hover:bg-primary-800[^\"]*\"/);
});

test('contrast scanner source handles gradient backgrounds for dark-mode fallback', () => {
  const scriptSource = readFileSync(new URL('./release-visual-integrity.mjs', import.meta.url), 'utf8');

  assert.match(scriptSource, /backgroundImage/);
  assert.match(scriptSource, /linear-gradient|extractGradient/i);
  assert.match(scriptSource, /fallbackBackground|fallback/i);
});

test('contrast scanner source walks ancestor backgrounds before page fallback', () => {
  const scriptSource = readFileSync(new URL('./release-visual-integrity.mjs', import.meta.url), 'utf8');

  assert.match(scriptSource, /function nearestBackground\(node, fallback\)/);
  assert.match(scriptSource, /const resolved = resolveBackground\(style,\s*null\);/);
  assert.match(scriptSource, /return fallback;/);
  assert.match(scriptSource, /function resolveBackground\([\s\S]*return null;/);
});
