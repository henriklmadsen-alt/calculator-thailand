#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DEFAULT_SITE_URL = 'https://www.kamnuanlek.com/';

function loadEnv(fileName) {
  const filePath = path.join(ROOT, fileName);
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, raw] = match;
    if (process.env[key]) continue;
    process.env[key] = raw.replace(/^['"]|['"]$/g, '').trim();
  }
}

loadEnv('.env');
loadEnv('.env.local');
loadEnv('.env.gsc');

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function parseServiceAccount() {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON || '';
  if (!raw.trim()) return { configured: false, valid: false, reason: 'missing' };
  try {
    const parsed = JSON.parse(raw);
    const valid = Boolean(parsed.client_email && parsed.private_key);
    return { configured: true, valid, reason: valid ? 'ok' : 'missing client_email/private_key' };
  } catch {
    return { configured: true, valid: false, reason: 'invalid JSON' };
  }
}

const siteUrl = process.env.GSC_SITE_URL || DEFAULT_SITE_URL;
const distIndex = readIfExists(path.join(ROOT, 'dist/index.html'));
const sourceLayout = readIfExists(path.join(ROOT, 'src/layouts/BaseLayout.astro'));
const sitemap = readIfExists(path.join(ROOT, 'dist/sitemap.xml'));
const robots = readIfExists(path.join(ROOT, 'dist/robots.txt'));
const serviceAccount = parseServiceAccount();

const checks = [
  {
    name: 'gsc_site_url',
    status: /^https:\/\/www\.kamnuanlek\.com\/?$/.test(siteUrl) ? 'PASS' : 'WARN',
    detail: siteUrl,
  },
  {
    name: 'service_account_json',
    status: serviceAccount.valid ? 'PASS' : 'WARN',
    detail: serviceAccount.reason,
  },
  {
    name: 'google_site_verification_meta',
    status: /google-site-verification/.test(distIndex || sourceLayout) ? 'PASS' : 'FAIL',
    detail: distIndex ? 'dist/index.html' : 'src/layouts/BaseLayout.astro',
  },
  {
    name: 'sitemap_generated',
    status: sitemap.includes('https://www.kamnuanlek.com') ? 'PASS' : 'WARN',
    detail: sitemap ? 'dist/sitemap.xml' : 'run npm run build first',
  },
  {
    name: 'robots_references_sitemap',
    status: robots.includes('Sitemap:') ? 'PASS' : 'WARN',
    detail: robots ? 'dist/robots.txt' : 'robots.txt not generated in dist',
  },
];

for (const check of checks) {
  console.log(`${check.name}=${check.status} ${check.detail}`);
}

const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length > 0) {
  process.exitCode = 1;
}
