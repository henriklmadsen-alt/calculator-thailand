#!/usr/bin/env node

/**
 * Post-deploy IndexNow submission script.
 * Fetches the live sitemap from the production site and submits all URLs
 * to the IndexNow API. Covers Bing, Yandex, and other supporting engines.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs --site-url https://www.kamnuanlek.com
 *   node scripts/submit-indexnow.mjs --site-url https://www.kamnuanlek.com --dry-run
 */

import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const INDEXNOW_KEY = 'b48f107cf34f6dcalcth';
const INDEXNOW_API = 'https://api.indexnow.org/IndexNow';

function parseArgs(argv) {
  const args = new Map();
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args.set(key, next);
      i += 1;
    } else {
      args.set(key, 'true');
    }
  }

  const siteUrl = args.get('site-url');
  if (!siteUrl) {
    throw new Error('Missing required argument: --site-url <url>');
  }

  return {
    siteUrl: siteUrl.replace(/\/+$/, ''),
    dryRun: args.get('dry-run') === 'true',
  };
}

export function extractUrlsFromSitemap(xml) {
  const urls = [];
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

export async function submitToIndexNow(urls, host) {
  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const res = await fetch(INDEXNOW_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  return { status: res.status, statusText: res.statusText };
}

async function main() {
  const { siteUrl, dryRun } = parseArgs(process.argv.slice(2));
  const host = new URL(siteUrl).host;
  const sitemapUrl = `${siteUrl}/sitemap-0.xml`;

  console.log(`Fetching sitemap: ${sitemapUrl}`);

  let xml;
  try {
    const res = await fetch(sitemapUrl);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    xml = await res.text();
  } catch (err) {
    console.error(`Failed to fetch sitemap: ${err.message}`);
    process.exit(1);
  }

  const urls = extractUrlsFromSitemap(xml);
  if (urls.length === 0) {
    console.error('No URLs found in sitemap.');
    process.exit(1);
  }

  console.log(`Found ${urls.length} URLs in sitemap.`);

  if (dryRun) {
    console.log('Dry run - URLs that would be submitted:');
    urls.forEach((u) => console.log(`  ${u}`));
    return;
  }

  console.log(`Submitting ${urls.length} URLs to IndexNow API...`);
  try {
    const result = await submitToIndexNow(urls, host);
    // IndexNow returns 200 (OK) or 202 (Accepted)
    if (result.status >= 200 && result.status < 300) {
      console.log(`IndexNow submission successful: ${result.status} ${result.statusText}`);
    } else {
      console.error(`IndexNow submission returned: ${result.status} ${result.statusText}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`IndexNow submission failed: ${err.message}`);
    process.exit(1);
  }
}

// Run if executed directly
const isMain =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  (pathToFileURL(process.argv[1]).href === import.meta.url ||
    resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname.slice(1)));

if (isMain) {
  main();
}
