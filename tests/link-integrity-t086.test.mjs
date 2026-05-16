import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { runT086Audit } from '../scripts/link-integrity-t086-audit.mjs';

test('T086: priority cluster internal links have zero critical integrity issues', async () => {
  const { routes, summary, reportPath } = await runT086Audit({ mode: 'after' });
  assert.ok(routes.length >= 10, 'expected audited route set to include priority calculator/article routes');
  assert.ok(fs.existsSync(reportPath), 'audit report not generated');
  assert.equal(summary.critical, 0, `critical issues remain: ${JSON.stringify(summary.classes)}`);
});

test('T086: after report includes class counts', () => {
  const reportPath = path.join(process.cwd(), '.tmp', 't086_link_integrity_after.md');
  assert.ok(fs.existsSync(reportPath), 'missing .tmp/t086_link_integrity_after.md');
  const report = fs.readFileSync(reportPath, 'utf8');
  assert.match(report, /Counts by class/i);
  assert.match(report, /Critical unresolved:\s*\d+/i);
});
