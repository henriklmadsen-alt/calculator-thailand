# CAL-293 Live-Site Trust Smoke Check

- Run window (ICT): 2026-04-19 06:22-06:36
- Agent: Release QA Engineer Alpha
- Scope source: CAL-293 hourly live-site trust smoke check 2026-04-19 06:19 ICT

## Verdict

FAIL (release trust is not healthy)

## Critical Defects (Release Blockers)

1. Apex hostname `https://kamnuanlek.com` is unreachable.
   - HTTP smoke timed out at 20s for `/` and `/__release`.
   - Visual QA failed `10/10` captures (desktop+mobile across all required routes).
   - Evidence:
     - `reports/cal-293-http-smoke-2026-04-19-0622.json`
     - `reports/cal-293-live-visual-apex-2026-04-19-0626/manifest.json`

2. Release attestation endpoint `/__release` is unavailable on both trust surfaces.
   - `https://www.kamnuanlek.com/__release` => `404`
   - `https://calculator-thailand-production.up.railway.app/__release` => `404`
   - `verify-railway-release` timed out for both hosts because `/__release` never returned valid metadata.
   - Evidence:
     - `reports/cal-293-http-smoke-2026-04-19-0622.json`
     - `reports/cal-293-release-gate-verify-2026-04-19-0626.txt`

3. Calculator transfer-fee route is broken in production.
   - Route: `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
   - `https://www.kamnuanlek.com/...` => `404`
   - `https://calculator-thailand-production.up.railway.app/...` => `404`
   - Evidence:
     - `reports/cal-293-http-smoke-2026-04-19-0622.json`
     - `reports/cal-293-route-inventory-2026-04-19-0626.json`

4. Route inventory/sitemap drift is unresolved.
   - Local calculator routes: `14`
   - Live calculator routes: `17`
   - Missing from live: `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
   - Extra on live:
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%B5%E0%B8%A2%E0%B8%93/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%81%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%99/`
   - Evidence:
     - `reports/cal-293-route-inventory-2026-04-19-0626.json`

## Passed Checks

1. Required visual matrix on `https://www.kamnuanlek.com` passed.
   - Routes: `/`, electricity calculator route, salary calculator route, article index route, and electricity-article route.
   - Viewports: desktop + mobile
   - Result: `10/10` captures passed
   - Evidence: `reports/cal-293-live-visual-www-2026-04-19-0626/manifest.json`

2. Thai formula validation scenarios passed.
   - Domains covered: Revenue Department, MEA/PEA, Land Department
   - Result: `6/6` scenarios passed
   - Evidence: `reports/cal-293-thai-formula-validation-2026-04-19-0626.json`

3. Local regression/build gates passed.
   - `npm run test:release-gate` -> pass (5)
   - `npm run test:visual-qa` -> pass (6)
   - `npm run test:no-idle-watchdog` -> pass (8)
   - `node --test src/lib/*.test.ts` -> pass (23)
   - `npm run build` -> pass
   - Evidence: `reports/cal-293-local-regression-2026-04-19-0626.txt`

## Recommended Owner Actions

- Primary next owner: CTO + platform/infrastructure owner.
- Fix order:
  1. Restore apex availability or enforce reliable apex -> www redirect.
  2. Restore `/__release` attestation endpoint on active production trust surfaces.
  3. Restore transfer-fee calculator route to `200` or remove all references consistently.
  4. Reconcile live sitemap with source route inventory and remove stale live-only calculator slugs.

