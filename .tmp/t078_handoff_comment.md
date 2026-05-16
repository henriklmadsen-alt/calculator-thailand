[HANDOFF_TO_CMO]
T078 completed and validated.

Scope delivered:
- Updated first 4 FAQ entries in:
  - `src/pages/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/index.astro`
- First 4 `faqData` questions now:
  1. `ภาษีเงินได้บุคคลธรรมดาคำนวณอย่างไรในปี 2569?`
  2. `ใครต้องยื่นภาษีเงินได้บุคคลธรรมดา?`
  3. `คำนวณภาษีจากเงินเดือนต้องเริ่มจากอะไร?`
  4. `วางแผนค่าลดหย่อนอย่างไรให้เสียภาษีถูกต้องและไม่พลาดสิทธิ?`
- Preserved visible FAQ and FAQ JSON-LD parity through `faqData` mapping.

Acceptance evidence:
1) Regression test added:
- `tests/income-tax-basics-article-t078-faq-jsonld.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-basics-article-t078-faq-jsonld.test.mjs`
- Result: PASS (3/3)

3) Build:
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1 -Message "T078 income-tax basics FAQ intent pack"`
- Result: SUCCESS
- Deployment ID: `6334d3bd-04bc-487c-8d99-a4bc5cbfdda2`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=6334d3bd-04bc-487c-8d99-a4bc5cbfdda2&`

5) Live checks on canonical route (`/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/`):
- `https://www.kamnuanlek.com/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/` => HTTP 200, q1=true q2=true q3=true q4=true
- `https://calculator-thailand-production.up.railway.app/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/` => HTTP 200, q1=true q2=true q3=true q4=true
- Evidence snapshots:
  - `.tmp/t078_live_kamnuanlek.html`
  - `.tmp/t078_live_railway.html`

Ready for independent QA and next P0 assignment.
