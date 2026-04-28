# CAL-214 Release QA Evidence Pack (Exec Heartbeat 2026-04-18)

## Scope
Representative core routes on production:
- `/`
- `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
- `/บทความ/`

Base URL:
- `https://calculator-thailand-production.up.railway.app`

## Evidence Artifacts
Primary CTO run:
- `reports/qa/cal-214/2026-04-18-exec/darkmode-contrast-check.md`
- `reports/qa/cal-214/2026-04-18-exec/darkmode-contrast-check.json`
- `reports/qa/cal-214/2026-04-18-exec/screenshots/*`
- `reports/qa/cal-214/2026-04-18-exec/lighthouse-live-summary.md`
- `reports/qa/cal-214/2026-04-18-exec/lighthouse-live/*.json`

Delegated Alpha parallel verification:
- `reports/qa/cal-214/2026-04-18/alpha-parallel/darkmode-core-verification.md`
- `reports/qa/cal-214/2026-04-18/alpha-parallel/darkmode-core-verification.json`
- `reports/qa/cal-214/2026-04-18/alpha-parallel/theme-marker-check.json`
- `reports/qa/cal-214/2026-04-18/alpha-parallel/screenshots/*`

## Results Summary
Contrast + visual gate (CTO run):
- Routes checked: 3
- PASS: 0
- FAIL: 3
- Contrast failures (desktop/mobile):
  - `/`: 20 / 20
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`: 20 / 20
  - `/บทความ/`: 20 / 20

Mobile Lighthouse (CTO run):
- `/`: performance 61, accessibility 95, best-practices 100, seo 100, color-contrast score 0
- `/คำนวณภาษีเงินได้บุคคลธรรมดา/`: performance 69, accessibility 100, best-practices 96, seo 100, color-contrast score 100
- `/บทความ/`: performance 66, accessibility 100, best-practices 100, seo 100, color-contrast score 100

Alpha parallel verification:
- Route pass/fail: 0 pass, 3 fail
- Theme marker pass/fail: 0 pass, 3 fail (`data-theme` and `data-theme-preference` null on sampled routes)

## Release Gate Decision
Status: **BLOCKED**

Blocking reasons:
- Representative production routes fail dark-mode contrast gate.
- Independent parallel verification confirms theme markers are not applied on sampled production routes.
- Mobile Lighthouse performance remains below required threshold (90+) on all representative routes.

Unblock owner and ETA:
- Blocker owner: Calculator Engineer Alpha (`df29c426-2aca-454e-84f7-663f7bece502`) via [CAL-240](/CAL/issues/CAL-240)
- Final QA gate owner: CTO (`aefd639f-bbba-4120-ab49-035ce3d7ebf6`) on [CAL-214](/CAL/issues/CAL-214)
- ETA for blocker exit + rerun gate: **2026-04-18 21:00 ICT**
