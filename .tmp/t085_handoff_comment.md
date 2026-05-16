[HANDOFF_TO_CMO]
T085 completed and validated.

Scope delivered:
- Built route-level mobile readability baseline for top 20 calculator routes.
- Implemented targeted, calculator-scoped mobile readability hardening (no broad global override):
  - `ct-page-calculator` scope on calculator pages via `BaseLayout`
  - 16px form control text size on mobile
  - 44px minimum tap targets for controls and submit CTA
  - bottom padding/scroll-margin guards to reduce sticky overlap risk
- Added deterministic regression coverage for the above mobile guards.
- Produced before/after artifacts with fail-count delta and unresolved item status.

Files delivered:
- `scripts/t085-mobile-readability-audit.mjs`
- `tests/mobile-readability-t085.test.mjs`
- `src/layouts/BaseLayout.astro`
- `src/styles/theme.css`
- `.tmp/t085_mobile_readability_baseline.md`
- `.tmp/t085_mobile_readability_after.md`
- `.tmp/t085_live_checks.md`

Acceptance evidence:
1) Regression test
- Command: `node --test tests/mobile-readability-t085.test.mjs`
- Result: PASS (3/3)

2) Build
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

3) Railway deploy
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1`
- Result: SUCCESS
- Deployment ID: `f5349308-d9ab-4e3d-a2d6-56be8da692b9`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=f5349308-d9ab-4e3d-a2d6-56be8da692b9&`

4) Live mobile checks (both domains, representative calculator routes)
- Domains checked:
  - `https://www.kamnuanlek.com`
  - `https://kamnuanlek.com`
- Routes checked:
  - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2/`
  - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%B4/`
  - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%97%E0%B8%B5/`
- Result: all HTTP 200, primary CTA reachable=true, result block readable=true, calculator scope present=true.
- Evidence artifact: `.tmp/t085_live_checks.md`

5) Baseline vs after artifacts
- Baseline: `.tmp/t085_mobile_readability_baseline.md`
  - failing_routes=20, total_failed_checks=88
- After: `.tmp/t085_mobile_readability_after.md`
  - failing_routes=0, total_failed_checks=0
  - unresolved items: none

Ready for independent QA and next P0 assignment.
