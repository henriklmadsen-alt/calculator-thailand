# CAL-391 Thai Content QA: Day 4 Due-date/Pregnancy Copy + Internal-link Readiness

Generated: 2026-04-19 (ICT)  
Owner: Thai Content Specialist Alpha  
Manager line: CMO

## Scope delivered
- Published a new Thai supporting article for due-date and pregnancy timeline intent:
  - `/บทความ/กำหนดคลอด-2569-คำนวณวันครบกำหนด-และอายุครรภ์/`
- Added formula-backed explanation with explicit source section (LMP + 280 days / Naegele-style transformation).
- Wired internal-link readiness from live age/BMI routes to the new article so users can navigate without broken links.

## Copy/readiness outcome
- New route is production-ready with:
  - SEO metadata (title, description, canonical)
  - FAQ block (4 entries)
  - Practical worked example (EDD + gestational age + remaining days)
  - Live internal links to active calculator/article routes
  - Source section for formula-bearing claims
- Readiness note included:
  - Keeps non-live calculator paths as plain-text roadmap (`/คำนวณวันกำหนดคลอด/`, `/คำนวณอายุครรภ์/`) without creating broken links.

## Internal-link additions
- Added links to due-date/pregnancy supporting article from:
  - `/คำนวณอายุ/`
  - `/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/`
  - `/คำนวณ-bmi/`
  - `/บทความ/bmi-คำนวณค่าดัชนีมวลกาย-วิธีลดน้ำหนัก/`
- Added new article card in article hub:
  - `/บทความ/`

## Source links used for formula statements
- NHS Pregnancy Due Date Calculator  
  https://www.nhs.uk/pregnancy/finding-out/due-date-calculator/
- Johns Hopkins Medicine, Calculating a Due Date  
  https://www.hopkinsmedicine.org/health/wellness-and-prevention/calculating-a-due-date
- ACOG Committee Opinion No. 700 (Methods for Estimating the Due Date)  
  https://journals.lww.com/greenjournal/fulltext/2017/05000/committee_opinion_no_700__methods_for_estimating.50.aspx

## Files changed
- `src/pages/บทความ/กำหนดคลอด-2569-คำนวณวันครบกำหนด-และอายุครรภ์/index.astro`
- `src/pages/บทความ/index.astro`
- `src/pages/คำนวณอายุ/index.astro`
- `src/pages/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/index.astro`
- `src/pages/คำนวณ-bmi/index.astro`
- `src/pages/บทความ/bmi-คำนวณค่าดัชนีมวลกาย-วิธีลดน้ำหนัก/index.astro`
- `reports/cal-391-thai-content-qa-day4-due-date-pregnancy-readiness-2026-04-19.md`

## Verification
- Command: `npm run build`
- Result: PASS
- Build evidence highlights:
  - `/บทความ/กำหนดคลอด-2569-คำนวณวันครบกำหนด-และอายุครรภ์/index.html`
  - `/คำนวณอายุ/index.html`
  - `/คำนวณ-bmi/index.html`
  - `/บทความ/index.html`
  - `[build] 40 page(s) built in 7.51s`
