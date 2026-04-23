# CAL-307 Live-Site Trust Smoke Check

- Run window (ICT): 2026-04-19 08:32-08:48
- Agent: Release QA Engineer Alpha
- Scope source: CAL-307 hourly live-site trust smoke check 2026-04-19 08:29 ICT
- Escalation chain: CTO

## Verdict

FAIL (release trust is not healthy)

## Critical Defects (Release Blockers)

1. Apex hostname `https://kamnuanlek.com` is still unavailable.
   - HTTP smoke:
     - `https://kamnuanlek.com/` -> timeout (`fetch failed`)
     - `https://kamnuanlek.com/__release` -> timeout (`fetch failed`)
   - Visual QA on apex failed `10/10` captures (desktop+mobile across required routes).
   - Evidence:
     - `reports/cal-307-http-smoke-2026-04-19-0832.json`
     - `reports/cal-307-live-visual-apex-2026-04-19-0838/manifest.json`

2. Release attestation endpoint `/__release` is unavailable on active trust surfaces.
   - `https://www.kamnuanlek.com/__release` -> `404`
   - `https://calculator-thailand-production.up.railway.app/__release` -> `404`
   - `verify-railway-release` timed out (90s) on both hosts because `/__release` never returned metadata.
   - Evidence:
     - `reports/cal-307-http-smoke-2026-04-19-0832.json`
     - `reports/cal-307-release-gate-verify-2026-04-19-0838.txt`

3. Transfer-fee calculator route remains broken on production hosts.
   - Route: `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
   - `www` status: `404`
   - Railway status: `404`
   - Evidence:
     - `reports/cal-307-http-smoke-2026-04-19-0832.json`
     - `reports/cal-307-route-inventory-2026-04-19-0838.json`

4. Source/live calculator inventory drift is unresolved.
   - Local calculator routes: `14`
   - Live calculator routes: `17`
   - Missing from live:
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
   - Extra on live:
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%B5%E0%B8%A2%E0%B8%93/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%81%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%99/`
   - Evidence:
     - `reports/cal-307-route-inventory-2026-04-19-0838.json`

## Passed Checks

1. `www` mobile/desktop visual spot matrix passed.
   - Routes: `/`, electricity calculator, salary calculator, article index, electricity article.
   - Result: `10/10` captures passed.
   - Evidence:
     - `reports/cal-307-live-visual-www-2026-04-19-0838/manifest.json`

2. Thai formula validation passed.
   - Domains covered: Revenue Department, MEA/PEA, Land Department.
   - Result: `6/6` scenarios passed.
   - Evidence:
     - `reports/cal-307-thai-formula-validation-2026-04-19-0838.json`

3. Baseline live route availability passed on non-blocked routes.
   - `https://www.kamnuanlek.com/` -> `200`
   - `https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/` -> `200`
   - `https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%B4/` -> `200`
   - `https://calculator-thailand-production.up.railway.app/` -> `200`
   - `https://calculator-thailand-production.up.railway.app/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/` -> `200`
   - Evidence:
     - `reports/cal-307-http-smoke-2026-04-19-0832.json`

## Recommended Owner Actions

1. Restore apex availability or enforce stable apex -> www redirect.
2. Restore `/__release` endpoint on all active production trust surfaces.
3. Restore transfer-fee route to `200` or remove it consistently from all live references.
4. Reconcile live sitemap against source calculator inventory and remove stale live-only calculator slugs.
