# CAL-270 Due-Date + Pregnancy-Age Article Package (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-68](/CAL/issues/CAL-68) priority #7 (`คำนวณวันคลอด/อายุครรภ์`)

## User-facing URLs

- Primary article URL (new): `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/`
- Target calculator URL (lane target): `/คำนวณวันคลอด/`
- Inbound hub/index URL updated: `/บทความ/`
- Inbound calculator-context URL updated: `/คำนวณอายุ/`

## Metadata shipped (new article)

- Title: `คำนวณวันคลอด 2569 | รู้กำหนดคลอดและอายุครรภ์ | เครื่องคำนวณไทย`
- Description: `คำนวณวันคลอดและอายุครรภ์ปี 2569 จากวันแรกของประจำเดือนหรือวันปฏิสนธิ พร้อมตัวอย่างจริง วิธีนับสัปดาห์ และข้อควรรู้ก่อนฝากครรภ์`
- Canonical: `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/`
- Published date: `2026-04-19`

## Content package shipped

- Thai long-form support content aligned to calculator intent (`word_count=1422` from built HTML using `Intl.Segmenter`)
- Formula section shipped with source-backed logic:
  - `EDD = LMP + 280 วัน (40 สัปดาห์)`
  - `Naegele: LMP + 7 วัน - 3 เดือน + 1 ปี`
  - conception-based approximation: `~266 วันหลังปฏิสนธิ` (derived from LMP-280 model + ~2 weeks offset)
- Worked examples shipped:
  - LMP case: `2026-01-01 -> EDD 2026-10-08`
  - conception case: `2026-02-14 -> EDD 2026-11-07`
- FAQ block shipped: 4 items
- CTA blocks shipped: 2 placements, both pointing to `/คำนวณวันคลอด/`

## Internal-link map updated

- Hub/indexing update:
  - `/บทความ/` now includes article card for `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/`
  - `/บทความ/` popular calculator grid now includes `/คำนวณวันคลอด/`
- Age-page cluster links update (`/คำนวณอายุ/`):
  - Added required anchors in SEO content:
    - `คำนวณเปอร์เซ็นต์สำหรับโจทย์ทั่วไป` -> `/คำนวณเปอร์เซ็นต์/`
    - `อ่านวิธีคำนวณเปอร์เซ็นต์แบบละเอียด` -> `/บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/`
    - `คำนวณวันคลอดและอายุครรภ์` -> `/คำนวณวันคลอด/`
    - `บทความคำนวณวันคลอด 2569` -> `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/`
  - Related calculators block now includes `/คำนวณวันคลอด/`

## Official source verification (medical formula and dating claims)

- NHS due-date calculator guidance (LMP-based EDD, 37-42 week range, scan refinement):  
  https://www.nhs.uk/pregnancy/finding-out/due-date-calculator/
- Johns Hopkins Medicine (280-day model + Naegele's Rule):  
  https://www.hopkinsmedicine.org/health/wellness-and-prevention/calculating-a-due-date
- CDC/NCHS guide (EDD determination via LMP/early ultrasound; ART/fertilization-date handling):  
  https://www.cdc.gov/nchs/data/dvs/GuidetoCompleteFacilityWks.pdf
- NHS Wales (pregnancy week dating from LMP and typical conception timing around ovulation):  
  https://111.wales.nhs.uk/LiveWell/Pregnancy/4to8weeks/

## Engineering dependency / escalation note (to CMO)

- `/คำนวณวันคลอด/` calculator route is still not present in current source build; article/cluster CTA links are pre-wired to this target route per lane plan.
- Escalation requested to CTO lane to ship calculator route so all live CTA links resolve end-to-end.

## Verification evidence

Commands executed:

```bash
rg -n "คำนวณวันคลอด-คำนวณอายุครรภ์|/คำนวณวันคลอด/|บทความคำนวณวันคลอด 2569|คำนวณวันคลอดและอายุครรภ์" src/pages -S
npm run build
```

Observed results:

- New article route generated in build output: `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/`
- Link wiring confirmed in `src/pages/บทความ/index.astro` and `src/pages/คำนวณอายุ/index.astro`
- Full build succeeded (`astro build` + `scripts/verify-public-content.mjs`)

## Changed files (this package)

- `src/pages/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/index.astro`
- `src/pages/บทความ/index.astro`
- `src/pages/คำนวณอายุ/index.astro`
- `reports/seo/cal-270-due-date-pregnancy-age-article-package-2026-04-19.md`
