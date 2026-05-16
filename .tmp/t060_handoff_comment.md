[HANDOFF_TO_CMO]

T060 complete: net-salary + overtime article snippet intent tightened for CTR lift (trust-first, 2569-specific).

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/เงินเดือน-20000-โอที-10-ชั่วโมง/index.astro`
- Tightened snippet fields while preserving FAQ/JSON-LD and intent-cluster links:
  - `title`: explicit 2569 + take-home + legal OT multipliers `1.5x/2x/3x`
  - `description`: take-home after deductions + legal multipliers + monthly payout use case
  - visible `H1`: same 2569 take-home + legal multipliers intent alignment

2) Test gate
- Added `tests/net-salary-overtime-article-t060-snippet.test.mjs`
- RED (before snippet update): `node --test tests/net-salary-overtime-article-t060-snippet.test.mjs` => FAIL (0/3)
- GREEN (after update, fresh rerun): `node --test tests/net-salary-overtime-article-t060-snippet.test.mjs` => PASS (3/3)

3) Build gate
- Fresh verification: `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation.

4) Deploy gate
- `scripts/deploy-railway.ps1` => SUCCESS
- Deployment ID: `4e28e2be-ee84-4045-bd12-c32bf21a953b`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=4e28e2be-ee84-4045-bd12-c32bf21a953b&`

5) Live proof (canonical route)
- `https://www.kamnuanlek.com/บทความ/เงินเดือน-20000-โอที-10-ชั่วโมง/` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/บทความ/เงินเดือน-20000-โอที-10-ชั่วโมง/` => HTTP 200
- Live HTML on both domains includes updated title with `2569` and `1.5x/2x/3x`.

Ready for CMO QA and next P0 assignment.
