#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const inputPath = path.join(process.cwd(), 'reports', 'ceo-autopilot', 'forecast-ledger.csv');

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

function pctError(actual, estimate) {
  if (estimate <= 0) return 0;
  return Math.abs(actual - estimate) / estimate;
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Missing file: ${inputPath}`);
    process.exit(1);
  }

  const rows = parseCsv(fs.readFileSync(inputPath, 'utf8'));
  const completed = rows.filter((r) => r.status === 'done');
  const n = completed.length;

  const likelyErrors = completed.map((r) => pctError(Number(r.actual_hours), Number(r.likely_hours)));
  const withinWorst = completed.filter((r) => Number(r.actual_hours) <= Number(r.worst_hours)).length;
  const underBest = completed.filter((r) => Number(r.actual_hours) < Number(r.best_hours)).length;
  const overLikely = completed.filter((r) => Number(r.actual_hours) > Number(r.likely_hours)).length;

  const medianLikelyErrorPct = Math.round(median(likelyErrors) * 100);
  const meanLikelyErrorPct = Math.round((likelyErrors.reduce((a, b) => a + b, 0) / (n || 1)) * 100);
  const withinWorstPct = Math.round((withinWorst / (n || 1)) * 100);
  const underBestPct = Math.round((underBest / (n || 1)) * 100);
  const overLikelyPct = Math.round((overLikely / (n || 1)) * 100);

  console.log('Forecast KPI Report');
  console.log(`Completed tasks: ${n}`);
  console.log(`Median error vs likely: ${medianLikelyErrorPct}%`);
  console.log(`Mean error vs likely: ${meanLikelyErrorPct}%`);
  console.log(`Within worst-case bound: ${withinWorst}/${n} (${withinWorstPct}%)`);
  console.log(`Finished below best-case: ${underBest}/${n} (${underBestPct}%)`);
  console.log(`Exceeded likely estimate: ${overLikely}/${n} (${overLikelyPct}%)`);
}

main();
