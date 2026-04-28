import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  DARK_THEME_CONTRAST_PAIRS,
  contrastRatio,
  resolveEffectiveTheme,
  resolveThemePreference,
} from './theme.ts';

test('resolveThemePreference falls back to system for invalid values', () => {
  assert.equal(resolveThemePreference(undefined), 'system');
  assert.equal(resolveThemePreference(null), 'system');
  assert.equal(resolveThemePreference('unexpected'), 'system');
});

test('resolveEffectiveTheme respects explicit dark and system preference', () => {
  assert.equal(resolveEffectiveTheme('dark', false), 'dark');
  assert.equal(resolveEffectiveTheme('light', true), 'light');
  assert.equal(resolveEffectiveTheme('system', true), 'dark');
  assert.equal(resolveEffectiveTheme('system', false), 'light');
});

test('dark theme contrast pairs satisfy WCAG AA minimums', () => {
  for (const pair of DARK_THEME_CONTRAST_PAIRS) {
    const ratio = contrastRatio(pair.foreground, pair.background);
    assert.ok(
      ratio >= pair.minimumRatio,
      `${pair.label} contrast ${ratio.toFixed(2)} is below ${pair.minimumRatio}`,
    );
  }
});

test('blog article prose styles are theme-token driven for dark-mode parity', () => {
  const layoutSource = readFileSync(
    new URL('../layouts/BlogPostLayout.astro', import.meta.url),
    'utf8',
  );

  const expectedRules = [
    /\.prose h2\s*\{[^}]*color:\s*var\(--ct-text-strong\)/s,
    /\.prose h3\s*\{[^}]*color:\s*var\(--ct-text-strong\)/s,
    /\.prose p:not\(\[class\]\)\s*\{[^}]*color:\s*var\(--ct-text-muted\)/s,
    /\.prose ul:not\(\[class\]\),\s*\.prose ol:not\(\[class\]\)\s*\{[^}]*color:\s*var\(--ct-text-muted\)/s,
    /\.prose strong\s*\{[^}]*color:\s*var\(--ct-text-strong\)/s,
    /\.prose a:not\(\[class\]\)\s*\{[^}]*color:\s*var\(--ct-link\)/s,
    /\.prose a:not\(\[class\]\):hover\s*\{[^}]*color:\s*var\(--ct-link-hover\)/s,
  ];

  for (const rule of expectedRules) {
    assert.match(layoutSource, rule);
  }
});

test('dark theme stylesheet covers article CTA and table contrast classes', () => {
  const themeSource = readFileSync(
    new URL('../styles/theme.css', import.meta.url),
    'utf8',
  );

  const requiredRules = [
    /html\[data-theme='dark'\]\s+\.text-white\s*\{/s,
    /html\[data-theme='dark'\]\s+\.text-sky-900,/s,
    /html\[data-theme='dark'\]\s+\.bg-amber-50\\\/60\s*\{/s,
    /html\[data-theme='dark'\]\s+\.bg-primary-600\s*\{/s,
    /html\[data-theme='dark'\]\s+\.bg-primary-700\s*\{/s,
    /html\[data-theme='dark'\]\s+\.hover\\:bg-primary-700:hover\s*\{/s,
    /html\[data-theme='dark'\]\s+\.border-amber-100\s*\{/s,
    /html\[data-theme='dark'\]\s+\.text-yellow-700/s,
    /html\[data-theme='dark'\]\s+\.text-green-700/s,
    /html\[data-theme='dark'\]\s+\.text-orange-700/s,
    /html\[data-theme='dark'\]\s+\.prose a:not\(\[class\]\)/s,
    /html\[data-theme='dark'\]\s+\.prose a:not\(\[class\]\):hover/s,
  ];

  for (const rule of requiredRules) {
    assert.match(themeSource, rule);
  }
});

test('blog prose selectors do not override classed CTA and button elements', () => {
  const layoutSource = readFileSync(
    new URL('../layouts/BlogPostLayout.astro', import.meta.url),
    'utf8',
  );

  const requiredScopedRules = [
    /\.prose p:not\(\[class\]\)\s*\{/s,
    /\.prose ul:not\(\[class\]\),\s*\.prose ol:not\(\[class\]\)\s*\{[^}]*color:\s*var\(--ct-text-muted\)/s,
    /\.prose a:not\(\[class\]\)\s*\{/s,
    /\.prose a:not\(\[class\]\):hover\s*\{/s,
  ];

  for (const rule of requiredScopedRules) {
    assert.match(layoutSource, rule);
  }
});

test('blog layout protects mobile article templates from horizontal text overflow', () => {
  const layoutSource = readFileSync(
    new URL('../layouts/BlogPostLayout.astro', import.meta.url),
    'utf8',
  );
  const themeSource = readFileSync(
    new URL('../styles/theme.css', import.meta.url),
    'utf8',
  );

  const requiredOverflowGuards = [
    /class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 break-words"/s,
    /text-center break-words">/s,
  ];
  const requiredGlobalWrapRules = [
    /\.prose a:not\(\[class\]\),\s*\.prose code\s*\{[^}]*word-wrap:\s*break-word;[^}]*word-break:\s*break-all;/s,
  ];

  for (const rule of requiredOverflowGuards) {
    assert.match(layoutSource, rule);
  }
  for (const rule of requiredGlobalWrapRules) {
    assert.match(themeSource, rule);
  }
});

test('light theme stylesheet hardens low-contrast utility colors used by CTAs and metadata', () => {
  const themeSource = readFileSync(
    new URL('../styles/theme.css', import.meta.url),
    'utf8',
  );

  const requiredRules = [
    /\.text-primary-600\s*\{[^}]*#0369a1[^}]*!important/s,
    /\.bg-primary-600\s*\{[^}]*#0369a1[^}]*!important/s,
    /\.text-gray-400,\s*\.text-slate-400\s*\{[^}]*#64748b[^}]*!important/s,
  ];

  for (const rule of requiredRules) {
    assert.match(themeSource, rule);
  }
});

test('dark theme stylesheet defines prose contrast tokens for typography plugin surfaces', () => {
  const themeSource = readFileSync(
    new URL('../styles/theme.css', import.meta.url),
    'utf8',
  );

  assert.match(
    themeSource,
    /html\[data-theme='dark'\]\s+\.prose\s*\{[^}]*--tw-prose-body:[^}]*--tw-prose-headings:[^}]*--tw-prose-links:[^}]*--tw-prose-bold:[^}]*--tw-prose-th-borders:[^}]*--tw-prose-td-borders:[^}]*\}/s,
  );
});
