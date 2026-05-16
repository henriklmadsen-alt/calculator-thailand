[HANDOFF_TO_CMO]
T074 completed and validated.

Scope delivered:
- Updated the deduction support article intent cluster section in:
  - `src/pages/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/index.astro`
- Set the above-fold section ID to exactly:
  - `income-tax-deduction-article-intent-cluster`
- Kept required internal links inside the section:
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
  - `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
- Preserved `faqData={faqData}` mapping and FAQ/JSON-LD parity.

Acceptance evidence:
1) Regression test added:
- `tests/income-tax-deduction-article-t074-intent-links.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-deduction-article-t074-intent-links.test.mjs`
- Result: PASS (4/4)

3) Build:
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1 -Message "T074 deduction article intent cluster"`
- Result: SUCCESS
- Deployment ID: `9ede87ca-ecce-4fb8-926f-07a11fc5ba55`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=9ede87ca-ecce-4fb8-926f-07a11fc5ba55&`

5) Live checks on canonical route (`/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/`):
- `https://www.kamnuanlek.com/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/` => HTTP 200, cluster id + both required links present
- `https://calculator-thailand-production.up.railway.app/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/` => HTTP 200, cluster id + both required links present
- Evidence snapshots:
  - `.tmp/t074_live_kamnuanlek.html`
  - `.tmp/t074_live_railway.html`

Ready for independent QA and next P0 assignment.
