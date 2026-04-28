#!/usr/bin/env node

import { pathToFileURL } from 'node:url';

const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000;
const DEFAULT_INTERVAL_MS = 15 * 1000;
const DEFAULT_RELEASE_PATH = '/__release';

export function normalizeSha(value) {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

export function commitsMatch(expectedSha, deployedSha) {
  const expected = normalizeSha(expectedSha);
  const deployed = normalizeSha(deployedSha);

  if (!expected || !deployed) return false;
  if (expected === deployed) return true;
  return expected.startsWith(deployed) || deployed.startsWith(expected);
}

function toInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseArgs(argv) {
  const args = new Map();
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;

    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args.set(key, next);
      i += 1;
      continue;
    }
    args.set(key, 'true');
  }

  const siteUrl = args.get('site-url');
  if (!siteUrl) {
    throw new Error('Missing required argument: --site-url <url>');
  }

  return {
    siteUrl,
    releasePath: args.get('release-path') || DEFAULT_RELEASE_PATH,
    expectedSha: args.get('expected-sha') || '',
    timeoutMs: toInt(args.get('timeout-ms'), DEFAULT_TIMEOUT_MS),
    intervalMs: toInt(args.get('interval-ms'), DEFAULT_INTERVAL_MS),
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildReleaseUrl(siteUrl, releasePath) {
  const base = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
  const path = releasePath.startsWith('/') ? releasePath : `/${releasePath}`;
  return `${base}${path}`;
}

async function fetchReleaseMetadata(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from ${url}`);
    }

    const payload = await response.json();
    if (!payload || typeof payload !== 'object') {
      throw new Error(`Invalid JSON payload from ${url}`);
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForReleaseConfirmation({ siteUrl, releasePath, expectedSha, timeoutMs, intervalMs }) {
  const releaseUrl = buildReleaseUrl(siteUrl, releasePath);
  const expected = normalizeSha(expectedSha);
  const deadline = Date.now() + timeoutMs;

  let attempt = 0;
  let lastError = null;
  let lastPayload = null;

  while (Date.now() <= deadline) {
    attempt += 1;
    try {
      const payload = await fetchReleaseMetadata(releaseUrl);
      lastPayload = payload;
      const deployed = normalizeSha(payload.gitCommit);

      if (!expected) {
        return {
          releaseUrl,
          attempt,
          payload,
          matched: true,
          expectedSha: '',
        };
      }

      if (commitsMatch(expected, deployed)) {
        return {
          releaseUrl,
          attempt,
          payload,
          matched: true,
          expectedSha: expected,
        };
      }

      lastError = new Error(
        `Commit mismatch. Expected ${expected}, received ${deployed || 'empty'}`
      );
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    if (Date.now() + intervalMs > deadline) {
      break;
    }

    await delay(intervalMs);
  }

  const details = [
    `Release confirmation timed out after ${timeoutMs}ms.`,
    `URL: ${releaseUrl}`,
    expected ? `Expected SHA: ${expected}` : 'Expected SHA: not provided',
    lastPayload ? `Last payload: ${JSON.stringify(lastPayload)}` : 'Last payload: none',
    lastError ? `Last error: ${lastError.message}` : 'Last error: none',
  ].join('\n');

  throw new Error(details);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const result = await waitForReleaseConfirmation(options);
  const commit = normalizeSha(result.payload.gitCommit) || 'unknown';

  const summary = [
    'Railway release confirmation passed.',
    `URL: ${result.releaseUrl}`,
    result.expectedSha ? `Expected SHA: ${result.expectedSha}` : 'Expected SHA: not provided',
    `Deployed SHA: ${commit}`,
    `Attempts: ${result.attempt}`,
  ].join('\n');

  console.log(summary);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
