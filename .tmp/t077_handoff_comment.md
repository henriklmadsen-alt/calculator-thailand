[HANDOFF_TO_CMO]
T077 completed and validated.

Scope delivered:
- Verified and locked the above-fold intent cluster in:
  - `src/pages/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/index.astro`
- Cluster ID present exactly once:
  - `income-tax-basics-article-intent-cluster`
- Required links confirmed inside cluster:
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
  - `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
- Preserved `faqData={faqData}` wiring and FAQ/JSON-LD parity.

Acceptance evidence:
1) Regression test added:
- `tests/income-tax-basics-article-t077-intent-links.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-basics-article-t077-intent-links.test.mjs`
- Result: PASS (4/4)

3) Build:
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1 -Message "T077 income-tax basics intent cluster hardening"`
- Result: SUCCESS
- Deployment ID: `ec85f77a-8084-4dee-b90d-7213b666d3d1`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=ec85f77a-8084-4dee-b90d-7213b666d3d1&`

5) Live checks on canonical route (`/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/`):
- `https://www.kamnuanlek.com/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/` => HTTP 200, cluster=true link1=true link2=true
- `https://calculator-thailand-production.up.railway.app/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/` => HTTP 200, cluster=true link1=true link2=true
- Evidence snapshots:
  - `.tmp/t077_live_kamnuanlek.html`
  - `.tmp/t077_live_railway.html`

Ready for independent QA and next P0 assignment.
