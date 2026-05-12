#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const outputDir = path.join(repoRoot, 'reports', 'ceo-autopilot');
const llmsPath = path.join(repoRoot, 'public', 'llms.txt');
const day = new Date().toISOString().slice(0, 10);
const limit = 20;

const fallbackPriorityUrls = [
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%B9%E0%B9%89/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%A3%E0%B8%96/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%B4/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%97%E0%B8%B5/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%9D%E0%B8%B2%E0%B8%81/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/',
  'https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-bmi/'
];

function extractCandidateUrlsFromLlms() {
  if (!fs.existsSync(llmsPath)) return fallbackPriorityUrls;
  const content = fs.readFileSync(llmsPath, 'utf8');
  const urls = [];
  const markdownLinkRegex = /\((https:\/\/www\.kamnuanlek\.com\/[^)\s]+)\)/g;
  let match;
  while ((match = markdownLinkRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  const deduped = [...new Set(urls)];
  return deduped.length >= limit ? deduped : [...new Set([...deduped, ...fallbackPriorityUrls])];
}

async function fetchStatus(url) {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow' });
    return res.status;
  } catch {
    return 0;
  }
}

async function main() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const candidates = extractCandidateUrlsFromLlms();
  const checked = [];
  for (const url of candidates) {
    const status = await fetchStatus(url);
    checked.push({ url, status });
  }

  const selected = checked.filter((x) => x.status === 200).slice(0, limit);
  const queuePath = path.join(outputDir, `top20-indexation-queue-${day}.txt`);
  const auditPath = path.join(outputDir, `top20-indexation-audit-${day}.json`);

  fs.writeFileSync(queuePath, selected.map((x) => x.url).join('\n') + '\n', 'utf8');
  fs.writeFileSync(
    auditPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        candidateCount: candidates.length,
        selectedCount: selected.length,
        selected,
        non200: checked.filter((x) => x.status !== 200),
      },
      null,
      2,
    ) + '\n',
    'utf8',
  );

  if (selected.length < limit) {
    console.error(`Only ${selected.length}/${limit} priority URLs are live (HTTP 200).`);
    process.exitCode = 2;
  }

  console.log(`Queue written: ${queuePath}`);
  console.log(`Audit written: ${auditPath}`);
  console.log(`Selected URLs: ${selected.length}`);
}

main();
