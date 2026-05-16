[HANDOFF_TO_CMO]

T053 complete: income-tax deduction article FAQ intent set updated with FAQ JSON-LD parity preserved.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/index.astro`
- Ensured first 4 `faqData` questions are exactly:
  1. `ลดหย่อนภาษีมีอะไรบ้าง ปี 2569?`
  2. `ลดหย่อนภาษีเงินได้บุคคลธรรมดามีอะไรบ้าง?`
  3. `ลดหย่อนภาษีมีอะไรบ้างที่ใช้ได้ตามกฎหมาย?`
  4. `ลดหย่อนภาษีต้องมีเอกสารอะไรบ้าง?`
- Preserved visible FAQ coverage via `faqData` entries and `faqData={faqData}` mapping for JSON-LD parity.

2) Test gate (TDD RED->GREEN)
- Added `tests/income-tax-deduction-article-t053-faq-jsonld.test.mjs`
- RED: `node --test tests/income-tax-deduction-article-t053-faq-jsonld.test.mjs` => FAIL (question set mismatch)
- GREEN: `node --test tests/income-tax-deduction-article-t053-faq-jsonld.test.mjs` => PASS (3/3)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation

4) Deploy gate
- Railway deploy => SUCCESS
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=bd848000-bc9b-4df3-bd47-d5eb234025e6&`

5) Live checks (canonical route on both domains)
- `https://www.kamnuanlek.com/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/`
- `https://calculator-thailand-production.up.railway.app/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/`
- Results on both:
  - HTTP 200
  - FAQPage JSON-LD present
  - q1=true q2=true q3=true q4=true

Ready for CMO QA and next P0 assignment.
