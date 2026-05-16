import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const baseLayoutPath = path.join(root, 'src', 'layouts', 'BaseLayout.astro');
const themePath = path.join(root, 'src', 'styles', 'theme.css');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('T085: calculator pages receive mobile-readability scope class in BaseLayout', () => {
  const source = read(baseLayoutPath);
  assert.match(
    source,
    /<body\s+class:list=\{\['font-thai text-gray-900 flex flex-col',\s*isCalculatorPage && 'ct-page-calculator'\]\}>/u,
  );
});

test('T085: mobile control readability guard enforces 44px minimum tap size', () => {
  const css = read(themePath);
  assert.match(css, /@media\s*\(max-width:\s*767px\)[\s\S]*\.ct-page-calculator input/u);
  assert.match(css, /\.ct-page-calculator input[\s\S]*min-height:\s*44px/u);
  assert.match(css, /\.ct-page-calculator input[\s\S]*font-size:\s*16px/u);
});

test('T085: mobile submit CTA and results flow guards are present', () => {
  const css = read(themePath);
  assert.match(css, /\.ct-page-calculator button\[type='submit'\][\s\S]*min-height:\s*44px/u);
  assert.match(css, /\.ct-page-calculator \[id\$='results'\][\s\S]*scroll-margin-top:\s*5rem/u);
  assert.match(css, /\.ct-page-calculator \.ct-layout-main[\s\S]*padding-bottom:\s*5\.5rem/u);
});
