import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { runT083Audit } from '../scripts/indexability-t083-audit.mjs';

test('T083: priority routes have no noindex/robots/canonical conflicts', async () => {
  const { routes, results, unresolvedCount, reportPath } = await runT083Audit();
  assert.ok(routes.length >= 5, 'expected priority route set to include article cluster + calculator routes');
  assert.ok(fs.existsSync(reportPath), 'audit report was not generated');
  assert.equal(unresolvedCount, 0, `unresolved conflicts: ${results.flatMap((r) => r.conflicts).join(', ')}`);
});

test('T083: report documents conflict summary line', () => {
  const reportPath = path.join(process.cwd(), '.tmp', 't083_indexability_audit.md');
  assert.ok(fs.existsSync(reportPath), 'missing .tmp/t083_indexability_audit.md');
  const report = fs.readFileSync(reportPath, 'utf8');
  assert.match(report, /Unresolved conflicts:\s*\d+/u);
});
