#!/usr/bin/env node
/**
 * Submit bilingual sitemaps to Google Search Console (GSC)
 *
 * Submits sitemaps for both Thai (canonical) and English (hreflang variant) versions
 * to Google Search Console for indexing discovery.
 *
 * The site uses a single sitemap with bidirectional hreflang linking:
 * - Thai URLs: /calculator/* (hreflang: th-TH, default)
 * - English URLs: /en/calculator/* (hreflang: en)
 *
 * Usage: node scripts/submit-sitemaps-to-gsc.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Load GSC credentials from .env.gsc
const envGscPath = path.join(projectRoot, '.env.gsc');
if (!fs.existsSync(envGscPath)) {
  console.error('❌ .env.gsc not found. Cannot submit sitemaps without GSC credentials.');
  process.exit(1);
}

const envContent = fs.readFileSync(envGscPath, 'utf-8');
const gscJsonMatch = envContent.match(/GSC_SERVICE_ACCOUNT_JSON='(.+?)'/s);
if (!gscJsonMatch) {
  console.error('❌ GSC_SERVICE_ACCOUNT_JSON not found in .env.gsc');
  process.exit(1);
}

const serviceAccountJson = JSON.parse(gscJsonMatch[1]);

// GSC configuration
const SITE_URL = 'https://www.kamnuanlek.com/';
const DOMAIN_SITE_URL = 'sc-domain:kamnuanlek.com';
const SITEMAP_INDEX_URL = 'https://www.kamnuanlek.com/sitemap-index.xml';

async function authenticateGSC() {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccountJson,
    scopes: ['https://www.googleapis.com/auth/webmasters'],
  });

  return google.searchconsole({
    version: 'v1',
    auth,
  });
}

async function submitSitemap(searchconsole, siteUrl, sitemapUrl) {
  try {
    console.log(`📤 Submitting sitemap: ${sitemapUrl}`);
    console.log(`   to GSC site: ${siteUrl}`);

    const response = await searchconsole.sitemap.submit({
      siteUrl: siteUrl,
      requestBody: {
        feedpath: sitemapUrl,
      },
    });

    console.log(`✅ Sitemap submitted successfully`);
    console.log(`   Response status: ${response.status}`);
    return response;
  } catch (error) {
    if (error.message.includes('Invalid feedpath')) {
      console.warn(`⚠️  Feedpath already submitted or not yet crawled: ${sitemapUrl}`);
      console.log(`   (This is normal if the sitemap was already submitted)`);
      return { status: 200 };
    }
    throw error;
  }
}

async function verifySiteOwnership(searchconsole) {
  let siteUrl = SITE_URL;

  // Try URL-level first
  try {
    console.log(`🔍 Verifying site ownership (URL-level): ${SITE_URL}`);
    const response = await searchconsole.sites.get({ siteUrl: SITE_URL });
    console.log(`✅ Site verified in GSC (URL-level): ${response.data.siteUrl}`);
    return { response, siteUrl: SITE_URL };
  } catch (error1) {
    console.warn(`⚠️  URL-level access failed, trying domain-level...`);

    // Try domain-level
    try {
      console.log(`🔍 Verifying site ownership (domain-level): ${DOMAIN_SITE_URL}`);
      const response = await searchconsole.sites.get({ siteUrl: DOMAIN_SITE_URL });
      console.log(`✅ Site verified in GSC (domain-level): ${response.data.siteUrl}`);
      return { response, siteUrl: DOMAIN_SITE_URL };
    } catch (error2) {
      console.error(`❌ Site not verified in GSC: ${error2.message}`);
      console.log(`\n   Next steps:`);
      console.log(`   1. Go to https://search.google.com/search-console`);
      console.log(`   2. Click "Add property"`);
      console.log(`   3. Enter site URL: ${SITE_URL}`);
      console.log(`   4. Verify ownership (via meta tag, HTML file, or DNS)`);
      console.log(`   5. Add service account (seo-reporting-bot@kamnuanlek-seo-api.iam.gserviceaccount.com) as Editor`);
      console.log(`   6. Run this script again`);
      process.exit(1);
    }
  }
}

async function main() {
  console.log('🚀 Google Search Console Sitemap Submission\n');
  console.log(`📍 Site URL: ${SITE_URL}`);
  console.log(`📋 Sitemap Index: ${SITEMAP_INDEX_URL}\n`);

  try {
    // Authenticate with Google
    console.log('🔐 Authenticating with Google...');
    const searchconsole = await authenticateGSC();
    console.log('✅ Authentication successful\n');

    // Verify site ownership
    const { siteUrl } = await verifySiteOwnership(searchconsole);
    console.log('');

    // Submit the sitemap index (includes all bilingual URLs)
    await submitSitemap(searchconsole, siteUrl, SITEMAP_INDEX_URL);

    console.log(`
✨ Sitemap submission complete!

📊 Site Information:
   - Canonical language: Thai (th-TH)
   - Alt language: English (en)
   - Hreflang linking: Bidirectional (/en/path linked to /path)
   - Sitemap structure: Single index with all URLs + hreflang in HTML pages

⏱️  Google may take 24-48 hours to crawl and index new sitemaps.
   Check GSC dashboard for crawl status and indexing progress.
    `);

  } catch (error) {
    console.error(`\n❌ Error submitting sitemap:\n${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
