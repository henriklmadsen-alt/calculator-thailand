#!/usr/bin/env node

import { execSync } from 'node:child_process';

const checks = [
  { name: 'Error Budget Gate', cmd: 'node scripts/error_budget_gate.mjs' },
  { name: 'WIP Limit Guard', cmd: 'node scripts/wip_limit_guard.mjs' },
  { name: 'Postmortem Action Tracker', cmd: 'node scripts/postmortem_action_tracker.mjs' },
  { name: 'Forecast KPI Report', cmd: 'node scripts/forecast_kpi_report.mjs' },
];

let failed = 0;

for (const check of checks) {
  try {
    const out = execSync(check.cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
    console.log(`\n=== ${check.name}: PASS ===`);
    console.log(out);
  } catch (err) {
    failed += 1;
    const out = (err.stdout?.toString() || '') + (err.stderr?.toString() || '');
    console.log(`\n=== ${check.name}: FAIL ===`);
    console.log(out.trim());
  }
}

console.log('\n=== CEO Survival Check Summary ===');
console.log(`Total checks: ${checks.length}`);
console.log(`Failed checks: ${failed}`);
console.log(`Status: ${failed === 0 ? 'PASS' : 'FAIL'}`);

if (failed > 0) process.exit(2);
