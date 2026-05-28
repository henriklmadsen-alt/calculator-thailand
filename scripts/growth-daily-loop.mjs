#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'reports', 'seo');
const NPM_EXEC_PATH = process.env.npm_execpath || '';

function npmStep(name, script, lane) {
  if (NPM_EXEC_PATH) {
    return {
      name,
      command: process.execPath,
      args: [NPM_EXEC_PATH, 'run', script],
      lane,
      shell: false,
    };
  }

  return {
    name,
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['run', script],
    lane,
    shell: process.platform === 'win32',
  };
}

const STEPS = [
  npmStep('Indexation priority queue', 'report:indexation-queue', 'measure'),
  npmStep('GSC query gap planner', 'report:gsc-gaps', 'measure'),
  npmStep('Content freshness queue', 'audit:freshness', 'audit'),
  npmStep('SERP title competitor comparison', 'report:serp-titles', 'compare'),
  npmStep('Manual promotion pack', 'report:promotion-pack', 'promote'),
  npmStep('50-item traffic recovery audit', 'audit:traffic-recovery', 'confirm'),
];

function todayBangkok() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function runStep(step) {
  const startedAt = new Date().toISOString();
  const result = spawnSync(step.command, step.args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: step.shell,
    windowsHide: true,
  });
  const endedAt = new Date().toISOString();
  return {
    ...step,
    startedAt,
    endedAt,
    status: result.status === 0 ? 'ok' : 'failed',
    exitCode: result.status,
    error: result.error instanceof Error ? result.error.message : '',
    stdoutTail: String(result.stdout || '').split(/\r?\n/).filter(Boolean).slice(-12),
    stderrTail: String(result.stderr || '').split(/\r?\n/).filter(Boolean).slice(-12),
  };
}

function table(headers, rows) {
  if (!rows.length) return '_No rows._';
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows,
  ].join('\n');
}

function mdCell(value, limit = 100) {
  const text = String(value || '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
  return text.length > limit ? `${text.slice(0, limit - 1)}...` : text;
}

function renderReport(results, generatedDate) {
  const rows = results.map((row) => (
    `| ${row.lane} | ${row.name} | ${row.status} | ${row.exitCode ?? 'n/a'} | ${row.startedAt} | ${row.endedAt} |`
  ));
  const failureRows = results
    .filter((row) => row.status !== 'ok')
    .map((row) => `| ${row.name} | ${mdCell(row.error || row.stderrTail.join(' / ') || row.stdoutTail.join(' / '), 160)} |`);

  return `# Daily Growth Loop Run - ${generatedDate}

Generated: ${new Date().toISOString()}

This is the operational loop for traffic recovery: measure, audit, compare, promote, confirm, then deploy and submit indexing when code/content changes are made.

## Step Results

${table(['Lane', 'Step', 'Status', 'Exit', 'Started', 'Ended'], rows)}

## Failures

${table(['Step', 'Tail Output'], failureRows)}

## Next Human/Agent Action

- If all steps pass and no code changed, use the reports to choose the next highest-value content or CTR task.
- If implementation changed, run \`npm run check\`, deploy, then run \`npm run postdeploy:indexing\`.
- After deployment, rerun \`npm run audit:traffic-recovery\` and attach the latest report to the daily note.
`;
}

const generatedDate = todayBangkok();
fs.mkdirSync(REPORT_DIR, { recursive: true });
const latestMd = path.join(REPORT_DIR, 'growth-daily-loop-latest.md');
const latestJson = path.join(REPORT_DIR, 'growth-daily-loop-latest.json');
const datedMd = path.join(REPORT_DIR, `growth-daily-loop-${generatedDate}.md`);

const preflightMarkdown = renderReport([], generatedDate);
fs.writeFileSync(latestMd, preflightMarkdown, 'utf8');
fs.writeFileSync(latestJson, JSON.stringify({
  generatedAt: new Date().toISOString(),
  status: 'started',
  results: [],
}, null, 2), 'utf8');

const results = STEPS.map(runStep);
const markdown = renderReport(results, generatedDate);

fs.writeFileSync(latestMd, markdown, 'utf8');
fs.writeFileSync(datedMd, markdown, 'utf8');
fs.writeFileSync(latestJson, JSON.stringify({
  generatedAt: new Date().toISOString(),
  results,
}, null, 2), 'utf8');

const failed = results.filter((row) => row.status !== 'ok');
console.log(JSON.stringify({
  status: failed.length === 0 ? 'ok' : 'failed',
  failed: failed.map((row) => row.name),
  reports: { latestMd, latestJson, datedMd },
}, null, 2));

if (failed.length > 0) {
  process.exitCode = 1;
}
