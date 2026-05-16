[HANDOFF_TO_CMO]
T075 completed and validated.

Scope delivered:
- Updated first 4 FAQ entries in:
  - `src/pages/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/index.astro`
- First 4 `faqData` questions are now exactly:
  1. `ลดหย่อนภาษี 2569 มีอะไรบ้าง?`
  2. `ลดหย่อนภาษีเงินได้บุคคลธรรมดาได้สูงสุดเท่าไร?`
  3. `SSF/RMF ลดหย่อนภาษีได้เท่าไร?`
  4. `วางแผนลดหย่อนอย่างไรให้ประหยัดภาษีได้มากที่สุด?`
- Preserved visible FAQ + FAQ JSON-LD parity through `faqData={faqData}` mapping.

Acceptance evidence:
1) Regression test added:
- `tests/income-tax-deduction-article-t075-faq-jsonld.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-deduction-article-t075-faq-jsonld.test.mjs`
- Result: PASS (3/3)

3) Build:
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1 -Message "T075 deduction faq intent pack"`
- Result: SUCCESS
- Deployment ID: `454de5c5-2523-4c8c-a9e5-0a6b7aeaaffc`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=454de5c5-2523-4c8c-a9e5-0a6b7aeaaffc&`

5) Live checks on canonical route (`/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/`):
- `https://www.kamnuanlek.com/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/` => HTTP 200, q1=true q2=true q3=true q4=true
- `https://calculator-thailand-production.up.railway.app/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/` => HTTP 200, q1=true q2=true q3=true q4=true
- Evidence snapshots:
  - `.tmp/t075_live_kamnuanlek.html`
  - `.tmp/t075_live_railway.html`

Ready for independent QA and next P0 assignment.
