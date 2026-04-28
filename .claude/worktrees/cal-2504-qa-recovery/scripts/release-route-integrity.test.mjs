import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractRoutePathsFromSitemapXml,
  diffApprovedVsLive,
  isApprovedCalculatorPagePath,
  toRouteFromPagePath,
} from './release-route-integrity-lib.mjs';

test('detects approved calculator page paths only under src/pages/คำนวณ*/index.astro', () => {
  assert.equal(isApprovedCalculatorPagePath('src/pages/คำนวณค่าไฟฟ้า/index.astro'), true);
  assert.equal(isApprovedCalculatorPagePath('src/pages/คำนวณ-bmi/index.astro'), true);
  assert.equal(isApprovedCalculatorPagePath('src/pages/บทความ/คำนวณค่าไฟฟ้า/index.astro'), false);
  assert.equal(isApprovedCalculatorPagePath('src/pages/index.astro'), false);
});

test('converts calculator page path to encoded route format', () => {
  assert.equal(
    toRouteFromPagePath('src/pages/คำนวณค่าไฟฟ้า/index.astro'),
    '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/'
  );
});

test('computes missing and unexpected routes between approved and live inventories', () => {
  const diff = diffApprovedVsLive(['/a/', '/b/', '/c/'], ['/b/', '/c/', '/d/']);
  assert.deepEqual(diff.missingLiveRoutes, ['/a/']);
  assert.deepEqual(diff.unexpectedLiveRoutes, ['/d/']);
});

test('extracts and normalizes routes from sitemap XML', () => {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset>',
    '<url><loc>https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/</loc></url>',
    '<url><loc>https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/</loc></url>',
    '<url><loc>https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95/</loc></url>',
    '</urlset>',
  ].join('');

  assert.deepEqual(extractRoutePathsFromSitemapXml(xml), [
    '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/',
    '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95/',
  ]);
});
