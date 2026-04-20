# CAL-177 Trust-First UX Remediation Evidence

Date: 2026-04-16 (ICT)  
Issue: `CAL-177` (parent incident `CAL-172`)

## 1) Audited High-Traffic Pages (5 URLs)

1. `/`
2. `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
3. `/คำนวณภาษีมูลค่าเพิ่ม/`
4. `/คำนวณผ่อนรถ/`
5. `/คำนวณผ่อนบ้าน/`

## 2) Before/After Screenshots (390x844)

Before (pre-remediation workspace state):
- `reports/qa/cal-177/2026-04-16/before/home-before-390x844.png`
- `reports/qa/cal-177/2026-04-16/before/tax-before-390x844.png`
- `reports/qa/cal-177/2026-04-16/before/vat-before-390x844.png`
- `reports/qa/cal-177/2026-04-16/before/vehicle-before-390x844.png`
- `reports/qa/cal-177/2026-04-16/before/mortgage-before-390x844.png`

After (post-remediation workspace state):
- `reports/qa/cal-177/2026-04-16/after/home-after-390x844.png`
- `reports/qa/cal-177/2026-04-16/after/tax-after-390x844.png`
- `reports/qa/cal-177/2026-04-16/after/vat-after-390x844.png`
- `reports/qa/cal-177/2026-04-16/after/vehicle-after-390x844.png`
- `reports/qa/cal-177/2026-04-16/after/mortgage-after-390x844.png`

## 3) Marker Scan Results

Pre-remediation marker scan:
- `reports/qa/cal-177/2026-04-16/before/marker-scan-before.json`

Post-remediation marker scan:
- `reports/qa/cal-177/2026-04-16/after/marker-scan-after.json`

Post-remediation source-level guard:
- Command: `npm run verify:public-content`
- Result: pass (no `InternalMetadataNote`, `PUBLIC_ENABLE_INTERNAL_NOTES`, `data-internal-metadata-note`, `Methodology note:`, `Last updated:` in public Astro files)

## 4) UX Structure Changes Applied

- Replaced internal-note pattern with shared public component:
  - `src/components/templates/PublicTrustPanel.astro`
- Applied trust-first block to audited surfaces:
  - `src/pages/index.astro`
  - `src/pages/คำนวณภาษีเงินได้บุคคลธรรมดา/index.astro`
  - `src/pages/คำนวณภาษีมูลค่าเพิ่ม/index.astro`
  - `src/pages/คำนวณผ่อนรถ/index.astro`
  - `src/pages/คำนวณผ่อนบ้าน/index.astro`
- Removed internal-note component:
  - `src/components/templates/InternalMetadataNote.astro`

## 5) Publish Checklist Artifact

- `reports/qa/cal-177/2026-04-16/ux-acceptance-checklist.md`

## 6) Build/Test Verification

- `npm run test` -> pass
- `npm run verify:public-content` -> pass
- `npm run build` -> pass

- Re-verified in CTO heartbeat on 2026-04-16 (ICT): npm run test, npm run verify:public-content, and npm run build all passed in the current checkout.

