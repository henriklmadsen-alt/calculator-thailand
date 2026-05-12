#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const deployLogPath = path.join(process.cwd(), 'reports', 'ceo-autopilot', 'deploy-log.csv');
const severityWeights = { critical: 1, major: 0.6, minor: 0.2, none: 0 };

function parseCsv(content) {
  const lines = content.trim().split(/\r?\n/);
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const cols = line.split(',');
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cols[idx] ?? '';
    });
    return row;
  });
}

function median(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2;
  return sorted[mid];
}

function hoursBetween(startIso, endIso) {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null;
  return (end - start) / 3600000;
}

function main() {
  if (!fs.existsSync(deployLogPath)) {
    console.error(`Missing file: ${deployLogPath}`);
    process.exit(1);
  }

  const rows = parseCsv(fs.readFileSync(deployLogPath, 'utf8'));
  const deployments = rows.filter((r) => r.deployed_at);
  const failures = deployments.filter((r) => String(r.is_failure).toLowerCase() === 'true');
  const postmortemCoveragePct = failures.length > 0
    ? (failures.filter((r) => (r.postmortem_id || '').trim()).length / failures.length) * 100
    : 100;
  const weightedFailurePoints = failures
    .map((r) => severityWeights[(r.failure_severity || 'none').toLowerCase()] ?? 1)
    .reduce((a, b) => a + b, 0);

  const leadTimes = deployments
    .map((r) => hoursBetween(r.change_started_at, r.deployed_at))
    .filter((v) => v !== null);
  const restoreTimes = failures
    .map((r) => hoursBetween(r.deployed_at, r.restored_at))
    .filter((v) => v !== null);

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 3600000);
  const monthlyWindow = new Date(now.getTime() - 30 * 24 * 3600000);

  const weeklyDeployments = deployments.filter((r) => new Date(r.deployed_at) >= weekAgo).length;
  const monthlyDeployments = deployments.filter((r) => new Date(r.deployed_at) >= monthlyWindow).length;
  const changeFailRate = deployments.length > 0 ? (failures.length / deployments.length) * 100 : 0;
  const weightedChangeFailRate = deployments.length > 0 ? (weightedFailurePoints / deployments.length) * 100 : 0;
  const mttr = median(restoreTimes);
  const leadTimeMedian = median(leadTimes);

  console.log('DORA Scorecard');
  console.log(`Deployments (7d): ${weeklyDeployments}`);
  console.log(`Deployments (30d): ${monthlyDeployments}`);
  console.log(`Deployment frequency (7d avg/day): ${(weeklyDeployments / 7).toFixed(2)}`);
  console.log(`Lead time median (hours): ${leadTimeMedian.toFixed(2)}`);
  console.log(`Change failure rate (% raw): ${changeFailRate.toFixed(1)}`);
  console.log(`Change failure rate (% weighted): ${weightedChangeFailRate.toFixed(1)}`);
  console.log(`Failure postmortem coverage (%): ${postmortemCoveragePct.toFixed(1)}`);
  console.log(`Mean time to restore, median (hours): ${mttr.toFixed(2)}`);
}

main();
