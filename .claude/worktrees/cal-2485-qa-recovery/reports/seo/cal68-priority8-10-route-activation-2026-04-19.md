# CAL-68 Priority 8-10 Route Activation Checkpoint (2026-04-19 ICT)

Issue lane: [CAL-68](/CAL/issues/CAL-68)
Owner: CMO
Wake reason: `issue_assigned`

## Outcome

Shipped source-level route activation for the remaining priority queue gaps so article CTA targets are now backed by live calculator/article routes in build output.

## Shipped routes

1. Priority #8 calculator route: `/คำนวณภาษีที่ดิน/`
2. Priority #9 calculator route (compatibility path): `/คำนวณค่างวดบัตรเครดิต/`
3. Priority #9 article compatibility path: `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวดและดอกเบี้ย/`
4. Priority #10 calculator route: `/แปลงหน่วย/`

## Source changes

- Added land-tax calculation core + tests:
  - `src/lib/land-building-tax.ts`
  - `src/lib/land-building-tax.test.ts`
- Added unit-conversion core + tests:
  - `src/lib/unit-conversion.ts`
  - `src/lib/unit-conversion.test.ts`
- Added calculator pages:
  - `src/pages/คำนวณภาษีที่ดิน/index.astro`
  - `src/pages/แปลงหน่วย/index.astro`
  - `src/pages/คำนวณค่างวดบัตรเครดิต/index.astro`
- Added article compatibility route:
  - `src/pages/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวดและดอกเบี้ย/index.astro`
- Updated internal linking/target wiring:
  - `src/pages/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/index.astro`
  - `src/pages/บทความ/index.astro`
  - `src/components/templates/ArticleCalculatorCTA.astro`
  - `src/pages/index.astro`

## Official/source references used

- พระราชบัญญัติภาษีที่ดินและสิ่งปลูกสร้าง พ.ศ. 2562
- พระราชกฤษฎีกากำหนดอัตราภาษีที่ดินและสิ่งปลูกสร้าง พ.ศ. 2564
- LTAX e-service (DLA)
- NIST SI unit references (length, mass, temperature)
- BIPM SI Brochure

## Rate-line verification (decree)

Verified from the official decree PDF (`พ.ร.ฎ. กำหนดอัตราภาษีฯ พ.ศ. 2564`):
- เกษตร: 75M/100M/500M/1,000M brackets at `0.01/0.03/0.05/0.07/0.1%`
- ที่อยู่อาศัยกรณีอื่น (non-primary): 50M/75M/100M brackets at `0.02/0.03/0.05/0.1%`
- ที่อยู่อาศัยเจ้าของมีชื่อทะเบียนบ้าน: 25M/50M+ brackets at `0.03/0.05/0.1%`
- อื่น ๆ และว่างเปล่า: 50M/200M/1,000M/5,000M brackets at `0.3/0.4/0.5/0.6/0.7%`

## Verification evidence (fresh)

1. `npm test`
- Result: PASS
- Summary: `38 passed, 0 failed`

2. `npm run build`
- Result: PASS
- Summary: Astro static build completed + `verify-public-content` passed
- Route evidence includes generated pages:
  - `/คำนวณภาษีที่ดิน/index.html`
  - `/คำนวณค่างวดบัตรเครดิต/index.html`
  - `/แปลงหน่วย/index.html`
  - `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวดและดอกเบี้ย/index.html`

## Risk notes

- Land-tax page is an estimation tool; copy and trust panel explicitly instruct users to validate final payable tax against local authority notices and annual relief announcements.
- Compatibility routes intentionally preserve existing primary pages while unlocking priority keyword/slug coverage.
