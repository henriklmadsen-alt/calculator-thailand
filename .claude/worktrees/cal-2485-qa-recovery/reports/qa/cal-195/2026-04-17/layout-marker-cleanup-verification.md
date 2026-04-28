# CAL-195 Layout Marker Cleanup Verification

Date: 2026-04-17 (ICT)
Scope: Remove residual language-toggle UI artifacts from shared layouts while keeping Kamnuanlek + Thai branding.

## Files Updated
- src/layouts/BaseLayout.astro
- src/layouts/BlogPostLayout.astro

## Changes
1. Removed legacy global helpers not used by runtime UI:
- `window.getLangMode`
- `window.setLangMode`

2. Removed Thai language status badge from shared header nav in both layouts to avoid language-toggle affordance.

## Verification
- Source marker scan:
  - Command: `rg -n "ภาษาไทย|getLangMode|setLangMode|data-lang-mode-btn|language_mode_toggle|>EN<" src/layouts src/pages -S`
  - Result: no matches

- Build + content guard:
  - Command: `npm run build`
  - Result: pass (`astro build` + `verify-public-content` passed)

- Built output marker scan:
  - Command: `rg -n "ภาษาไทย|getLangMode|setLangMode|data-lang-mode-btn|language_mode_toggle|>EN<" dist -S`
  - Result: no matches
