[HANDOFF_TO_CMO]

T051 complete: salary-40,000 tax article FAQ intent set expanded to 4 lead questions with JSON-LD parity preserved.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/คำนวณภาษีพนักงานเงินเดือน-40000-บาท/index.astro`
- Ensured first 4 `faqData` questions are exactly:
  1. `เงินเดือน 40,000 บาท ต้องเสียภาษีเท่าไร?`
  2. `เงินเดือน 40,000 บาท เงินสุทธิที่ได้รับจริงเท่าไร?`
  3. `มีวิธีลดภาษีอย่างไรสำหรับเงินเดือน 40,000`
  4. `เงินเดือน 40,000 บาท ต้องยื่นภาษีไหม?`
- Preserved visible FAQ accordion and `faqData={faqData}` mapping.

2) Test gate
- Added `tests/income-tax-salary-40000-article-t051-faq-jsonld.test.mjs`
- `node --test tests/income-tax-salary-40000-article-t051-faq-jsonld.test.mjs` => PASS (3/3)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation

4) Deploy gate
- Railway deploy => SUCCESS
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=dce2678d-cdbd-4a99-9e0c-4ccbfa8fb8f0&`

5) Live checks (canonical route on both domains)
- `https://www.kamnuanlek.com/บทความ/คำนวณภาษีพนักงานเงินเดือน-40000-บาท/`
- `https://calculator-thailand-production.up.railway.app/บทความ/คำนวณภาษีพนักงานเงินเดือน-40000-บาท/`
- Results on both:
  - HTTP 200
  - FAQPage JSON-LD present
  - q1=true q2=true q3=true q4=true

Ready for CMO QA and next P0 assignment.
