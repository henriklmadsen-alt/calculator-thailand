# CAL-369 Supporting Article Package: Age Calculator 2569 (2026-04-19)

Generated: 2026-04-19 (ICT)  
Owner: Thai Content Specialist Alpha  
Manager line: CMO

## Scope Delivered
- Issue: `CAL-369`
- Goal: publish Thai supporting article for age calculator cluster and ship internal-link package for ranking + trust.
- Delivered routes:
  - `/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/` (new)
  - `/คำนวณอายุ/` (updated reciprocal links)
  - `/บทความ/` (updated article hub listing)
  - `public/sitemap.xml` (added age cluster URLs)

## Metadata Summary (New Article)
- Title:
  - `คำนวณอายุ 2569 | นับอายุจากวันเกิดแบบละเอียด ปี เดือน วัน | เครื่องคำนวณไทย`
- Description:
  - `คู่มือคำนวณอายุปี 2569 สำหรับคนไทย อธิบายการนับอายุจากวันเกิดแบบปี เดือน วัน อายุรวม และวันเกิดถัดไป พร้อมแนวทางใช้ผลลัพธ์ให้ตรงงานจริง`
- Canonical:
  - `/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/`
- Publish/Modified date:
  - `2026-04-19`

## Internal-Link Package
- Article -> primary calculator CTA:
  - `/คำนวณอายุ/`
- Article -> related cluster links:
  - `/คำนวณ-bmi/`
  - `/บทความ/bmi-คำนวณค่าดัชนีมวลกาย-วิธีลดน้ำหนัก/`
  - `/คำนวณเปอร์เซ็นต์/`
- Calculator reciprocal link added:
  - `/คำนวณอายุ/` -> `/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/`
- Discoverability links updated:
  - added article card in `/บทความ/`
  - added sitemap URLs for age calculator + new supporting article

## Formula/Logic Source Note
- Article formula/logic statements are aligned to calculator behavior and sourced from in-repo calculator logic:
  - `/คำนวณอายุ/` runtime behavior
  - `src/lib/age-calculator.ts`

## Files Changed
- `src/pages/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/index.astro` (new)
- `src/pages/คำนวณอายุ/index.astro`
- `src/pages/บทความ/index.astro`
- `public/sitemap.xml`

## Verification
- Command:
  - `npm run build`
- Result:
  - PASS
- Key evidence lines:
  - `/คำนวณอายุ/index.html`
  - `/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/index.html`
  - `/บทความ/index.html`
  - `[build] 38 page(s) built in 2.09s`

## CMO Correction Round (2026-04-19, post-review)

### Fixes completed for approval gate
- Expanded article body to long-form content with measured Thai word count:
  - `1,218` words (Intl.Segmenter check)
- Added official Thai source citations relevant to age/date usage:
  - Office of the Council of State civil code compilation (via DOPA/BORA mirror)
  - DOPA callcenter guidance on age-complete deadlines from birthday
- Added explicit worked example with DOB + as-of date + exact result:
  - DOB `15 กุมภาพันธ์ 2538`
  - As-of `19 เมษายน 2569`
  - Result `31 ปี 2 เดือน 4 วัน`
- Shortened SEO title to <= 60 characters.
- Increased related links so article now includes:
  - `3` related calculators
  - `3` true related article links

### Line references (implementation evidence)
- `src/pages/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/index.astro:5`
  - Updated title (`55` chars)
- `src/pages/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/index.astro:6`
  - Updated meta description (`118` chars)
- `src/pages/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/index.astro:85`
  - Worked-example section start
- `src/pages/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/index.astro:125`
  - Explicit result line (`31 ปี 2 เดือน 4 วัน`)
- `src/pages/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/index.astro:197`
  - Official-source section start
- `src/pages/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/index.astro:199`
  - CoS / Civil & Commercial Code source link
- `src/pages/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/index.astro:200`
  - DOPA/BORA source link
- `src/pages/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/index.astro:204`
  - Related calculators section
- `src/pages/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/index.astro:212`
  - Related articles section

### Fresh verification evidence (required rerun)
- Command: `npm run build`
- Timestamp (ICT): `2026-04-19 16:11`
- Result: PASS
- Key output lines:
  - `▶ src/pages/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/index.astro`
  - `└─ /บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/index.html`
  - `[build] 38 page(s) built in 2.26s`
