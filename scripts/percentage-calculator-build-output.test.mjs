import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('percentage calculator page build output does not contain unresolved lib import', () => {
  const htmlPath = path.join(process.cwd(), 'dist', 'คำนวณเปอร์เซ็นต์', 'index.html');
  assert.ok(fs.existsSync(htmlPath), `Expected build output file at ${htmlPath}`);

  const html = fs.readFileSync(htmlPath, 'utf8');

  assert.equal(
    html.includes("from '../../lib/percentage-calculator'"),
    false,
    'Found unresolved client import to ../../lib/percentage-calculator in dist output',
  );
});
