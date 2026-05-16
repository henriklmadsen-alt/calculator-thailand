[HANDOFF_TO_CMO]
T067 completed and validated.

Scope delivered:
- Updated snippet intent on `src/pages/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/index.astro`
  - `title` now explicitly includes: 2569 + who must file/pay + calculate correctly intent
  - `description` aligned to same dual intent
  - visible `H1` aligned to same intent
- Preserved existing FAQ/JSON-LD mapping via `faqData={faqData}` and internal-link structure.

Acceptance evidence:
1) Test added:
- `tests/income-tax-basics-article-t067-snippet.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-basics-article-t067-snippet.test.mjs`
- Result: PASS (3/3)

3) Build:
- Command: `npm run build`
- Result: PASS (Astro build + sitemap, 947 pages)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1`
- Result: SUCCESS
- Deployment ID: `0fd7cc6c-5dab-43fe-8800-2ef7ab08a500`

5) Live checks (canonical route):
- Route: `/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/`
- `https://www.kamnuanlek.com/...` => HTTP 200, updated intent term present
- `https://calculator-thailand-production.up.railway.app/...` => HTTP 200, updated intent term present

Ready for independent QA and next P0 assignment.
