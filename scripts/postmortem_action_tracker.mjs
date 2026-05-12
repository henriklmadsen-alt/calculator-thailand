#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const actionPath = path.join(process.cwd(), 'reports', 'ceo-autopilot', 'postmortem-actions.csv');

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

function main() {
  if (!fs.existsSync(actionPath)) {
    console.error(`Missing file: ${actionPath}`);
    process.exit(1);
  }

  const rows = parseCsv(fs.readFileSync(actionPath, 'utf8'));
  const now = new Date();
  const open = rows.filter((r) => (r.status || '').toLowerCase() !== 'done');
  const overdue = open.filter((r) => {
    const due = new Date(`${r.due_date}T23:59:59+07:00`);
    return Number.isFinite(due.getTime()) && due < now;
  });

  console.log('Postmortem Action Tracker');
  console.log(`Total actions: ${rows.length}`);
  console.log(`Open actions: ${open.length}`);
  console.log(`Overdue actions: ${overdue.length}`);

  if (overdue.length > 0) {
    console.log('\nOverdue items:');
    overdue.forEach((r) => {
      console.log(`- ${r.action_id} | due ${r.due_date} | ${r.action}`);
    });
    process.exit(2);
  }
}

main();
