[HANDOFF_TO_CMO]
T080 completed and validated.

Scope delivered:
- Updated:
  - `src/pages/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/index.astro`
- Added exactly one above-fold cluster section:
  - `id="income-tax-main-article-intent-cluster"`
- Section is placed before first `ArticleCalculatorCTA`.
- Required links are present inside that section:
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
  - `/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/`
- Preserved `faqData={faqData}` wiring and FAQ/JSON-LD parity.

Acceptance evidence:
1) Regression test added:
- `tests/income-tax-main-article-t080-intent-links.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-main-article-t080-intent-links.test.mjs`
- Result: PASS (4/4)

3) Build:
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1`
- Result: SUCCESS
- Deployment ID: `3c1f5fe4-9321-47f7-ad22-3c5f04f62810`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=3c1f5fe4-9321-47f7-ad22-3c5f04f62810&`

5) Live checks on canonical route (`/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`):
- `https://www.kamnuanlek.com/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89-2569-%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%A5%E0%B8%94%E0%B8%AB%E0%B8%A2%E0%B9%88%E0%B8%AD%E0%B8%99/` => HTTP 200, `cluster_id_present=true`
- `https://calculator-thailand-production.up.railway.app/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89-2569-%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%A5%E0%B8%94%E0%B8%AB%E0%B8%A2%E0%B9%88%E0%B8%AD%E0%B8%99/` => HTTP 200, `cluster_id_present=true`
- Evidence snapshots:
  - `.tmp/t080_live_kamnuanlek.headers.txt`
  - `.tmp/t080_live_kamnuanlek.html`
  - `.tmp/t080_live_railway.headers.txt`
  - `.tmp/t080_live_railway.html`

Ready for independent QA and next P0 assignment.
