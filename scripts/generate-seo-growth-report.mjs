#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { buildKpiDashboardPayload } from '../app/kpi-dashboard.mjs';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'reports', 'seo');

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

function getArg(name, fallback = '') {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

function todayBangkok() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function n(value, decimals = 0) {
  const number = Number(value || 0);
  return number.toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

function pct(value) {
  return `${n(value, 2)}%`;
}

function table(headers, rows) {
  if (!rows.length) return '_No rows returned._';
  return [
    `| ${headers.join(' |')} |`,
    `| ${headers.map(() => '---').join(' |')} |`,
    ...rows,
  ].join('\n');
}

function pagePath(page) {
  if (!page) return '';
  try {
    return decodeURIComponent(new URL(page).pathname);
  } catch {
    return String(page);
  }
}

function renderReport(payload, generatedDate) {
  const topQueries = payload.keywords.top.slice(0, 12).map((row, index) => (
    `| ${index + 1} | ${row.query || ''} | ${n(row.impressions)} | ${n(row.clicks)} | ${pct(row.ctr)} | ${n(row.position, 1)} | ${row.pageLabel || pagePath(row.page)} |`
  ));

  const topPages = payload.pages.top.slice(0, 12).map((row, index) => (
    `| ${index + 1} | ${pagePath(row.page)} | ${n(row.impressions)} | ${n(row.clicks)} | ${pct(row.ctr)} | ${n(row.position, 1)} |`
  ));

  const opportunities = payload.keywords.opportunities.slice(0, 10).map((row, index) => (
    `| ${index + 1} | ${row.query || ''} | ${pagePath(row.page)} | ${n(row.impressions)} | ${n(row.position, 1)} | ${row.recommendedAction} |`
  ));

  const ctrRepairs = payload.pages.ctrRepairs.slice(0, 10).map((row, index) => (
    `| ${index + 1} | ${pagePath(row.page)} | ${n(row.impressions)} | ${n(row.clicks)} | ${pct(row.ctr)} | ${pct(row.expectedCtr)} | ${n(row.opportunityScore, 1)} |`
  ));

  const actions = payload.actions.slice(0, 12).map((row, index) => (
    `| ${index + 1} | ${row.priority} | ${row.lane} | ${row.target || ''} | ${pagePath(row.page)} | ${row.metric} | ${row.action} |`
  ));

  const affiliateTotals = payload.affiliate?.totals || {};
  const weeklyTargetSessions = 7000;
  const weeklyOrganicProgress = weeklyTargetSessions > 0
    ? Math.round((Number(payload.organic.sessions || 0) / weeklyTargetSessions) * 1000) / 10
    : 0;

  return `# Kamnuanlek SEO Growth Report - ${generatedDate}

Generated: ${payload.timestamp}
GSC range: ${payload.range.startDate} to ${payload.range.endDate}
Previous comparison range: ${payload.previousRange.startDate} to ${payload.previousRange.endDate}
Site: ${payload.siteUrl}

## Executive Status

- SEO operating score: ${payload.score}/100.
- GSC clicks: ${n(payload.search.clicks)} from ${n(payload.search.impressions)} impressions.
- GSC CTR: ${pct(payload.search.ctr)}.
- Average GSC position: ${n(payload.search.avgPosition, 1)}.
- GA4 organic sessions: ${n(payload.organic.sessions)} from ${n(payload.organic.users)} users and ${n(payload.organic.events)} events.
- 1,000 visitors/day target pace: ${n(payload.organic.sessions)} organic sessions this period vs ${n(weeklyTargetSessions)} needed for a 7-day 1,000/day pace (${n(weeklyOrganicProgress, 1)}% of target).
- Affiliate redirects/clicks: ${n(affiliateTotals.redirects || 0)} redirects, ${n(affiliateTotals.clicks || 0)} GA4 clicks, ${n(affiliateTotals.ctaViews || 0)} CTA views.

## Current Read

Traffic is still at seed-stage volume. The site is being seen in Google, especially electricity and age/calculation intents, but clicks are not yet close to the 1,000/day goal. The immediate ranking work should focus on pages already getting impressions, because that is where Google has already started testing the site.

## Top Queries

${table(['#', 'Query', 'Impr.', 'Clicks', 'CTR', 'Pos.', 'Best page'], topQueries)}

## Top Pages

${table(['#', 'Page', 'Impr.', 'Clicks', 'CTR', 'Pos.'], topPages)}

## Rank Push Opportunities

${table(['#', 'Query', 'Page', 'Impr.', 'Pos.', 'Action'], opportunities)}

## CTR Repair Candidates

${table(['#', 'Page', 'Impr.', 'Clicks', 'CTR', 'Expected CTR', 'Opportunity'], ctrRepairs)}

## Action Queue

${table(['#', 'Priority', 'Lane', 'Target', 'Page', 'Metric', 'Action'], actions)}

## Regular Operating Cadence

- Daily: check GSC impressions, CTR, average position, indexability/build health, and affiliate redirects.
- Twice weekly: rewrite title/meta and first-screen answer blocks for pages with impressions but weak CTR.
- Weekly: publish or improve 5-10 query-matched support articles that internally link to one priority calculator.
- Weekly: submit sitemap/changed URLs, review top movers, and update the action queue.
- Monthly: prune or noindex thin/low-quality pages, consolidate duplicates, and refresh calculator formulas/rates.
- Monthly: run visual/mobile QA on top landing pages and affiliate calculator pages.
`;
}

loadEnv('.env');
loadEnv('.env.local');
loadEnv('.env.gsc');

const days = Math.min(Math.max(Number.parseInt(getArg('--days', '7'), 10) || 7, 7), 180);
const generatedDate = todayBangkok();
const payload = await buildKpiDashboardPayload(days);
const markdown = renderReport(payload, generatedDate);

fs.mkdirSync(REPORT_DIR, { recursive: true });
const datedPath = path.join(REPORT_DIR, `seo-growth-report-${generatedDate}.md`);
const latestPath = path.join(REPORT_DIR, 'seo-growth-report-latest.md');
const jsonPath = path.join(REPORT_DIR, 'seo-growth-report-latest.json');

fs.writeFileSync(datedPath, markdown);
fs.writeFileSync(latestPath, markdown);
fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2));

console.log(JSON.stringify({
  status: 'ok',
  days,
  score: payload.score,
  range: payload.range,
  search: payload.search,
  organic: payload.organic,
  actions: payload.actions.length,
  datedPath,
  latestPath,
  jsonPath,
}, null, 2));
