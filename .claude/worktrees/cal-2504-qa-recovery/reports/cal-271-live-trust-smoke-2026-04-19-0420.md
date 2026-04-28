# CAL-271 Live-Site Trust Smoke Check

- Run window (ICT): 2026-04-19 04:20+
- Agent: Release QA Engineer Alpha
- Scope source: CAL-271 issue description

## Verdict

FAIL (release trust not safe right now)

## Critical Defects (Release Blockers)

1. Apex hostname `https://kamnuanlek.com` is unreachable.
   - `curl -I -v --max-time 20 https://kamnuanlek.com/` timed out (`curl: (28)`).
   - Visual QA on apex failed `10/10` captures (desktop+mobile across all 5 required routes).
   - Evidence: `reports/cal-271-live-visual-apex-2026-04-19-0420/manifest.json`

2. Release attestation endpoint is unavailable on live trust surfaces.
   - `https://www.kamnuanlek.com/__release` => `404`
   - `https://calculator-thailand-production.up.railway.app/__release` => `404`
   - SHA verification command timed out because `/__release` is unavailable.
   - Evidence: `reports/cal-271-release-gate-verify-2026-04-19-0420.txt`

3. Calculator route inventory mismatch and active 404.
   - Source route `/คำนวณค่าโอนบ้าน/` is missing from live sitemap and returns `404` on both hosts.
   - Live has extra calculator routes not present in source route inventory:
     - `/คำนวณเงินเกษียณ/`
     - `/คำนวณค่าธรรมเนียมโอนบ้าน/`
     - `/คำนวณค่าน้ำ/`
     - `/คำนวณอัตราแลกเปลี่ยน/`
   - Evidence: `reports/cal-271-route-inventory-2026-04-19-0420.json`

## Passed Checks

1. Required visual matrix on `https://www.kamnuanlek.com` passed.
   - Routes: `/`, `/คำนวณค่าไฟฟ้า/`, `/คำนวณเงินเดือนสุทธิ/`, `/บทความ/`, `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/`
   - Viewports: desktop + mobile
   - Result: `10/10` captures passed
   - Evidence: `reports/cal-271-live-visual-www-2026-04-19-0420/manifest.json`

2. Thai text/mojibake scan on required `www` routes.
   - Result: `0` mojibake hits across light/dark x desktop/mobile runs
   - Evidence: `reports/cal-271-trust-scan-2026-04-19-0420/report.json`

3. Readability/contrast checks on required `www` routes.
   - Result: `0` contrast failures on sampled text selectors across light/dark x desktop/mobile
   - Evidence: `reports/cal-271-contrast-check-2026-04-19-0420.json`

4. Formula validation (Thai authority-aligned scenarios) passed.
   - Domains covered: Revenue Department, MEA/PEA, Land Department
   - Result: `6/6` scenarios passed
   - Evidence: `reports/cal-271-thai-formula-validation-2026-04-19-0420.json`

5. Automated regression tests/build passed locally.
   - `npm run test:release-gate` -> pass (5)
   - `npm run test:visual-qa` -> pass (6)
   - `npm run test:no-idle-watchdog` -> pass (8)
   - `node --test src/lib/*.test.ts` -> pass (23)
   - `npm run build` -> pass

## Recommended Owner Actions

- Primary next owner: CTO + platform/infrastructure owner.
- Fix order:
  1. Restore apex hostname availability or enforce working 301 to `www`.
  2. Restore `/__release` attestation endpoint on active production trust surface.
  3. Resolve route inventory drift and restore `/คำนวณค่าโอนบ้าน/` to `200` (or deprecate in source + links consistently).

