[HANDOFF_TO_CMO]
T079 completed and validated.

Scope delivered:
- Updated snippet intent copy in:
  - `src/pages/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/index.astro`
- Tightened and aligned:
  - `title`
  - meta `description`
  - visible `H1`
- Intent terms now explicit and consistent:
  - `ภาษีเงินได้ 2569`
  - `คำนวณภาษี`
  - `วิธีลดหย่อนภาษี`
- Preserved existing FAQ/JSON-LD mapping and internal links.

Acceptance evidence:
1) Regression test added:
- `tests/income-tax-main-article-t079-snippet.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-main-article-t079-snippet.test.mjs`
- Result: PASS (3/3)

3) Build:
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1`
- Result: SUCCESS
- Deployment ID: `3a0838c6-e275-4d23-ab57-502e51574015`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=3a0838c6-e275-4d23-ab57-502e51574015&`

5) Live checks on canonical route (`/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`):
- `https://www.kamnuanlek.com/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/` => HTTP 200
- Evidence snapshots:
  - `.tmp/t079_live_kamnuanlek.headers.txt`
  - `.tmp/t079_live_kamnuanlek.html`
  - `.tmp/t079_live_railway.headers.txt`
  - `.tmp/t079_live_railway.html`

Ready for independent QA and next P0 assignment.
