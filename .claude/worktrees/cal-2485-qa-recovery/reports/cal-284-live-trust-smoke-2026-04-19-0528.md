# CAL-284 Live-Site Trust Smoke Check

- Run window (ICT): 2026-04-19 05:28-05:38
- Agent: Release QA Engineer Alpha
- Scope source: CAL-284 hourly live-site trust smoke check

## Verdict

FAIL (release trust is not healthy)

## Critical Defects (Release Blockers)

1. Apex hostname `https://kamnuanlek.com` is unreachable.
   - HTTP smoke timed out for `/` and `/__release` at 20s.
   - Visual QA failed `10/10` captures (desktop+mobile across all required routes).
   - Evidence:
     - `reports/cal-284-http-smoke-2026-04-19-0531.json`
     - `reports/cal-284-live-visual-apex-2026-04-19-0533/manifest.json`

2. Release attestation endpoint `/__release` is unavailable on live trust surfaces.
   - `https://www.kamnuanlek.com/__release` => `404`
   - `https://calculator-thailand-production.up.railway.app/__release` => `404`
   - `verify-railway-release` timed out because `/__release` stays unavailable.
   - Evidence:
     - `reports/cal-284-http-smoke-2026-04-19-0531.json`
     - `reports/cal-284-release-gate-verify-2026-04-19-0535.txt`

3. Calculator route `/คำนวณค่าโอนบ้าน/` is still broken in production.
   - `https://www.kamnuanlek.com/คำนวณค่าโอนบ้าน/` => `404`
   - `https://calculator-thailand-production.up.railway.app/คำนวณค่าโอนบ้าน/` => `404`
   - Evidence:
     - `reports/cal-284-http-smoke-2026-04-19-0531.json`
     - `reports/cal-284-route-inventory-2026-04-19-0538.json`

4. Route inventory/sitemap drift remains unresolved.
   - Local calculator routes: `14`
   - Live calculator routes: `12`
   - Missing from live sitemap: `/คำนวณค่าไฟฟ้า/`, `/คำนวณค่าโอที/`, `/คำนวณค่าโอนบ้าน/`, `/คำนวณเปอร์เซ็นต์/`
   - Extra on live sitemap: `/คำนวณค่าธรรมเนียมโอนบ้าน/`, `/คำนวณอัตราแลกเปลี่ยน/`
   - Evidence:
     - `reports/cal-284-route-inventory-2026-04-19-0538.json`

## Passed Checks

1. Required visual matrix on `https://www.kamnuanlek.com` passed.
   - Routes: `/`, `/คำนวณค่าไฟฟ้า/`, `/คำนวณเงินเดือนสุทธิ/`, `/บทความ/`, `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/`
   - Viewports: desktop + mobile
   - Result: `10/10` captures passed
   - Evidence: `reports/cal-284-live-visual-www-2026-04-19-0532/manifest.json`

2. Thai formula validation scenarios passed.
   - Domains covered: Revenue Department, MEA/PEA, Land Department
   - Result: `6/6` scenarios passed
   - Evidence: `reports/cal-284-thai-formula-validation-2026-04-19-0531.json`

3. Local regression/build gates passed.
   - `npm run test:release-gate` -> pass (5)
   - `npm run test:visual-qa` -> pass (6)
   - `npm run test:no-idle-watchdog` -> pass (8)
   - `node --test src/lib/*.test.ts` -> pass (23)
   - `npm run build` -> pass
   - Evidence: `reports/cal-284-local-regression-2026-04-19-0535.txt`

## Recommended Owner Actions

- Primary next owner: CTO + platform/infrastructure owner.
- Fix order:
  1. Restore apex availability or enforce reliable apex -> www redirect.
  2. Restore `/__release` attestation endpoint on active production trust surfaces.
  3. Restore `/คำนวณค่าโอนบ้าน/` to `200` or remove all references consistently.
  4. Reconcile live sitemap to source route inventory and remove stale live-only calculator slugs.
