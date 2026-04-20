# CAL-214 Dark Mode WCAG Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add production dark mode across core pages with WCAG-grade contrast while preserving the current layout structure.

**Architecture:** Implement theme resolution and contrast validation in a shared utility module, then apply theme state and dark palette overrides inside the two shared layouts (`BaseLayout` and `BlogPostLayout`) so all calculator/article pages inherit behavior. Use CSS-variable tokens plus utility remaps for common Tailwind classes to avoid redesigning each page template.

**Tech Stack:** Astro 4, Tailwind utilities, Node built-in test runner (`node --test`)

---

### Task 1: Theme Utility + Failing Tests

**Files:**
- Create: `src/lib/theme.test.ts`
- Create: `src/lib/theme.ts`

- [ ] **Step 1: Write failing tests for theme resolution and WCAG contrast**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveThemePreference,
  resolveEffectiveTheme,
  contrastRatio,
  DARK_THEME_CONTRAST_PAIRS,
} from './theme.ts';

test('resolveThemePreference returns system for invalid value', () => {
  assert.equal(resolveThemePreference('unexpected-value'), 'system');
});

test('resolveEffectiveTheme prefers explicit dark preference', () => {
  assert.equal(resolveEffectiveTheme('dark', false), 'dark');
});

test('all configured dark-theme pairs meet WCAG AA contrast for normal text', () => {
  for (const pair of DARK_THEME_CONTRAST_PAIRS) {
    assert.ok(
      contrastRatio(pair.foreground, pair.background) >= pair.minimumRatio,
      `${pair.label} failed contrast check`,
    );
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/theme.test.ts`
Expected: FAIL because `src/lib/theme.ts` does not exist yet.

- [ ] **Step 3: Write minimal implementation in `src/lib/theme.ts`**

```ts
export type ThemePreference = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

export function resolveThemePreference(value: string | null | undefined): ThemePreference {
  // ...
}

export function resolveEffectiveTheme(preference: ThemePreference, systemPrefersDark: boolean): EffectiveTheme {
  // ...
}

export function contrastRatio(foregroundHex: string, backgroundHex: string): number {
  // ...
}

export const DARK_THEME_CONTRAST_PAIRS = [
  // ...
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/theme.test.ts`
Expected: PASS.


### Task 2: Base Layout Dark Mode Wiring

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Reuse: `src/lib/theme.ts` constants for palette documentation consistency

- [ ] **Step 1: Add failing assertions for header toggle presence in generated HTML**

```ts
// Optional smoke-check assertion in existing QA script or snapshot test:
// verify markup includes [data-theme-toggle] and [data-theme-label].
```

- [ ] **Step 2: Run check to confirm failure**

Run: `npm run build`
Expected: current output has no theme toggle markers yet.

- [ ] **Step 3: Implement base layout support**

```astro
<script is:inline>
  // Set data-theme before paint using localStorage + prefers-color-scheme.
</script>

<button type="button" data-theme-toggle ...>
  <span data-theme-label>โหมดมืด</span>
</button>

<style>
  :root { /* light tokens */ }
  html[data-theme="dark"] { /* dark tokens */ }
  html[data-theme="dark"] .text-gray-900 { color: var(--ct-text-strong) !important; }
  /* ...utility remaps for common classes... */
</style>
```

- [ ] **Step 4: Run build check**

Run: `npm run build`
Expected: PASS with layout changes compiled.


### Task 3: Blog Layout Dark Mode Wiring

**Files:**
- Modify: `src/layouts/BlogPostLayout.astro`

- [ ] **Step 1: Add failing expectation (manual spot check)**

Run: `npm run build` + open article page preview and confirm no theme toggle exists yet (pre-change baseline).

- [ ] **Step 2: Add same theme toggle + dark utility remaps in blog layout**

```astro
<!-- mirror theme boot script -->
<!-- add theme toggle control in header actions -->
<!-- add dark overrides for article prose / cards / disclaimer / FAQ -->
```

- [ ] **Step 3: Verify with build + smoke checks**

Run: `npm run build`
Expected: PASS.


### Task 4: Verification Gate

**Files:**
- Modify: none (verification only)

- [ ] **Step 1: Run targeted unit tests**

Run: `npm test -- src/lib/theme.test.ts`
Expected: PASS.

- [ ] **Step 2: Run full library tests**

Run: `npm test`
Expected: PASS for all `src/lib/*.test.ts`.

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: PASS with no build errors.

- [ ] **Step 4: Manual contrast sanity checks**

Run (example): open key pages in browser and validate readable text on dark backgrounds for:
- Home (`/`)
- One calculator (`/คำนวณภาษีเงินได้บุคคลธรรมดา/`)
- One article (`/บทความ/`)

- [ ] **Step 5: Commit**

```bash
git add src/lib/theme.ts src/lib/theme.test.ts src/layouts/BaseLayout.astro src/layouts/BlogPostLayout.astro docs/superpowers/plans/2026-04-17-cal-214-dark-mode-wcag.md
git commit -m "feat: add WCAG-grade dark mode across shared layouts"
```
