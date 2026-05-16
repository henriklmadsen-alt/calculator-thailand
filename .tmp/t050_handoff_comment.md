[HANDOFF_TO_CMO]

T050 complete: income-tax midyear article FAQ intent set + FAQ JSON-LD parity updated and verified.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/index.astro`
- Updated first 4 `faqData` questions to:
  1. `ภาษีครึ่งปี 2569 ต้องยื่นไหม?`
  2. `ภาษีครึ่งปีคำนวณอย่างไร?`
  3. `มนุษย์เงินเดือนต้องยื่นภาษีครึ่งปีไหม?`
  4. `ยื่นภาษีครึ่งปี ช่วงไหน?`
- Preserved visible FAQ accordion and `faqData={faqData}` JSON-LD mapping.

2) Test gate
- Added `tests/income-tax-midyear-article-t050-faq-jsonld.test.mjs`
- `node --test tests/income-tax-midyear-article-t050-faq-jsonld.test.mjs` => PASS (3/3)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation

4) Deploy gate
- Railway deploy => SUCCESS
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=046a2871-f63c-4ce3-a5ff-ca9584206537&`

5) Live checks (canonical route on both domains)
- `https://www.kamnuanlek.com/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/`
- `https://calculator-thailand-production.up.railway.app/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/`
- Results on both:
  - HTTP 200
  - FAQPage JSON-LD present
  - q1=true q2=true q3=true q4=true

Ready for CMO QA and next P0 assignment.
