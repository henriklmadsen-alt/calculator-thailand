# CAL-195 Brand/UI Rollout Evidence

Date: 2026-04-16 (ICT)
Issue: CAL-195

## Scope Delivered

1. Removed EN toggle logic and legacy language-mode markers from shared layouts.
2. Rolled out Kamnuanlek + Thai naming across live-facing page titles/descriptions and site identity strings.
3. Deployed current release to Railway production.

## Deployment

- Command: ./scripts/deploy-railway.ps1 -Message "CAL-195 remove EN toggle + Kamnuanlek naming rollout"
- Build logs: https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=36058a8d-0de8-429c-a72c-3eeeb35e909b&
- Result: Deploy complete

## Live Health Check

- Command: ./scripts/smoke-check-live.ps1 -BaseUrl "https://calculator-thailand-production.up.railway.app"
- Result: pass (200 on homepage + key calculator routes)

## Desktop/Mobile Before-After Screenshots

Before:
- eports/qa/cal-195/2026-04-16/branding-before/home-before-desktop-1440x900.png
- eports/qa/cal-195/2026-04-16/branding-before/home-before-mobile-390x844.png
- eports/qa/cal-195/2026-04-16/branding-before/article-credit-card-before-desktop-1440x900.png
- eports/qa/cal-195/2026-04-16/branding-before/article-credit-card-before-mobile-390x844.png

After:
- eports/qa/cal-195/2026-04-16/branding-after/home-after-desktop-1440x900.png
- eports/qa/cal-195/2026-04-16/branding-after/home-after-mobile-390x844.png
- eports/qa/cal-195/2026-04-16/branding-after/article-credit-card-after-desktop-1440x900.png
- eports/qa/cal-195/2026-04-16/branding-after/article-credit-card-after-mobile-390x844.png

## SEO Regression Check (Titles + Canonicals)

- Report: eports/qa/cal-195/2026-04-16/seo-regression-check-live.md
- Data: eports/qa/cal-195/2026-04-16/seo-regression-check-live.json
- Summary: Title OK = True and Canonical OK = True on sampled homepage, calculator page, and article page.

## EN Toggle Removal Verification (Live HTML Markers)

- Report: eports/qa/cal-195/2026-04-16/en-toggle-marker-check-live.md
- Data: eports/qa/cal-195/2026-04-16/en-toggle-marker-check-live.json
- Summary: all marker checks are Present = false for >EN<, data-lang-mode-btn, ct.lang_mode, language_mode_toggle.
