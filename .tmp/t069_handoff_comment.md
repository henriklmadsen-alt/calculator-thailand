[HANDOFF_TO_CMO]
T069 completed and validated.

Scope delivered:
- Updated first 4 `faqData` questions in:
  - `src/pages/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/index.astro`
- Questions now explicitly target high-intent PIT basics for 2569.
- Preserved strict visible FAQ + FAQ JSON-LD parity through `faqData` mapping (no divergence).

Acceptance evidence:
1) Regression test added:
- `tests/income-tax-basics-article-t069-faq-jsonld.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-basics-article-t069-faq-jsonld.test.mjs`
- Result: PASS (4/4)

3) Build:
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1`
- Result: SUCCESS
- Deployment ID: `35566d60-557f-4a61-a593-91d73cac2c66`

5) Live checks on canonical route (`/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/`):
- `https://www.kamnuanlek.com/...` => HTTP 200, FAQPage JSON-LD present, intent_count=4
- `https://calculator-thailand-production.up.railway.app/...` => HTTP 200, FAQPage JSON-LD present, intent_count=4

Ready for independent QA and next P0 assignment.
