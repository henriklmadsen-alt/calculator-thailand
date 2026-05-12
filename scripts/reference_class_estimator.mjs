#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ledgerPath = path.join(process.cwd(), 'reports', 'ceo-autopilot', 'forecast-ledger.csv');
const query = (process.argv.slice(2).join(' ') || '').toLowerCase().trim();

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

function percentile(values, p) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx];
}

function main() {
  if (!fs.existsSync(ledgerPath)) {
    console.error(`Missing file: ${ledgerPath}`);
    process.exit(1);
  }

  const rows = parseCsv(fs.readFileSync(ledgerPath, 'utf8')).filter((r) => r.status === 'done');
  if (rows.length === 0) {
    console.error('No completed rows found in forecast ledger.');
    process.exit(1);
  }

  let candidates = rows;
  if (query) {
    const filtered = rows.filter((r) => (`${r.task_id} ${r.task_name} ${r.notes}`).toLowerCase().includes(query));
    if (filtered.length > 0) candidates = filtered;
  }

  const actuals = candidates.map((r) => Number(r.actual_hours)).filter((n) => Number.isFinite(n) && n > 0);
  const p25 = percentile(actuals, 25);
  const p50 = percentile(actuals, 50);
  const p90 = percentile(actuals, 90);

  console.log('Reference-Class Estimate');
  console.log(`Query: ${query || '(all completed tasks)'}`);
  console.log(`Sample size: ${actuals.length}`);
  console.log(`Best-case (P25): ${p25.toFixed(2)}h`);
  console.log(`Likely (P50): ${p50.toFixed(2)}h`);
  console.log(`Worst-case (P90): ${p90.toFixed(2)}h`);
}

main();
