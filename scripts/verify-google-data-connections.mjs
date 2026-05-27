#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { google } from 'googleapis';

const ROOT = process.cwd();
const DEFAULT_SITE_URL = 'https://www.kamnuanlek.com/';

function loadEnv(fileName) {
  const filePath = path.join(ROOT, fileName);
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, raw] = match;
    if (process.env[key]) continue;
    process.env[key] = raw.replace(/^['"]|['"]$/g, '').trim();
  }
}

function parseJsonEnv(name) {
  const raw = process.env[name];
  if (!raw?.trim()) {
    throw new Error(`${name} missing`);
  }

  const parsed = JSON.parse(raw);
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error(`${name} missing client_email/private_key`);
  }

  return parsed;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getDateRange(days = 7) {
  const endDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const startDate = new Date(endDate.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

async function verifyGsc() {
  const credentials = parseJsonEnv('GSC_SERVICE_ACCOUNT_JSON');
  const siteUrl = process.env.GSC_SITE_URL || DEFAULT_SITE_URL;
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const webmasters = google.webmasters({ version: 'v3', auth });
  const range = getDateRange(7);
  const response = await webmasters.searchanalytics.query({
    siteUrl,
    requestBody: {
      ...range,
      dimensions: ['query'],
      rowLimit: 5,
      orderBy: [{ columnName: 'impressions', sortOrder: 'DESCENDING' }],
    },
  });

  const rows = response.data.rows || [];
  const impressions = rows.reduce((sum, row) => sum + Number(row.impressions || 0), 0);
  const clicks = rows.reduce((sum, row) => sum + Number(row.clicks || 0), 0);

  return {
    status: 'PASS',
    siteUrl,
    dateRange: range,
    sampleRows: rows.length,
    sampleClicks: clicks,
    sampleImpressions: impressions,
  };
}

async function verifyGa4() {
  const credentials = parseJsonEnv('GA4_SERVICE_ACCOUNT_JSON');
  const propertyId = process.env.GA4_PROPERTY_ID?.trim();
  if (!propertyId) {
    throw new Error('GA4_PROPERTY_ID missing');
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
  const analytics = google.analyticsdata({ version: 'v1beta', auth });
  const response = await analytics.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: '7daysAgo', endDate: 'yesterday' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'eventCount' }],
      limit: 10,
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    },
  });

  const rows = response.data.rows || [];
  const sessions = rows.reduce((sum, row) => sum + Number(row.metricValues?.[0]?.value || 0), 0);
  const users = rows.reduce((sum, row) => sum + Number(row.metricValues?.[1]?.value || 0), 0);
  const events = rows.reduce((sum, row) => sum + Number(row.metricValues?.[2]?.value || 0), 0);

  return {
    status: 'PASS',
    propertyId,
    sampleRows: rows.length,
    sampleSessions: sessions,
    sampleUsers: users,
    sampleEvents: events,
  };
}

async function runCheck(name, fn) {
  try {
    return await fn();
  } catch (error) {
    return {
      status: 'FAIL',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

loadEnv('.env');
loadEnv('.env.local');
loadEnv('.env.gsc');

const result = {
  timestamp: new Date().toISOString(),
  gsc: await runCheck('gsc', verifyGsc),
  ga4: await runCheck('ga4', verifyGa4),
};

console.log(JSON.stringify(result, null, 2));

if (result.gsc.status !== 'PASS' || result.ga4.status !== 'PASS') {
  process.exitCode = 1;
}
