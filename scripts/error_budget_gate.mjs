#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const deployLogPath = path.join(process.cwd(), 'reports', 'ceo-autopilot', 'deploy-log.csv');
const maxWeightedChangeFailureRatePct = Number(process.env.MAX_WEIGHTED_CFR_PCT || 15);
const maxMttrHours = Number(process.env.MAX_MTTR_HOURS || 4);
const maxCriticalFailures = Number(process.env.MAX_CRITICAL_FAILURES || 0);
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
  const failuresWithoutPostmortem = failures.filter((r) => !(r.postmortem_id || '').trim());
  const failuresWithUnknownSeverity = failures.filter(
    (r) => !Object.prototype.hasOwnProperty.call(severityWeights, (r.failure_severity || '').toLowerCase()),
  );
  const criticalFailures = failures.filter((r) => (r.failure_severity || '').toLowerCase() === 'critical').length;
  const weightedFailurePoints = failures
    .map((r) => severityWeights[(r.failure_severity || 'none').toLowerCase()] ?? 1)
    .reduce((a, b) => a + b, 0);
  const restoreTimes = failures
    .map((r) => hoursBetween(r.deployed_at, r.restored_at))
    .filter((v) => v !== null);

  const rawCfr = deployments.length > 0 ? (failures.length / deployments.length) * 100 : 0;
  const weightedCfr = deployments.length > 0 ? (weightedFailurePoints / deployments.length) * 100 : 0;
  const mttr = median(restoreTimes);

  const cfrPass = weightedCfr <= maxWeightedChangeFailureRatePct;
  const mttrPass = failures.length === 0 || mttr <= maxMttrHours;
  const criticalPass = criticalFailures <= maxCriticalFailures;
  const postmortemPass = failuresWithoutPostmortem.length === 0;
  const severityPass = failuresWithUnknownSeverity.length === 0;
  const gatePass = cfrPass && mttrPass && criticalPass && postmortemPass && severityPass;

  console.log('Error Budget Gate');
  console.log(`Deployments: ${deployments.length}`);
  console.log(`Failures: ${failures.length}`);
  console.log(`Critical failures: ${criticalFailures} (max ${maxCriticalFailures})`);
  console.log(`Failures missing postmortem: ${failuresWithoutPostmortem.length}`);
  console.log(`Failures with unknown severity: ${failuresWithUnknownSeverity.length}`);
  console.log(`CFR raw: ${rawCfr.toFixed(1)}%`);
  console.log(`CFR weighted: ${weightedCfr.toFixed(1)}% (max ${maxWeightedChangeFailureRatePct}%)`);
  console.log(`MTTR median: ${mttr.toFixed(2)}h (max ${maxMttrHours}h)`);
  console.log(`Gate: ${gatePass ? 'PASS' : 'FAIL'}`);

  if (!gatePass) {
    process.exit(2);
  }
}

main();
