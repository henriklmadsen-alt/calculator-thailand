#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const outDir = path.join(process.cwd(), 'reports', 'ceo-autopilot');
const stamp = new Date().toISOString().replace(/[:]/g, '-');
const outPath = path.join(outDir, `WEEKLY_CEO_OPS_REVIEW_${stamp}.md`);

function run(command) {
  return execSync(command, { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] }).toString();
}

function extract(text, pattern, fallback = 'n/a') {
  const m = text.match(pattern);
  return m ? m[1] : fallback;
}

function main() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const dora = run('node scripts/dora_scorecard.mjs');
  const gate = run('node scripts/error_budget_gate.mjs');
  const forecast = run('node scripts/forecast_kpi_report.mjs');
  const wip = run('node scripts/wip_limit_guard.mjs');
  const postmortem = run('node scripts/postmortem_action_tracker.mjs');

  const deployments7d = extract(dora, /Deployments \(7d\):\s+([0-9]+)/);
  const leadMedian = extract(dora, /Lead time median \(hours\):\s+([0-9.]+)/);
  const weightedCfr = extract(dora, /Change failure rate \(% weighted\):\s+([0-9.]+)/);
  const gateStatus = extract(gate, /Gate:\s+(PASS|FAIL)/);
  const medianError = extract(forecast, /Median error vs likely:\s+([0-9]+%)/);
  const wipCount = extract(wip, /In-progress tasks:\s+([0-9]+)/);
  const openActions = extract(postmortem, /Open actions:\s+([0-9]+)/);
  const overdueActions = extract(postmortem, /Overdue actions:\s+([0-9]+)/);

  const report = `# Weekly CEO Ops Review

Generated at: ${new Date().toISOString()}

## Executive Metrics
1. Deployments (7d): ${deployments7d}
2. Lead time median (hours): ${leadMedian}
3. Weighted CFR (%): ${weightedCfr}
4. Error-budget gate: ${gateStatus}
5. Forecast median error: ${medianError}
6. Active WIP count: ${wipCount}
7. Postmortem open actions: ${openActions}
8. Postmortem overdue actions: ${overdueActions}

## Raw Evidence

### DORA
\`\`\`text
${dora.trim()}
\`\`\`

### Error Budget Gate
\`\`\`text
${gate.trim()}
\`\`\`

### Forecast KPI
\`\`\`text
${forecast.trim()}
\`\`\`

### WIP Guard
\`\`\`text
${wip.trim()}
\`\`\`

### Postmortem Tracker
\`\`\`text
${postmortem.trim()}
\`\`\`
`;

  fs.writeFileSync(outPath, report, 'utf8');
  console.log(`Weekly review written: ${outPath}`);
}

main();
