import fs from 'node:fs';
import path from 'node:path';
import { runCwvT084Audit } from './cwv-t084-audit.mjs';
import { runT085MobileReadabilityAudit } from './t085-mobile-readability-audit.mjs';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'reports', 'seo');
const CWV_REPORT = path.join(REPORT_DIR, 'cwv-weekly-t084-latest.md');
const MOBILE_REPORT = path.join(REPORT_DIR, 'cwv-weekly-t085-mobile-latest.md');
const SUMMARY_MD = path.join(REPORT_DIR, 'cwv-weekly-monitor-latest.md');
const SUMMARY_JSON = path.join(REPORT_DIR, 'cwv-weekly-monitor-latest.json');

function countCwvUnresolved(results) {
  return results.filter((row) => row.clsFlags.length > 0 || row.blockingStylesheetCount > 0 || row.blockingScriptCount > 0).length;
}

function countMobileFailures(results) {
  return results.filter((row) => row.failures.length > 0).length;
}

function writeSummary(payload) {
  const lines = [
    '# Weekly Core Web Vitals Monitor',
    '',
    `Generated: ${payload.generatedAt}`,
    `CWV routes audited: ${payload.cwv.routes}`,
    `CWV unresolved routes: ${payload.cwv.unresolvedRoutes}`,
    `Mobile routes audited: ${payload.mobile.routes}`,
    `Mobile failing routes: ${payload.mobile.failingRoutes}`,
    '',
    '| Check | Result | Report |',
    '|---|---:|---|',
    `| T084 CWV static signals | ${payload.cwv.unresolvedRoutes === 0 ? 'PASS' : 'FAIL'} | ${path.relative(ROOT, CWV_REPORT)} |`,
    `| T085 mobile readability | ${payload.mobile.failingRoutes === 0 ? 'PASS' : 'FAIL'} | ${path.relative(ROOT, MOBILE_REPORT)} |`,
    '',
    'This monitor is intended to run weekly and after large UI/layout changes. It depends on a fresh `npm run build` output in `dist/`.',
    '',
  ];

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(SUMMARY_MD, lines.join('\n'), 'utf8');
  fs.writeFileSync(SUMMARY_JSON, JSON.stringify(payload, null, 2), 'utf8');
}

const cwv = runCwvT084Audit({ outPath: CWV_REPORT });
const mobile = runT085MobileReadabilityAudit({ outPath: MOBILE_REPORT });

const payload = {
  generatedAt: new Date().toISOString(),
  cwv: {
    routes: cwv.results.length,
    unresolvedRoutes: countCwvUnresolved(cwv.results),
    report: CWV_REPORT,
  },
  mobile: {
    routes: mobile.results.length,
    failingRoutes: countMobileFailures(mobile.results),
    report: MOBILE_REPORT,
  },
  summary: {
    markdown: SUMMARY_MD,
    json: SUMMARY_JSON,
  },
};

writeSummary(payload);

console.log(JSON.stringify({
  status: payload.cwv.unresolvedRoutes === 0 && payload.mobile.failingRoutes === 0 ? 'ok' : 'needs_attention',
  cwvUnresolvedRoutes: payload.cwv.unresolvedRoutes,
  mobileFailingRoutes: payload.mobile.failingRoutes,
  reports: {
    markdown: SUMMARY_MD,
    json: SUMMARY_JSON,
  },
}, null, 2));

if (payload.cwv.unresolvedRoutes > 0 || payload.mobile.failingRoutes > 0) {
  process.exitCode = 1;
}
