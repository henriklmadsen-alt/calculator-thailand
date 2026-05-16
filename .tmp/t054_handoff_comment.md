[HANDOFF_TO_CMO]

T054 complete: net-salary basics article FAQ intent set expanded to 4 lead questions with JSON-LD parity preserved.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/เงินเดือนสุทธิ-คืออะไร/index.astro`
- Ensured first 4 `faqData` questions are exactly:
  1. `เงินเดือนสุทธิคืออะไร?`
  2. `เงินเดือนสุทธิคำนวณอย่างไร?`
  3. `เงินเดือนรวมกับเงินเดือนสุทธิต่างกันอย่างไร?`
  4. `เงินเดือนสุทธิหักประกันสังคมและภาษีอะไรบ้าง?`
- Preserved visible FAQ accordion and `faqData={faqData}` mapping.

2) Test gate (TDD RED->GREEN)
- Added `tests/net-salary-basics-article-t054-faq-jsonld.test.mjs`
- RED: `node --test tests/net-salary-basics-article-t054-faq-jsonld.test.mjs` => FAIL (missing 4th FAQ + question mismatch)
- GREEN: `node --test tests/net-salary-basics-article-t054-faq-jsonld.test.mjs` => PASS (3/3)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation

4) Deploy gate
- Railway deploy => SUCCESS
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=13f80b0e-5503-40b3-8fe5-46726b3577c2&`

5) Live checks (canonical route on both domains)
- `https://www.kamnuanlek.com/บทความ/เงินเดือนสุทธิ-คืออะไร/`
- `https://calculator-thailand-production.up.railway.app/บทความ/เงินเดือนสุทธิ-คืออะไร/`
- Results on both:
  - HTTP 200
  - FAQPage JSON-LD present
  - q1=true q2=true q3=true q4=true

Ready for CMO QA and next P0 assignment.
