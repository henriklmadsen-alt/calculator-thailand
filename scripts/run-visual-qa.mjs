#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { chromium } from 'playwright';

const DEFAULT_OUTPUT_DIR = '.tmp/post-deploy-visual-qa';
const DEFAULT_TIMEOUT_MS = 45_000;
const DEFAULT_SETTLE_MS = 1_250;
const DEFAULT_PATHS = ['/'];

const VIEWPORT_PRESETS = [
  {
    name: 'desktop',
    contextOptions: {
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
    },
  },
  {
    name: 'mobile',
    contextOptions: {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
  },
];

export function normalizeSiteUrl(value) {
  const input = typeof value === 'string' ? value.trim() : '';
  if (!input) {
    throw new Error('Missing required argument: --site-url <url>');
  }
  const parsed = new URL(input);
  return parsed.href.endsWith('/') ? parsed.href.slice(0, -1) : parsed.href;
}

export function normalizeRoutePath(value) {
  const input = typeof value === 'string' ? value.trim() : '';
  if (!input) return '/';
  if (input.startsWith('http://') || input.startsWith('https://')) return input;
  if (input.startsWith('/')) return input;
  return `/${input}`;
}

export function parsePathList(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return [...DEFAULT_PATHS];
  }

  const unique = new Set();
  const routes = value
    .split(',')
    .map((token) => normalizeRoutePath(token))
    .filter(Boolean)
    .filter((route) => {
      if (unique.has(route)) return false;
      unique.add(route);
      return true;
    });

  return routes.length > 0 ? routes : [...DEFAULT_PATHS];
}

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function makeCaptureSlug(routeOrUrl, index) {
  const normalized = normalizeRoutePath(routeOrUrl);
  const fallback = `target-${String(index + 1).padStart(2, '0')}`;

  if (normalized === '/') return 'home';

  let rawPath = normalized;
  try {
    const parsed = new URL(normalized);
    rawPath = `${parsed.pathname}${parsed.search}`;
  } catch {}

  const encoded = encodeURIComponent(rawPath).replace(/%/g, '').toLowerCase();
  const trimmed = encoded.slice(0, 80);
  return trimmed || fallback;
}

export function buildTargetUrl(siteUrl, routePath) {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const normalizedPath = normalizeRoutePath(routePath);

  if (normalizedPath.startsWith('http://') || normalizedPath.startsWith('https://')) {
    return new URL(normalizedPath).href;
  }

  return new URL(normalizedPath, `${normalizedSiteUrl}/`).href;
}

export function buildCaptureTargets(siteUrl, routePaths) {
  const unique = new Set();
  const targets = [];

  routePaths.forEach((routePath, index) => {
    const url = buildTargetUrl(siteUrl, routePath);
    if (unique.has(url)) return;
    unique.add(url);

    targets.push({
      routePath: normalizeRoutePath(routePath),
      url,
      slug: makeCaptureSlug(routePath, index),
    });
  });

  return targets;
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

  return {
    siteUrl: normalizeSiteUrl(args.get('site-url')),
    routePaths: parsePathList(args.get('paths')),
    timeoutMs: toPositiveInt(args.get('timeout-ms'), DEFAULT_TIMEOUT_MS),
    settleMs: toPositiveInt(args.get('settle-ms'), DEFAULT_SETTLE_MS),
    outputDir: args.get('output-dir') || DEFAULT_OUTPUT_DIR,
  };
}

function captureFilename({ targetIndex, slug, viewportName }) {
  return `${String(targetIndex + 1).padStart(2, '0')}-${slug}-${viewportName}.png`;
}

async function runVisualQa(options) {
  const targets = buildCaptureTargets(options.siteUrl, options.routePaths);
  const expectedCaptures = targets.length * VIEWPORT_PRESETS.length;

  if (expectedCaptures === 0) {
    throw new Error('No routes available for visual QA capture.');
  }

  await fs.mkdir(options.outputDir, { recursive: true });

  const captures = [];
  const failures = [];
  const startedAt = new Date().toISOString();

  const browser = await chromium.launch({ headless: true });
  try {
    for (let targetIndex = 0; targetIndex < targets.length; targetIndex += 1) {
      const target = targets[targetIndex];

      for (const viewport of VIEWPORT_PRESETS) {
        const context = await browser.newContext({
          ...viewport.contextOptions,
          locale: 'th-TH',
          timezoneId: 'Asia/Bangkok',
        });

        const screenshotPath = path.join(
          options.outputDir,
          captureFilename({
            targetIndex,
            slug: target.slug,
            viewportName: viewport.name,
          })
        );

        try {
          const page = await context.newPage();
          await page.goto(target.url, { waitUntil: 'networkidle', timeout: options.timeoutMs });
          await page.waitForTimeout(options.settleMs);
          await page.screenshot({
            path: screenshotPath,
            fullPage: true,
          });

          captures.push({
            status: 'ok',
            viewport: viewport.name,
            routePath: target.routePath,
            url: target.url,
            screenshotPath,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          failures.push(
            `Capture failed (${viewport.name}) for ${target.url}: ${message}`
          );
          captures.push({
            status: 'failed',
            viewport: viewport.name,
            routePath: target.routePath,
            url: target.url,
            screenshotPath,
            error: message,
          });
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }

  const finishedAt = new Date().toISOString();
  const successfulCaptures = captures.filter((entry) => entry.status === 'ok').length;

  const manifest = {
    generatedAt: finishedAt,
    startedAt,
    siteUrl: options.siteUrl,
    routePaths: options.routePaths,
    expectedCaptures,
    successfulCaptures,
    failedCaptures: expectedCaptures - successfulCaptures,
    captures,
  };

  const manifestPath = path.join(options.outputDir, 'manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  if (failures.length > 0) {
    throw new Error(
      [
        `Visual QA failed: ${failures.length}/${expectedCaptures} captures did not complete.`,
        ...failures,
        `Manifest: ${manifestPath}`,
      ].join('\n')
    );
  }

  const summary = [
    'Post-deploy visual QA passed.',
    `Site URL: ${options.siteUrl}`,
    `Routes: ${options.routePaths.join(', ')}`,
    `Captures: ${successfulCaptures}/${expectedCaptures}`,
    `Manifest: ${manifestPath}`,
  ].join('\n');

  console.log(summary);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  await runVisualQa(options);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
