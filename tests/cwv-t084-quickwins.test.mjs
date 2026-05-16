import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { runCwvT084Audit } from '../scripts/cwv-t084-audit.mjs';

const root = process.cwd();
const baseLayoutPath = path.join(root, 'src', 'layouts', 'BaseLayout.astro');
const blogLayoutPath = path.join(root, 'src', 'layouts', 'BlogPostLayout.astro');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('T084: BaseLayout uses non-blocking Google Fonts pattern', () => {
  const source = read(baseLayoutPath);
  assert.match(
    source,
    /rel="stylesheet"[\s\S]*?media="print"[\s\S]*?onload="this\.media='all'"/u,
    'BaseLayout should load Google Fonts with media=print + onload swap',
  );
  assert.match(
    source,
    /<noscript>\s*<link[^>]+fonts\.googleapis\.com\/css2\?family=Noto\+Sans\+Thai/u,
    'BaseLayout should include noscript font fallback',
  );
});

test('T084: BlogPostLayout uses non-blocking Google Fonts pattern', () => {
  const source = read(blogLayoutPath);
  assert.match(
    source,
    /rel="stylesheet"[\s\S]*?media="print"[\s\S]*?onload="this\.media='all'"/u,
    'BlogPostLayout should load Google Fonts with media=print + onload swap',
  );
  assert.match(
    source,
    /<noscript>\s*<link[^>]+fonts\.googleapis\.com\/css2\?family=Noto\+Sans\+Thai/u,
    'BlogPostLayout should include noscript font fallback',
  );
});

test('T084: audited top routes no longer flag fixed-widget heuristic', () => {
  const reportPath = path.join(root, '.tmp', 't084_cwv_quickwins_test.md');
  const { results } = runCwvT084Audit({ outPath: reportPath });
  assert.equal(results.length, 20, 'expected 20 audited routes');

  const fixedFlags = results.filter((row) =>
    row.clsFlags.some((flag) => flag.startsWith('fixed_widgets:')),
  );
  assert.equal(fixedFlags.length, 0, 'expected fixed_widgets heuristic to be zero on audited routes');
});
