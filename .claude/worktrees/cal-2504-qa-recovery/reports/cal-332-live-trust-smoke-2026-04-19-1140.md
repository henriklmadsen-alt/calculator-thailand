# CAL-332 Live-Site Trust Smoke Check

- Run window (ICT): 2026-04-19 11:20-11:40
- Agent: Release QA Engineer Alpha
- Scope source: CAL-332 hourly custom-domain trust smoke check 2026-04-19 11:15 ICT
- Escalation chain: CTO
- Pending comment delta: none in wake payload; executed full smoke matrix directly

## Verdict

FAIL (live trust surfaces are not healthy)

## Critical Defects (Release Blockers)

1. Apex hostname is still unavailable.
   - URL: `https://kamnuanlek.com/`
   - HTTP smoke:
     - `https://kamnuanlek.com/` -> timeout/unreachable (`fetch failed`)
     - `https://kamnuanlek.com/__release` -> timeout/unreachable (`fetch failed`)
   - Visual smoke on apex failed `10/10` captures (desktop + mobile across required routes).
   - Recommended owner: [CAL-197](/CAL/issues/CAL-197)

2. Release attestation endpoint `/__release` is unavailable on active release hosts.
   - `https://www.kamnuanlek.com/__release` -> `404`
   - `https://calculator-thailand-production.up.railway.app/__release` -> `404`
   - `verify-railway-release` timed out at `45s` on both hosts (exit code `1` each).
   - Expected SHA: `cd6486339ca6382aeab2cf26a17f221e851a3083`
   - Recommended owner: [CAL-197](/CAL/issues/CAL-197)

3. Transfer-fee calculator route remains broken on production hosts.
   - Route: `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
   - `www` status: `404`
   - Railway status: `404`
   - Recommended owner: [CAL-273](/CAL/issues/CAL-273)

4. Source/live calculator inventory drift remains open.
   - Local calculator routes: `14`
   - Live calculator routes in sitemap: `17`
   - Missing from live sitemap: `1`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
   - Extra on live sitemap: `4`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%81%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%99/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%B5%E0%B8%A2%E0%B8%93/`
   - Recommended owner: [CAL-273](/CAL/issues/CAL-273)

## User-Visible Readability Defects (High Risk, Non-Blocking)

1. Dark-mode contrast failures persist across home, calculator, and article surfaces.
   - Viewports: desktop + mobile
   - Mode: dark
   - Selectors: `main h1`, `main h2`, `main p`
   - Minimum measured ratio: `1.05` (below 4.5 threshold)

2. Additional dark-mode hero/body contrast weakness observed on home content copy.
   - Selector: `main p`
   - Minimum measured ratio: `1.23`

## Passed Checks

1. Thai formula validation passed.
   - Domains covered: Revenue Department, BOT, SSO, Land Department, MEA/PEA
   - Result: `8/8` scenarios passed

2. Local functional + edge regression passed.
   - Result: `49/49` tests passed

3. `www` visual matrix capture passed on required route set.
   - Result: `14/14` captures completed

4. Mojibake scan passed on sampled trust surfaces.
   - Result: no mojibake patterns detected in sampled DOM text

## Evidence Artifacts

- `reports/cal-332-local-regression-2026-04-19-1120.txt`
- `reports/cal-332-thai-formula-validation-2026-04-19T04-21-46Z.json`
- `reports/cal-332-http-smoke-2026-04-19T04-22-47Z.json`
- `reports/cal-332-route-inventory-2026-04-19T04-24-36Z.json`
- `reports/cal-332-release-gate-verify-2026-04-19-1120.txt`
- `reports/cal-332-live-visual-www-2026-04-19-1120/manifest.json`
- `reports/cal-332-live-visual-apex-2026-04-19-1120/manifest.json`
- `reports/cal-332-live-visual-apex-2026-04-19-1120.log.txt`
- `reports/cal-332-contrast-mojibake-2026-04-19T04-35-59Z/contrast-mojibake-report.json`
- `reports/cal-332-contrast-fail-details-2026-04-19T04-35-59Z.json`
