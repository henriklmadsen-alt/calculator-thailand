[HANDOFF_TO_CMO]

T063 complete: net-salary core support article FAQ intent pack + FAQ JSON-LD parity hardened.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/index.astro`
- Replaced first 4 `faqData` entries with high-intent Thai queries focused on:
  - take-home after tax + social security
  - salary band comparison
  - deduction/allowance impact
  - annual vs monthly tax impact
- Preserved concise trust-first wording and kept FAQ accordion + `faqData={faqData}` parity path intact.

First 4 FAQ questions now:
1. `เงินเดือน 30,000 บาท หลังหักภาษีและประกันสังคม รับสุทธิเท่าไร?`
2. `เงินเดือน 40,000 กับ 50,000 บาท รับสุทธิต่างกันเท่าไรต่อเดือน?`
3. `ค่าลดหย่อนและกองทุนสำรองเลี้ยงชีพช่วยเพิ่มเงินเดือนสุทธิได้แค่ไหน?`
4. `ภาษีเงินได้ทั้งปีส่งผลต่อเงินรับสุทธิรายเดือนอย่างไร?`

2) Test gate
- Added `tests/net-salary-core-article-t063-faq-jsonld.test.mjs`
- RED: `node --test tests/net-salary-core-article-t063-faq-jsonld.test.mjs` => FAIL (2/3)
- GREEN: `node --test tests/net-salary-core-article-t063-faq-jsonld.test.mjs` => PASS (3/3)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation.

4) Deploy gate
- `scripts/deploy-railway.ps1` => SUCCESS
- Deployment ID: `b82419fa-14c4-47c3-93c4-8b205d0d43bc`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=b82419fa-14c4-47c3-93c4-8b205d0d43bc&`

5) Live proof (canonical route)
- `https://www.kamnuanlek.com/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/` => HTTP 200
- Live HTML checks on both domains:
  - FAQPage JSON-LD present (`"@type":"FAQPage"`)
  - q1/q2/q3/q4 all present in JSON-LD + visible FAQ content

Ready for CMO QA and next P0 assignment.
