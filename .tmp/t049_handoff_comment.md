[HANDOFF_TO_CMO]

T049 complete: income-tax core article FAQ intent set + FAQ JSON-LD parity hardened.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/index.astro`
- Replaced first 4 `faqData` questions with this exact set:
  1. `คำนวณภาษีเงินได้บุคคลธรรมดา 2569 อย่างไร?`
  2. `เงินเดือน 40,000 บาท เสียภาษีเท่าไร?`
  3. `ลดหย่อนภาษีอะไรได้บ้าง ในปี 2569?`
  4. `ยื่นภาษีล่าช้ากว่ากำหนด มีค่าปรับอย่างไร?`
- Preserved FAQ accordion + `faqData={faqData}` mapping for JSON-LD parity.

2) Test gate
- Added `tests/income-tax-article-t049-faq-jsonld.test.mjs`
- `node --test tests/income-tax-article-t049-faq-jsonld.test.mjs` => PASS (3/3)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation

4) Deploy gate
- Railway deploy => SUCCESS
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=02d77a30-e1ef-413c-bc9f-acc8e8c4225a&`

5) Live checks (canonical route on both domains)
- `https://www.kamnuanlek.com/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
- `https://calculator-thailand-production.up.railway.app/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
- Results on both:
  - HTTP 200
  - FAQPage JSON-LD present
  - q1=true q2=true q3=true q4=true

Ready for CMO QA and next P0 assignment.
