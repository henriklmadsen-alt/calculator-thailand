#!/usr/bin/env node
/**
 * GSC Ranking Query Tool
 *
 * Pulls current keyword or page performance from Google Search Console.
 * Credentials can come from Railway-injected environment variables or from an
 * optional local .env.gsc file. Do not commit .env.gsc.
 *
 * Usage:
 *   node scripts/gsc-rankings.mjs --top 25
 *   node scripts/gsc-rankings.mjs --dimension page --days 30 --json
 *   railway run node scripts/gsc-rankings.mjs --top 25
 */

import { google } from 'googleapis';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env.gsc');

function loadOptionalEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
}

function getArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

loadOptionalEnvFile(envPath);

const serviceAccount = JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON || '{}');
const siteUrl = process.env.GSC_SITE_URL || 'https://www.kamnuanlek.com/';
const days = Number.parseInt(getArg('--days', '30'), 10);
const top = Number.parseInt(getArg('--top', '25'), 10);
const dimension = getArg('--dimension', 'query');
const jsonOutput = process.argv.includes('--json');
const dimensionLabel = dimension === 'query' ? 'queries' : `${dimension}s`;

async function queryGSC() {
  try {
    if (!serviceAccount.client_email || !serviceAccount.private_key) {
      throw new Error('GSC_SERVICE_ACCOUNT_JSON is missing or incomplete');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const webmasters = google.webmasters({ version: 'v3', auth });

    // GSC data normally lags by roughly 2-3 days.
    const endDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const response = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: [dimension],
        rowLimit: top,
        orderBy: [{ columnName: 'clicks', sortOrder: 'DESCENDING' }],
      },
    });

    const rows = (response.data.rows || []).map((row) => ({
      value: row.keys[0],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr ? Math.round(row.ctr * 10000) / 100 : 0,
      position: row.position ? Math.round(row.position * 10) / 10 : null,
    }));

    if (jsonOutput) {
      console.log(JSON.stringify({
        siteUrl,
        dimension,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        rows,
      }, null, 2));
      return;
    }

    if (rows.length === 0) {
      console.log('No GSC data available for the requested range.');
      return;
    }

    console.log(`\nGSC top ${dimensionLabel} (${formatDate(startDate)} to ${formatDate(endDate)})\n`);
    console.log(`${dimension} | Clicks | Impressions | CTR | Avg Position`);
    console.log('---|---:|---:|---:|---:');
    for (const row of rows) {
      console.log(`${row.value} | ${row.clicks} | ${row.impressions} | ${row.ctr}% | ${row.position ?? 'N/A'}`);
    }

    console.log('\nData pulled from Google Search Console.');
  } catch (error) {
    console.error('GSC query error:', error.message);
    process.exit(1);
  }
}

queryGSC();
