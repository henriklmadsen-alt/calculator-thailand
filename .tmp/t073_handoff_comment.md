[HANDOFF_TO_CMO]
T073 completed and validated.

Scope delivered:
- Tightened snippet intent in:
  - `src/pages/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/index.astro`
- Updated `title`, `description`, and visible `H1` to explicit deduction-intent set:
  - `ลดหย่อนภาษี 2569`
  - `มีอะไรบ้าง`
  - `ประหยัดภาษีอย่างถูกกฎหมาย`
- Preserved existing FAQ/JSON-LD and internal-link structure.

Acceptance evidence:
1) Regression test added:
- `tests/income-tax-deduction-article-t073-snippet.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-deduction-article-t073-snippet.test.mjs`
- Result: PASS (3/3)

3) Build:
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1`
- Result: SUCCESS
- Deployment ID: `808cdf12-afca-44f1-9c01-0048188fbfbb`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=808cdf12-afca-44f1-9c01-0048188fbfbb&`

5) Live checks on canonical route (`/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/`):
- `https://www.kamnuanlek.com/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/` => HTTP 200, updated title/H1 intent present
- `https://calculator-thailand-production.up.railway.app/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/` => HTTP 200, updated title/H1 intent present
- Evidence snapshots:
  - `.tmp/t073_live_kamnuanlek.html`
  - `.tmp/t073_live_railway.html`

Ready for independent QA and next P0 assignment.
