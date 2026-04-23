# CAL-28 Route Parity + UX Verification

Date: 2026-04-14
Issue: [CAL-28](/CAL/issues/CAL-28)
Commit pushed: `8b8cc0d`

## Scope Executed
- Applied CAL-25 UX/spec copy updates on target calculators:
  - `/คำนวณผ่อนรถ/`
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
  - `/คำนวณผ่อนบ้าน/`
  - `/คำนวณดอกเบี้ยเงินฝาก/`
  - `/คำนวณเงินเดือนสุทธิ/`
- Standardized article calculator CTA module placement/copy on target articles:
  - `/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/`
  - `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
  - `/บทความ/รีไฟแนนซ์บ้าน-vs-โปะบ้าน-แบบไหนคุ้ม-2569/`
- Added missing parity routes in repo:
  - `/คำนวณผ่อนบ้าน/`
  - `/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/`
  - `/บทความ/รีไฟแนนซ์บ้าน-vs-โปะบ้าน-แบบไหนคุ้ม-2569/`

## Before (baseline from CAL-27)
- Expected routes: 18
- Live routes: 15
- Missing routes: 3
  - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
  - `/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B8%84%E0%B8%A3%E0%B8%B6%E0%B9%88%E0%B8%87%E0%B8%9B%E0%B8%B5-2569-%E0%B8%A2%E0%B8%B7%E0%B9%88%E0%B8%99%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%84%E0%B8%A3-%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%A3/`
  - `/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%A3%E0%B8%B5%E0%B9%84%E0%B8%9F%E0%B9%81%E0%B8%99%E0%B8%99%E0%B8%8B%E0%B9%8C%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99-vs-%E0%B9%82%E0%B8%9B%E0%B8%B0%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99-%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%84%E0%B8%AB%E0%B8%99%E0%B8%84%E0%B8%B8%E0%B9%89%E0%B8%A1-2569/`

## Local Verification (post-change)
- `npm run build` passed.
- Local static route generation includes 18 HTML routes including all 3 previously-missing routes.

## Live Verification (post-push)
- `npm run seo:verify-sitemap -- --site-url https://calculator-thailand-production.up.railway.app --expected-sitemap dist/sitemap-0.xml`
- Re-run windows after push still report:
  - Expected routes: 18
  - Live routes: 15
  - Missing routes: 3
  - Status: FAIL
- Direct HEAD checks for all 3 missing routes return `404`.
- Live title at `/คำนวณผ่อนรถ/` still shows old metadata, indicating latest commit is not deployed to production yet.

## Remaining External Blocker
- **Owner:** CEO / infrastructure (Railway deploy control)
- **Action needed:** trigger or repair Railway production deployment for commit `8b8cc0d` on `master`, then re-run parity check.
- **Evidence:** live sitemap and route responses remain on pre-change version despite successful GitHub push.
