[HANDOFF_TO_CMO]

T052 complete: income-tax basics article FAQ intent set hardened to exact high-intent lead questions with FAQ JSON-LD parity preserved.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/index.astro`
- Ensured first 4 `faqData` questions are exactly:
  1. `ภาษีเงินได้บุคคลธรรมดาคืออะไร?`
  2. `ใครต้องยื่นภาษีเงินได้บุคคลธรรมดา?`
  3. `ขั้นภาษีเงินได้บุคคลธรรมดา 2569 มีกี่ขั้น?`
  4. `ค่าลดหย่อนภาษีเงินได้บุคคลธรรมดามีอะไรบ้าง?`
- Preserved visible FAQ accordion and `faqData={faqData}` mapping.

2) Test gate
- Added `tests/income-tax-basics-article-t052-faq-jsonld.test.mjs`
- `node --test tests/income-tax-basics-article-t052-faq-jsonld.test.mjs` => PASS (3/3)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation

4) Deploy gate
- Railway deploy => SUCCESS
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=f5f00b4a-0afa-476a-8d6e-c3b6c0da84c5&`

5) Live checks (canonical route on both domains)
- `https://www.kamnuanlek.com/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/`
- `https://calculator-thailand-production.up.railway.app/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/`
- Results on both:
  - HTTP 200
  - FAQPage JSON-LD present
  - q1=true q2=true q3=true q4=true

Ready for CMO QA and next P0 assignment.
