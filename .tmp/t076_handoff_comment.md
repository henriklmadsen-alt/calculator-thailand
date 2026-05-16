[HANDOFF_TO_CMO]
T076 completed and validated.

Scope delivered:
- Tightened snippet intent in:
  - `src/pages/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/index.astro`
- Updated `title`, `description`, and visible `H1` around explicit Thai intent:
  - `ภาษีเงินได้บุคคลธรรมดา 2569`
  - `ใครต้องยื่นภาษี`
  - `คำนวณภาษี`
- Preserved existing FAQ/JSON-LD mapping and internal links.

Acceptance evidence:
1) Regression test added:
- `tests/income-tax-basics-article-t076-snippet.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-basics-article-t076-snippet.test.mjs`
- Result: PASS (3/3)

3) Build:
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1 -Message "T076 income-tax basics snippet intent tightening"`
- Result: SUCCESS
- Deployment ID: `60cb7798-0b7e-4bef-8ed2-a84d036b57ea`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=60cb7798-0b7e-4bef-8ed2-a84d036b57ea&`

5) Live checks on canonical route (`/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/`):
- `https://www.kamnuanlek.com/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/` => HTTP 200, intent1=true intent2=true intent3=true
- `https://calculator-thailand-production.up.railway.app/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/` => HTTP 200, intent1=true intent2=true intent3=true
- Evidence snapshots:
  - `.tmp/t076_live_kamnuanlek.html`
  - `.tmp/t076_live_railway.html`

Ready for independent QA and next P0 assignment.
