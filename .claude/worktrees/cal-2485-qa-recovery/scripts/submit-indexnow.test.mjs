#!/usr/bin/env node

/**
 * Tests for submit-indexnow.mjs
 */

import { extractUrlsFromSitemap } from './submit-indexnow.mjs';
import { strict as assert } from 'node:assert';

// Test 1: extractUrlsFromSitemap parses URLs correctly
{
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.kamnuanlek.com/</loc></url>
  <url><loc>https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95/</loc></url>
  <url><loc>https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/</loc></url>
</urlset>`;

  const urls = extractUrlsFromSitemap(xml);
  assert.equal(urls.length, 3, 'Should extract 3 URLs');
  assert.equal(urls[0], 'https://www.kamnuanlek.com/', 'First URL is homepage');
  assert.ok(urls[1].includes('%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93'), 'Second URL contains Thai chars');
  console.log('PASS: extractUrlsFromSitemap parses URLs correctly');
}

// Test 2: empty sitemap returns empty array
{
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>`;
  const urls = extractUrlsFromSitemap(xml);
  assert.equal(urls.length, 0, 'Should return empty array for empty sitemap');
  console.log('PASS: empty sitemap returns empty array');
}

// Test 3: single-line sitemap (real Astro output format)
{
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.kamnuanlek.com/</loc></url><url><loc>https://www.kamnuanlek.com/page2/</loc></url></urlset>`;
  const urls = extractUrlsFromSitemap(xml);
  assert.equal(urls.length, 2, 'Should parse single-line sitemap');
  console.log('PASS: single-line sitemap parsed correctly');
}

console.log('\nAll tests passed.');
