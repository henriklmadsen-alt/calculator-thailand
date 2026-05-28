#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'reports', 'seo');

const FRESHNESS_TARGETS = [
  {
    route: '/คำนวณค่าไฟฟ้า/',
    file: 'src/pages/คำนวณค่าไฟฟ้า/index.astro',
    cadenceDays: 30,
    reason: 'Regulated electricity rates, Ft, VAT assumptions, and official-source trust.',
  },
  {
    route: '/คำนวณภาษีมูลค่าเพิ่ม/',
    file: 'src/pages/คำนวณภาษีมูลค่าเพิ่ม/index.astro',
    cadenceDays: 45,
    reason: 'VAT rate and revenue-department wording affect CTR and trust.',
  },
  {
    route: '/คำนวณค่าโอที/',
    file: 'src/pages/คำนวณค่าโอที/index.astro',
    cadenceDays: 45,
    reason: 'Labour-law assumptions need fresh official references and examples.',
  },
  {
    route: '/คำนวณผ่อนรถ/',
    file: 'src/pages/คำนวณผ่อนรถ/index.astro',
    cadenceDays: 45,
    reason: 'Affiliate-intent page where rates, examples, and insurance CTA copy should stay fresh.',
  },
  {
    route: '/คำนวณผ่อนบ้าน/',
    file: 'src/pages/คำนวณผ่อนบ้าน/index.astro',
    cadenceDays: 45,
    reason: 'Loan examples, DTI guidance, and affiliate CTA depend on current market expectations.',
  },
  {
    route: '/คำนวณอายุ/',
    file: 'src/pages/คำนวณอายุ/index.astro',
    cadenceDays: 60,
    reason: 'Evergreen page but year-specific Thai queries need periodic title/FAQ refresh.',
  },
  {
    route: '/คำนวณ-bmi/',
    file: 'src/pages/คำนวณ-bmi/index.astro',
    cadenceDays: 60,
    reason: 'Evergreen health page where definitions, disclaimers, and related links should remain current.',
  },
  {
    route: '/',
    file: 'src/pages/index.astro',
    cadenceDays: 30,
    reason: 'Homepage controls calculator discovery, internal links, and search behavior.',
  },
];

function todayBangkok() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function n(value, decimals = 0) {
  return Number(value || 0).toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

function table(headers, rows) {
  if (!rows.length) return '_No rows._';
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows,
  ].join('\n');
}

function mdCell(value, limit = 96) {
  const text = String(value || '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
  return text.length > limit ? `${text.slice(0, limit - 1)}...` : text;
}

function gitLastCommitDate(file) {
  const result = spawnSync('git', ['log', '-1', '--format=%cs', '--', file], {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
  });
  return result.status === 0 ? result.stdout.trim() : '';
}

function statMtimeDate(filePath) {
  try {
    return fs.statSync(filePath).mtime;
  } catch {
    return null;
  }
}

function daysBetween(date) {
  if (!date) return 9999;
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000)));
}

function buildQueue() {
  return FRESHNESS_TARGETS.map((target) => {
    const absolute = path.join(ROOT, target.file);
    const gitDate = gitLastCommitDate(target.file);
    const commitDate = gitDate ? new Date(`${gitDate}T00:00:00.000Z`) : null;
    const mtime = statMtimeDate(absolute);
    const sourceDate = commitDate || mtime;
    const ageDays = daysBetween(sourceDate);
    const due = ageDays >= target.cadenceDays;
    const soon = !due && ageDays >= Math.floor(target.cadenceDays * 0.75);

    return {
      ...target,
      fileExists: fs.existsSync(absolute),
      lastGitDate: gitDate || '',
      lastModified: mtime ? mtime.toISOString() : '',
      ageDays,
      status: due ? 'due' : soon ? 'soon' : 'fresh',
      nextAction: due
        ? 'Refresh title/meta, first answer block, FAQ, official source, examples, and related links.'
        : soon
          ? 'Schedule refresh in the next content sprint.'
          : 'Monitor GSC query changes and keep current.',
    };
  }).sort((a, b) => {
    const order = { due: 0, soon: 1, fresh: 2 };
    return order[a.status] - order[b.status] || b.ageDays - a.ageDays;
  });
}

function renderReport(queue, generatedDate) {
  const rows = queue.map((row) => (
    `| ${row.route} | ${row.status} | ${row.fileExists ? 'PASS' : 'FAIL'} | ${row.lastGitDate || row.lastModified || 'unknown'} | ${n(row.ageDays)} | ${n(row.cadenceDays)} | ${mdCell(row.reason, 72)} | ${mdCell(row.nextAction, 88)} |`
  ));

  return `# Content Freshness Queue - ${generatedDate}

Generated: ${new Date().toISOString()}

## Summary

- Pages monitored: ${n(queue.length)}.
- Due now: ${n(queue.filter((row) => row.status === 'due').length)}.
- Due soon: ${n(queue.filter((row) => row.status === 'soon').length)}.
- Fresh: ${n(queue.filter((row) => row.status === 'fresh').length)}.

## Refresh Queue

${table(['Route', 'Status', 'File', 'Last Update', 'Age Days', 'Cadence', 'Why It Matters', 'Next Action'], rows)}

## Refresh Standard

Every refresh should check the title, meta description, direct-answer block, FAQ wording, official citations, related calculator module, affiliate CTA relevance, and internal links from at least three related pages.
`;
}

const generatedDate = todayBangkok();
const queue = buildQueue();
const markdown = renderReport(queue, generatedDate);

fs.mkdirSync(REPORT_DIR, { recursive: true });
const latestMd = path.join(REPORT_DIR, 'content-freshness-queue-latest.md');
const latestJson = path.join(REPORT_DIR, 'content-freshness-queue-latest.json');
const datedMd = path.join(REPORT_DIR, `content-freshness-queue-${generatedDate}.md`);
fs.writeFileSync(latestMd, markdown, 'utf8');
fs.writeFileSync(datedMd, markdown, 'utf8');
fs.writeFileSync(latestJson, JSON.stringify({
  generatedAt: new Date().toISOString(),
  queue,
}, null, 2), 'utf8');

console.log(JSON.stringify({
  status: queue.some((row) => !row.fileExists) ? 'needs_attention' : 'ok',
  monitoredPages: queue.length,
  due: queue.filter((row) => row.status === 'due').length,
  soon: queue.filter((row) => row.status === 'soon').length,
  reports: { latestMd, latestJson, datedMd },
}, null, 2));

if (queue.some((row) => !row.fileExists)) {
  process.exitCode = 1;
}
