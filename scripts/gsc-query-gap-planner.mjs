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

function todayBangkok() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function n(value, decimals = 0) {
  return Number(value || 0).toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

function pct(value) {
  return `${n(value, 2)}%`;
}

function pagePath(page) {
  if (!page) return '';
  try {
    return decodeURIComponent(new URL(page).pathname);
  } catch {
    return String(page);
  }
}

function table(headers, rows) {
  if (!rows.length) return '_No rows._';
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows,
  ].join('\n');
}

function mdCell(value, limit = 110) {
  const text = String(value || '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
  return text.length > limit ? `${text.slice(0, limit - 1)}...` : text;
}

function clusterForQuery(query = '') {
  const lower = String(query).toLocaleLowerCase('th-TH');
  if (lower.includes('ค่าไฟ') || lower.includes('หน่วยไฟ') || lower.includes('kwh')) return 'electricity';
  if (lower.includes('vat') || lower.includes('ภาษีมูลค่าเพิ่ม') || lower.includes('1.07')) return 'vat';
  if (lower.includes('อายุ') || lower.includes('วันเกิด') || lower.includes('ปีเกิด')) return 'age';
  if (lower.includes('ผ่อนรถ') || lower.includes('ค่างวดรถ') || lower.includes('ไฟแนนซ์')) return 'car-loan';
  if (lower.includes('ผ่อนบ้าน') || lower.includes('กู้บ้าน') || lower.includes('รีไฟแนนซ์')) return 'home-loan';
  if (lower.includes('bmi') || lower.includes('น้ำหนัก') || lower.includes('ส่วนสูง')) return 'bmi';
  if (lower.includes('โอที') || lower.includes('ล่วงเวลา')) return 'overtime';
  return 'general';
}

function recommendedAsset(query, page) {
  const cluster = clusterForQuery(query);
  const targetPage = pagePath(page);
  const clusterActions = {
    electricity: 'Create or refresh an exact-number electricity article, add a worked example, and link back to the electricity calculator above the fold.',
    vat: 'Create or refresh a VAT exact-number page with add/remove VAT examples, title-matched FAQ, and links to the VAT calculator.',
    age: 'Create a Thai-year age answer page or expand the age calculator FAQ for this exact query.',
    'car-loan': 'Create a finance-intent article with flat-rate/EIR explanation, payment table, and a result-gated insurance affiliate CTA.',
    'home-loan': 'Create a mortgage-intent article with monthly payment table, DTI note, and a result-gated partner CTA.',
    bmi: 'Create a BMI interpretation page with formula, Thai thresholds, and clear medical disclaimer.',
    overtime: 'Create an OT multiplier page with legal assumptions, 1.5x/2x/3x examples, and Ministry of Labour reference.',
    general: 'Improve the ranking page title, first answer block, FAQ schema, and internal links for this exact wording.',
  };

  return {
    cluster,
    targetPage,
    action: clusterActions[cluster],
  };
}

function buildGapPlan(payload) {
  const gapRows = payload.keywords.opportunities.slice(0, 25).map((row) => {
    const asset = recommendedAsset(row.query, row.page);
    return {
      query: row.query,
      cluster: asset.cluster,
      page: row.page,
      pagePath: asset.targetPage,
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: row.ctr,
      position: row.position,
      score: row.opportunityScore,
      potentialExtraClicks: row.potentialExtraClicks,
      action: asset.action,
    };
  });

  const ctrRows = payload.pages.ctrRepairs.slice(0, 15).map((row) => ({
    page: row.page,
    pagePath: pagePath(row.page),
    impressions: row.impressions,
    clicks: row.clicks,
    ctr: row.ctr,
    expectedCtr: row.expectedCtr,
    ctrGap: row.ctrGap,
    action: row.recommendedAction,
  }));

  const zeroSearchRows = (payload.discovery?.clientEvents?.zeroSearchTerms || []).slice(0, 20).map((row) => ({
    term: row.term,
    count: row.count,
    cluster: clusterForQuery(row.term),
    action: 'Add synonym mapping, a homepage search alias, or a dedicated calculator/article if this term repeats.',
  }));

  const contentQueue = gapRows.slice(0, 12).map((row, index) => ({
    priority: index + 1,
    cluster: row.cluster,
    query: row.query,
    targetPage: row.pagePath || '(new page needed)',
    task: row.action,
  }));

  return { gapRows, ctrRows, zeroSearchRows, contentQueue };
}

function renderReport(payload, plan, generatedDate) {
  const gapRows = plan.gapRows.map((row, index) => (
    `| ${index + 1} | ${mdCell(row.query, 44)} | ${row.cluster} | ${mdCell(row.pagePath || '(new)', 44)} | ${n(row.impressions)} | ${n(row.clicks)} | ${pct(row.ctr)} | ${n(row.position, 1)} | ${n(row.score, 1)} | ${mdCell(row.action, 90)} |`
  ));

  const ctrRows = plan.ctrRows.map((row, index) => (
    `| ${index + 1} | ${mdCell(row.pagePath, 58)} | ${n(row.impressions)} | ${n(row.clicks)} | ${pct(row.ctr)} | ${pct(row.expectedCtr)} | ${n(row.ctrGap, 2)} | ${mdCell(row.action, 90)} |`
  ));

  const zeroRows = plan.zeroSearchRows.map((row, index) => (
    `| ${index + 1} | ${mdCell(row.term, 50)} | ${row.cluster} | ${n(row.count)} | ${mdCell(row.action, 90)} |`
  ));

  const queueRows = plan.contentQueue.map((row) => (
    `| ${row.priority} | ${row.cluster} | ${mdCell(row.query, 50)} | ${mdCell(row.targetPage, 50)} | ${mdCell(row.task, 100)} |`
  ));

  return `# GSC Query Gap Planner - ${generatedDate}

Generated: ${new Date().toISOString()}
GSC range: ${payload.range.startDate} to ${payload.range.endDate}
Site: ${payload.siteUrl}

## Summary

- Current clicks: ${n(payload.search.clicks)} from ${n(payload.search.impressions)} impressions.
- Current CTR: ${pct(payload.search.ctr)}.
- Average position: ${n(payload.search.avgPosition, 1)}.
- Query gaps selected: ${n(plan.gapRows.length)}.
- CTR repair pages selected: ${n(plan.ctrRows.length)}.
- Zero-result search terms available: ${n(plan.zeroSearchRows.length)}.

## Query Gap Priority

${table(['#', 'Query', 'Cluster', 'Best Page', 'Impr.', 'Clicks', 'CTR', 'Pos.', 'Score', 'Action'], gapRows)}

## CTR Repair Queue

${table(['#', 'Page', 'Impr.', 'Clicks', 'CTR', 'Expected CTR', 'Gap', 'Action'], ctrRows)}

## Zero-Result Search Demand

${table(['#', 'Search Term', 'Cluster', 'Count', 'Action'], zeroRows)}

## Content Build Queue

${table(['Priority', 'Cluster', 'Query', 'Target Page', 'Task'], queueRows)}
`;
}

loadEnv('.env');
loadEnv('.env.local');
loadEnv('.env.gsc');

const generatedDate = todayBangkok();
const payload = await buildKpiDashboardPayload(28);
const plan = buildGapPlan(payload);
const markdown = renderReport(payload, plan, generatedDate);

fs.mkdirSync(REPORT_DIR, { recursive: true });
const latestMd = path.join(REPORT_DIR, 'gsc-query-gap-plan-latest.md');
const latestJson = path.join(REPORT_DIR, 'gsc-query-gap-plan-latest.json');
const datedMd = path.join(REPORT_DIR, `gsc-query-gap-plan-${generatedDate}.md`);
fs.writeFileSync(latestMd, markdown, 'utf8');
fs.writeFileSync(datedMd, markdown, 'utf8');
fs.writeFileSync(latestJson, JSON.stringify({
  generatedAt: new Date().toISOString(),
  siteUrl: payload.siteUrl,
  range: payload.range,
  search: payload.search,
  ...plan,
}, null, 2), 'utf8');

console.log(JSON.stringify({
  status: 'ok',
  range: payload.range,
  queryGaps: plan.gapRows.length,
  ctrRepairs: plan.ctrRows.length,
  zeroSearchTerms: plan.zeroSearchRows.length,
  reports: { latestMd, latestJson, datedMd },
}, null, 2));
