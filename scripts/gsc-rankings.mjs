#!/usr/bin/env node
/**
 * GSC Ranking Query Tool
 * Pulls current keyword rankings from Google Search Console
 *
 * Usage: node scripts/gsc-rankings.mjs [--top 20]
 */

import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.gsc') });

const SERVICE_ACCOUNT = JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON || '{}');
const SITE_URL = 'https://www.kamnuanlek.com/';

async function queryGSC() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: SERVICE_ACCOUNT,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const webmasters = google.webmasters({ version: 'v3', auth });

    // Query performance data
    const response = await webmasters.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        dimensions: ['query'],
        rowLimit: 100,
        orderBy: [{ columnName: 'clicks', sortOrder: 'DESCENDING' }],
      },
    });

    if (!response.data.rows) {
      console.log('No GSC data available yet.');
      return;
    }

    console.log('\n📊 TOP THAI CALCULATOR KEYWORDS (Last 30 days)\n');
    console.log('Keyword | Clicks | Impressions | CTR | Avg Position');
    console.log('---|---|---|---|---');

    response.data.rows.forEach((row) => {
      const query = row.keys[0];
      const clicks = row.clicks || 0;
      const impressions = row.impressions || 0;
      const ctr = row.ctr ? (row.ctr * 100).toFixed(1) : 0;
      const position = row.position ? row.position.toFixed(1) : 'N/A';

      console.log(
        `${query} | ${clicks} | ${impressions} | ${ctr}% | ${position}`,
      );
    });

    console.log('\n✓ Data pulled from Google Search Console');
    console.log(`✓ Credentials: ${SERVICE_ACCOUNT.client_email}`);
  } catch (error) {
    console.error('❌ GSC Query Error:', error.message);
    process.exit(1);
  }
}

queryGSC();
