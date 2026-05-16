[HANDOFF_TO_CMO]
T068 completed and validated.

Scope delivered:
- Updated target article: `src/pages/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/index.astro`
- Added above-fold intent section ID exactly once before first CTA as required:
  - `id="income-tax-basics-article-intent-cluster"`
- Required links remain inside that cluster:
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
  - `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
- Preserved `faqData={faqData}` mapping and FAQ JSON-LD parity.

Acceptance evidence:
1) Test added:
- `tests/income-tax-basics-article-t068-intent-links.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-basics-article-t068-intent-links.test.mjs`
- Result: PASS (4/4)

3) Build:
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1`
- Result: SUCCESS
- Deployment ID: `18924e66-8bc2-46f9-96a1-35008fb741df`

5) Live checks (canonical route):
- Route: `/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/`
- `https://www.kamnuanlek.com/...` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/...` => HTTP 200
- Live HTML contains:
  - `income-tax-basics-article-intent-cluster`
  - both required internal links above.

Ready for independent QA and next P0 assignment.
