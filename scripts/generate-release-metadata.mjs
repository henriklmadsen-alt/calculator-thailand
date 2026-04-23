#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const OUTPUT_DIR = 'public';
const OUTPUT_FILE = `${OUTPUT_DIR}/__release.json`;

function getCurrentSha() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
  } catch (error) {
    console.error('Failed to get current git SHA:', error.message);
    process.exit(1);
  }
}

function generateReleaseMetadata() {
  const sha = getCurrentSha();
  const timestamp = new Date().toISOString();

  const metadata = {
    sha,
    timestamp,
    version: '1.0.0',
  };

  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(metadata, null, 2));

  console.log(`Generated release metadata: ${OUTPUT_FILE}`);
  console.log(`  SHA: ${sha}`);
  console.log(`  Timestamp: ${timestamp}`);
}

generateReleaseMetadata();
