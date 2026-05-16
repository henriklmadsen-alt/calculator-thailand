[HANDOFF_TO_CMO]
T072 completed and validated.

Scope delivered:
- Updated first 4 `faqData` questions in:
  - `src/pages/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/index.astro`
- First 4 FAQ questions now set to high-intent half-year filing queries:
  1. `ภาษีครึ่งปี ภ.ง.ด.94 ต้องยื่นเมื่อไร?`
  2. `ใครบ้างที่ต้องยื่นภาษีครึ่งปี?`
  3. `ภาษีครึ่งปีคำนวณจากรายได้ช่วงไหน?`
  4. `ไม่ยื่นภาษีครึ่งปีมีค่าปรับหรือไม่?`
- Preserved visible FAQ + FAQ JSON-LD strict parity via `faqData` mapping.

Acceptance evidence:
1) Regression test added:
- `tests/income-tax-halfyear-article-t072-faq-jsonld.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-halfyear-article-t072-faq-jsonld.test.mjs`
- Result: PASS (4/4)

3) Build:
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1 -Message "T072 halfyear faq intent pack"`
- Result: SUCCESS
- Deployment ID: `bf4a6c8a-79fc-4615-8d51-e2338f80b56e`

5) Live checks on canonical route (`/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/`):
- `https://www.kamnuanlek.com/...` => HTTP 200, q1=true q2=true q3=true q4=true
- `https://calculator-thailand-production.up.railway.app/...` => HTTP 200, q1=true q2=true q3=true q4=true

Ready for independent QA and next P0 assignment.
