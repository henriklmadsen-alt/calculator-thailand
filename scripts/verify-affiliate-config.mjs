import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const STRICT = process.argv.includes('--strict');
const ROOJAI_AFFILIATE_URL = 'https://portal.roojaipartners.com/#/23424769e701bcaa';

const REQUIRED_AFFILIATE_ENVS = [
  'AFFILIATE_URL_TTB_CASH2GO',
  'AFFILIATE_URL_KTC_BROTHER_BERM',
  'AFFILIATE_URL_NGERN_TID_LOR',
  'AFFILIATE_URL_TIPINSURE',
  'AFFILIATE_URL_UOB_TMRW',
  'AFFILIATE_URL_KRUNGSRI_SIGNATURE',
  'AFFILIATE_URL_KEPT_KRUNGSRI',
  'AFFILIATE_URL_RABBIT_CARE_HEALTH_CPL',
];

function loadLocalEnv(fileName) {
  const filePath = path.join(ROOT, fileName);
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/u);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/gu, '').trim();
  }
}

loadLocalEnv('.env');
loadLocalEnv('.env.local');

const universalAffiliateUrl = process.env.AFFILIATE_URL_UNIVERSAL?.trim() || ROOJAI_AFFILIATE_URL;
const rows = REQUIRED_AFFILIATE_ENVS.map((name) => ({
  name,
  status: process.env[name]?.trim() ? 'SET' : (universalAffiliateUrl ? 'ROOJAI_FALLBACK' : 'MISSING'),
}));
const missing = rows.filter((row) => row.status === 'MISSING');

for (const row of rows) {
  console.log(`${row.name}=${row.status}`);
}

console.log(`missing=${missing.length}`);

if (STRICT && missing.length > 0) {
  process.exitCode = 1;
}
