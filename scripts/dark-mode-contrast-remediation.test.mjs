import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const LAYOUT_FILES = [
  'src/layouts/BaseLayout.astro',
  'src/layouts/BlogPostLayout.astro',
];

async function readLayout(relativePath) {
  const absolutePath = resolve(process.cwd(), relativePath);
  return readFile(absolutePath, 'utf8');
}

test('core layouts define contrast-safe light and dark color overrides', async () => {
  for (const layoutPath of LAYOUT_FILES) {
    const layout = await readLayout(layoutPath);

    assert.match(
      layout,
      /<style is:global>/,
      `${layoutPath} should keep contrast remediation styles global so slotted page content is covered`
    );
    assert.match(
      layout,
      /main \.bg-primary-600 \{\s*background-color: #0369a1;\s*}/,
      `${layoutPath} should promote primary button backgrounds to AA-safe contrast`
    );
    assert.match(
      layout,
      /main \.text-primary-600 \{\s*color: #0369a1;\s*}/,
      `${layoutPath} should promote primary text to AA-safe contrast`
    );
    assert.match(
      layout,
      /main \.text-gray-400 \{\s*color: #64748b;\s*}/,
      `${layoutPath} should promote muted gray text to AA-safe contrast`
    );
    assert.match(
      layout,
      /@media \(prefers-color-scheme: dark\)/,
      `${layoutPath} should define dark-mode overrides`
    );
    assert.match(
      layout,
      /\.text-gray-400 \{\s*color: #cbd5e1;\s*}/,
      `${layoutPath} should keep muted text readable in dark mode`
    );
  }
});
