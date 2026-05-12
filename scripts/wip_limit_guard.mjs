#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const backlogPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(process.cwd(), 'BACKLOG_24H_CAL2757_2026_05_11.md');
const maxInProgress = Number(process.env.MAX_IN_PROGRESS || 1);

function main() {
  if (!fs.existsSync(backlogPath)) {
    console.error(`Missing backlog file: ${backlogPath}`);
    process.exit(1);
  }

  const text = fs.readFileSync(backlogPath, 'utf8');
  const lines = text.split(/\r?\n/);

  const inProgressTasks = [];
  let currentTask = '';

  for (const line of lines) {
    const taskMatch = line.match(/^\d+\.\s+`([^`]+)`\s*-\s*(.+)$/);
    if (taskMatch) {
      currentTask = `${taskMatch[1]} - ${taskMatch[2]}`;
      continue;
    }
    if (line.includes('Status: `in_progress`') && currentTask) {
      inProgressTasks.push(currentTask);
    }
  }

  console.log('WIP Limit Guard');
  console.log(`In-progress tasks: ${inProgressTasks.length}`);
  console.log(`Max allowed: ${maxInProgress}`);

  if (inProgressTasks.length > 0) {
    console.log('\nCurrent in-progress:');
    inProgressTasks.forEach((task) => console.log(`- ${task}`));
  }

  if (inProgressTasks.length > maxInProgress) {
    console.error('\nWIP limit breached.');
    process.exit(2);
  }
}

main();
