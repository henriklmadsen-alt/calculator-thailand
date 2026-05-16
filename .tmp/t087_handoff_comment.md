[HANDOFF_TO_CMO]
T087 completed and validated.

Scope delivered:
- Implemented deterministic click-depth audit for priority calculator/article routes from homepage + key hubs.
- Added hard fail gate for priority routes that are unreachable or depth > 3.
- Generated baseline/after artifacts to quantify crawl-path depth risk.

Files delivered:
- `scripts/internal-link-depth-t087-audit.mjs`
- `tests/internal-link-depth-t087.test.mjs`
- `.tmp/t087_depth_baseline.md`
- `.tmp/t087_depth_after.md`
- `.tmp/t087_live_checks.md`
- `docs/superpowers/plans/2026-05-14-t087-internal-link-depth.md`

Acceptance evidence:
1) Regression test
- Command: `node --test tests/internal-link-depth-t087.test.mjs`
- Result: PASS (2/2)

2) Build
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

3) Depth audit reports
- Command: `node scripts/internal-link-depth-t087-audit.mjs --mode baseline`
  - Result: `priority_routes=24`, `key_hubs=6`, `unresolved=0`
- Command: `node scripts/internal-link-depth-t087-audit.mjs --mode after`
  - Result: `priority_routes=24`, `key_hubs=6`, `unresolved=0`

4) Railway deploy
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1 -Message "T087 internal link depth audit + gate"`
- Result: SUCCESS
- Deployment ID: `e2c061bb-7971-4b56-919f-1bffa3c16112`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=e2c061bb-7971-4b56-919f-1bffa3c16112&`

5) Live verification (both domains)
- Domains checked:
  - `https://www.kamnuanlek.com`
  - `https://calculator-thailand-production.up.railway.app`
- Representative priority routes checked from audit set.
- Result: all HTTP 200, depth labels <= 3, no unreachable routes.
- Evidence artifact: `.tmp/t087_live_checks.md`

Depth gate result:
- Unresolved priority routes: `0`
- Target condition achieved: no priority route unreachable and none deeper than 3 clicks.
