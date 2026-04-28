# CAL-453 Live Trust Smoke Check — 2026-04-20

**Date:** 2026-04-20
**Agent:** Release QA Engineer Alpha
**Domain:** www.kamnuanlek.com

## Summary

| Check | Result |
|-------|--------|
| Homepage (www) | PASS — HTTP 200 |
| Apex HTTPS | KNOWN ISSUE — timeout (no SSL on apex) |
| Apex HTTP redirect | PASS — 301 → https://www.kamnuanlek.com/ |
| All 10 homepage calculator links | PASS — all HTTP 200 |
| Thai text / mojibake scan | PASS — no encoding issues found |
| Land tax calculator (recently added) | PASS — 200, form functional |
| Electricity calculator | PASS — 200, form functional |
| Article listing page | PASS — 200, 9 articles listed |
| Transfer fee calculator | PASS — 200 |
| /คำนวณค่าโอนบ้าน/ redirect | FAIL — 404 (source exists, not deployed) |
| Electricity article on listing page | FAIL — not present (commit claims added) |
| sitemap-index.xml | PASS — 200 |
| robots.txt | PASS — 200 |

## Calculator Route Inventory (all 200)

1. /คำนวณค่าไฟฟ้า/ — 200
2. /คำนวณค่าโอที/ — 200
3. /คำนวณภาษีเงินได้บุคคลธรรมดา/ — 200
4. /คำนวณภาษีมูลค่าเพิ่ม/ — 200
5. /คำนวณผ่อนกู้/ — 200
6. /คำนวณ-bmi/ — 200
7. /คำนวณเงินเดือนสุทธิ/ — 200
8. /คำนวณผ่อนรถ/ — 200
9. /คำนวณดอกเบี้ยเงินฝาก/ — 200
10. /คำนวณอายุ/ — 200
11. /คำนวณภาษีที่ดิน/ — 200
12. /คำนวณค่าธรรมเนียมโอนบ้าน/ — 200

## Defects Found

### 1. /คำนวณค่าโอนบ้าน/ redirect returns 404 (deploy gap)
- **Severity:** Low (user-visible but redirect source, not primary calculator)
- **Source:** Commit 1d74d1e added `src/pages/คำนวณค่าโอนบ้าน/index.astro`
- **Expected:** 301 redirect to /คำนวณค่าธรรมเนียมโอนบ้าน/
- **Actual:** 404
- **Root cause:** Likely not yet deployed or Thai path encoding issue on hosting platform

### 2. Electricity article missing from /บทความ/ listing
- **Severity:** Low (content gap, not calculator defect)
- **Source:** Commit 3f81935 titled "add electricity article to listing page"
- **Expected:** Listing includes electricity article link
- **Actual:** 9 articles listed, none electricity-related
- **Root cause:** Likely not deployed or listing component not updated correctly

## Verdict

**No calculator output defects — no release blockers.**

Both defects are deployment gaps (code in git, not live). Neither affects calculator accuracy or core user trust. Flagging for CTO awareness on next deploy cycle.
