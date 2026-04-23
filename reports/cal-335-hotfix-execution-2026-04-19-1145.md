# CAL-335 Hotfix Execution Report (2026-04-19 11:45 ICT)

Issue: [CAL-335](/CAL/issues/CAL-335)
Parent execution issue: [CAL-273](/CAL/issues/CAL-273)

## Scope handled

- Reproduced live parity defects for transfer-fee route and selector mismatch.
- Added regression test coverage for required route/selector parity.
- Implemented selector compatibility fix for income calculator (`#res-income-ratio`) while preserving legacy selector wiring.
- Rebuilt and re-verified source/built/live parity evidence.

## Root cause

- `origin/master` route inventory is missing approved calculator route directories now present in workspace:
  - `คำนวณค่าโอนบ้าน`
  - `คำนวณเปอร์เซ็นต์`
- Live production sitemap still serves stale calculator set (17 routes) that excludes `/คำนวณค่าโอนบ้าน/` and includes legacy-only calculators.
- Income calculator page lacked required selector `#res-income-ratio` in source and live HTML.

Detailed artifact: `reports/cal-335-hotfix-evidence-2026-04-19T04-44-19-185Z.json`

## Code changes in this heartbeat

- `src/pages/คำนวณเงินเดือนสุทธิ/index.astro`
  - Added active selector `id="res-income-ratio"`.
  - Kept `id="res-effective-rate"` as hidden legacy mirror.
  - Updated render logic to set both selectors from the same computed value.
- `scripts/cal-335-route-selector-parity.test.mjs`
  - Added regression checks for:
    - presence of transfer-fee and percentage calculator route files
    - required selectors `#res-income-ratio`, `#res-total-interest`, `#res-next-balance`
    - homepage links to transfer-fee and percentage calculators

## Reproduction + verification evidence

### Live reproduction (before fix/deploy)

- `https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/` => `404`
- `https://calculator-thailand-production.up.railway.app/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/` => `404`
- Salary page selector check on both hosts: `#res-income-ratio` missing
- Credit card selectors on both hosts: `#res-total-interest` and `#res-next-balance` present

### Tests (RED -> GREEN)

- RED (expected failure):
  - `node --test scripts/cal-335-route-selector-parity.test.mjs`
  - Failed on missing `#res-income-ratio`
- GREEN (after fix):
  - `node --test scripts/cal-335-route-selector-parity.test.mjs`
  - 4/4 passing

### Build + baseline checks

- `npm run build` => success
  - Static routes include `/คำนวณค่าโอนบ้าน/` and `/คำนวณเปอร์เซ็นต์/`
- `npm run test:release-gate` => success (5/5 passing)

### Local build selector proof

- Built salary page includes:
  - `id="res-income-ratio"` (required)
  - `id="res-effective-rate"` (legacy mirror)
- Built credit-card page includes:
  - `id="res-total-interest"`
  - `id="res-next-balance"`

## Current blocker / next required action

- Live route parity remains blocked until CTO-sequenced deploy picks up this source state.
- Required next action:
  - deploy from branch containing transfer-fee + percentage routes and selector fix
  - rerun live route inventory + selector probes post-deploy
  - attach post-deploy proof back to [CAL-273](/CAL/issues/CAL-273), [CAL-197](/CAL/issues/CAL-197), and [CAL-246](/CAL/issues/CAL-246)
