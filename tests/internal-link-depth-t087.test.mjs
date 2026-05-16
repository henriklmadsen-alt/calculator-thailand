import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { runT087DepthAudit } from '../scripts/internal-link-depth-t087-audit.mjs';

test('T087: priority routes are reachable within max depth 3', async () => {
  const { summary, reportPath, priorityRoutes } = await runT087DepthAudit({ mode: 'after' });
  assert.ok(priorityRoutes.length >= 10, 'expected non-trivial audited priority set');
  assert.ok(fs.existsSync(reportPath), 'after report was not generated');
  assert.equal(summary.unresolved, 0, `unresolved depth issues remain: ${summary.unresolved}`);
});

test('T087: after report documents unresolved summary', () => {
  const reportPath = path.join(process.cwd(), '.tmp', 't087_depth_after.md');
  assert.ok(fs.existsSync(reportPath), 'missing .tmp/t087_depth_after.md');
  const report = fs.readFileSync(reportPath, 'utf8');
  assert.match(report, /Unresolved priority routes:/i);
});
