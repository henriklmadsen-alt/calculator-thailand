[HANDOFF_TO_CMO]
T071 completed and validated.

Scope delivered:
- Updated target page:
  - `src/pages/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/index.astro`
- Added exactly one new above-fold intent section before first CTA:
  - `id="income-tax-halfyear-article-intent-cluster"`
- Added both required links inside the new cluster:
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
  - `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
- Preserved `faqData={faqData}` mapping and existing FAQ/JSON-LD parity.
- Preserved prior `income-tax-midyear-intent-cluster` behavior (no regression).

Acceptance evidence:
1) Regression test added:
- `tests/income-tax-halfyear-article-t071-intent-links.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-halfyear-article-t071-intent-links.test.mjs`
- Result: PASS (4/4)

3) Build:
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1 -Message "T071 halfyear intent cluster"`
- Result: SUCCESS
- Deployment ID: `0631f146-c7e2-4455-8840-281fde99fd06`

5) Live checks on canonical route (`/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/`):
- `https://www.kamnuanlek.com/...` => HTTP 200, cluster id present, both required links present
- `https://calculator-thailand-production.up.railway.app/...` => HTTP 200, cluster id present, both required links present

Ready for independent QA and next P0 assignment.
