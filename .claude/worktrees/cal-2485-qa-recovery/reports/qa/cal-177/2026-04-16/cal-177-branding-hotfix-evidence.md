# CAL-177 Branding Hotfix Evidence (Board Request)

Date: 2026-04-16 (ICT)
Issue: CAL-177

## Scope Delivered

1. Removed `EN` button from shared navigation UI.
2. Replaced site identity from `Calculator Thailand` to `Kamnuanlek` + Thai brand text (`เครื่องคำนวณไทย`) in shared header/footer layouts.
3. Applied in both shared layouts:
   - `src/layouts/BaseLayout.astro`
   - `src/layouts/BlogPostLayout.astro`

## Deployment

- Railway deploy command: `./scripts/deploy-railway.ps1 -Message "CAL-177 branding update: Kamnuanlek + remove EN button"`
- Build log: https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=d831d782-87c6-41ba-996e-6f4ae6eb5943&
- Deploy result: success (healthcheck passed)

## Before/After Screenshots (Live Production)

Before:
- `reports/qa/cal-177/2026-04-16/branding-before/home-before-live-390x844.png`
- `reports/qa/cal-177/2026-04-16/branding-before/tax-before-live-390x844.png`

After:
- `reports/qa/cal-177/2026-04-16/branding-after/home-after-live-390x844.png`
- `reports/qa/cal-177/2026-04-16/branding-after/tax-after-live-390x844.png`
- `reports/qa/cal-177/2026-04-16/branding-after/article-after-live-valid-390x844.png` (site-wide propagation spot-check on article layout)

## Live URL Confirmation (Canonical Domain)

Verified URLs:
- https://calculator-thailand-production.up.railway.app/
- https://calculator-thailand-production.up.railway.app/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2/
- https://calculator-thailand-production.up.railway.app/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95-%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%A2%E0%B8%B1%E0%B8%87%E0%B9%84%E0%B8%87-%E0%B8%88%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B8%82%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%95%E0%B9%88%E0%B8%B3-2569/

Verification results:
- HTTP 200 on all URLs.
- `Kamnuanlek` present in rendered HTML on all URLs.
- Thai brand text `เครื่องคำนวณไทย` present in rendered HTML on all URLs.
- No `EN` button marker (`>EN<`) in rendered HTML.
- No `data-lang-mode-btn="th-en"` in rendered HTML.

## Local Verification

- `npm run test` passed
- `npm run verify:public-content` passed
- `npm run build` passed
