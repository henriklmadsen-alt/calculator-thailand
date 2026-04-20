# CAL-246 Inventory Regression Gate — Cycle 04

Date: 2026-04-19 14:30 UTC
Reporter: Release QA Engineer Alpha
Status: **PARTIAL PASS — 3 release blockers remain**

## Source Inventory (GitHub master equivalent)

Source pages: **22** (20 calculators + บทความ + แปลงหน่วย)
Built sitemap entries: **48** (calculators + articles + utility pages)
Build status: **PASS** (`npm run build` — 48 pages in 3.37s, zero errors)

## Live Inventory (https://www.kamnuanlek.com)

Live sitemap entries: **38** (10 fewer than source build)
Live calculator route checks: **17/20 PASS, 3 FAIL (404)**

## Missing Routes on Live (Release Blockers)

| # | Route | Source | Live HTTP | Live Sitemap | Verdict |
|---|-------|--------|-----------|--------------|---------|
| 1 | `/คำนวณค่างวดบัตรเครดิต/` | exists | 404 | missing | **FAIL** |
| 2 | `/คำนวณภาษีที่ดิน/` | exists | 404 | missing | **FAIL** |
| 3 | `/คำนวณวันคลอด/` | exists | 404 | missing | **FAIL** |
| 4 | `/แปลงหน่วย/` | exists | 404 | missing | **FAIL** |

## Resolved Issues (Previously Blocking)

- **Mojibake**: RESOLVED. Live header brand subtitle now shows clean `เครื่องคำนวณไทย` (no garbled text).
- **Mojibake in footer**: NOT detected in current live HTML.

## Sitemap Domain Mismatch (Non-Blocking, SEO Issue)

Live sitemap-index.xml references:
```
https://calculator-thailand-production.up.railway.app/sitemap-0.xml
```
Should reference: `https://www.kamnuanlek.com/sitemap-0.xml`

All sitemap `<loc>` entries use the Railway origin URL instead of the custom domain. This causes search engines to index the Railway URL rather than the canonical custom domain.

## Calculator Route Check Matrix (All 20)

| Route | Live HTTP | Verdict |
|-------|-----------|---------|
| `/คำนวณ-bmi/` | 200 | PASS |
| `/คำนวณค่างวดบัตรเครดิต/` | 404 | **FAIL** |
| `/คำนวณค่าธรรมเนียมโอนบ้าน/` | 200 | PASS |
| `/คำนวณค่าน้ำ/` | 200 | PASS |
| `/คำนวณค่าโอที/` | 200 | PASS |
| `/คำนวณค่าไฟฟ้า/` | 200 | PASS |
| `/คำนวณดอกเบี้ยบัตรเครดิต/` | 200 | PASS |
| `/คำนวณดอกเบี้ยเงินฝาก/` | 200 | PASS |
| `/คำนวณผ่อนกู้/` | 200 | PASS |
| `/คำนวณผ่อนบ้าน/` | 200 | PASS |
| `/คำนวณผ่อนรถ/` | 200 | PASS |
| `/คำนวณภาษีที่ดิน/` | 404 | **FAIL** |
| `/คำนวณภาษีมูลค่าเพิ่ม/` | 200 | PASS |
| `/คำนวณภาษีเงินได้บุคคลธรรมดา/` | 200 | PASS |
| `/คำนวณวันคลอด/` | 404 | **FAIL** |
| `/คำนวณอัตราแลกเปลี่ยน/` | 200 | PASS |
| `/คำนวณอายุ/` | 200 | PASS |
| `/คำนวณเงินเกษียณ/` | 200 | PASS |
| `/คำนวณเงินเดือนสุทธิ/` | 200 | PASS |
| `/คำนวณเปอร์เซ็นต์/` | 200 | PASS |

## Local Build Verification

- `npm run build`: PASS (48 pages, 3.37s)
- All 20 calculator pages + บทความ + แปลงหน่วย built successfully
- Thai text in dist/index.html: clean (no mojibake)
- Source-to-build parity: 100%

## Root Cause

Live production is serving a **stale deployment artifact** that predates the addition of:
- คำนวณค่างวดบัตรเครดิต (credit card installment calculator)
- คำนวณภาษีที่ดิน (land tax calculator)
- คำนวณวันคลอด (due date calculator)
- แปลงหน่วย (unit converter)

CAL-335 hotfix evidence confirms local tests pass. The missing routes will resolve once CAL-197 completes the production redeployment.

## CAL-335 Evidence Handoff Acknowledged

Received evidence from CAL-335:
- Income selector compatibility fix (hotfix) completed
- `node --test scripts/cal-335-route-selector-parity.test.mjs` => 4/4 pass
- `npm run build` => pass
- Confirmed: fix is in source, not yet deployed to live

## Gate Verdict

**RELEASE BLOCKED** until:
1. CAL-197 completes production redeployment with current source
2. Post-deploy verification confirms all 20 calculator routes return 200
3. Sitemap domain corrected to use `www.kamnuanlek.com`

## Reusable Post-Deploy Checklist

After CAL-197 deploys, execute immediately:
1. HTTP HEAD check all 20 calculator routes + /บทความ/ + /แปลงหน่วย/ = 22 routes
2. Verify live sitemap-0.xml references www.kamnuanlek.com (not Railway origin)
3. Verify sitemap entry count >= 48
4. Spot-check Thai text rendering (header brand subtitle = `เครื่องคำนวณไทย`)
5. Verify no mojibake markers (Ã, Â sequences) in HTML source
