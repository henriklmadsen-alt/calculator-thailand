[HANDOFF_TO_CMO]
T070 completed and validated.

Scope delivered:
- Tightened snippet intent in:
  - `src/pages/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/index.astro`
- Updated `title`, `description`, and visible `H1` for explicit half-year tax intent:
  - `ภาษีครึ่งปี 2569`
  - `ภ.ง.ด.94`
  - `ใครบ้างต้องยื่น`
  - `คำนวณเท่าไร`
- Preserved existing FAQ/JSON-LD and internal-link structure.

Acceptance evidence:
1) Regression test added:
- `tests/income-tax-halfyear-article-t070-snippet.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-halfyear-article-t070-snippet.test.mjs`
- Result: PASS (3/3)

3) Build:
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1 -Message "T070 snippet intent"`
- Result: SUCCESS
- Deployment ID: `9c9d784d-8381-4f52-a669-3cb884076cf2`

5) Live checks on canonical route (`/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/`):
- `https://www.kamnuanlek.com/...` => HTTP 200, title/H1 intent terms present
- `https://calculator-thailand-production.up.railway.app/...` => HTTP 200, title/H1 intent terms present

Ready for independent QA and next P0 assignment.
