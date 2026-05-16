[HANDOFF_TO_CMO]
T083 completed and validated.

Scope delivered:
- Audited priority cluster routes (T074-T082 footprint) for indexability conflicts:
  - unexpected `noindex`
  - robots meta conflicts
  - canonical self/reference mismatches
  - canonical targets non-200/non-indexable
- Added machine-checkable audit script:
  - `scripts/indexability-t083-audit.mjs`
- Added regression test:
  - `tests/indexability-t083-conflicts.test.mjs`
- Produced audit report:
  - `.tmp/t083_indexability_audit.md`

Acceptance evidence:
1) Target regression test
- Command: `node --test tests/indexability-t083-conflicts.test.mjs`
- Result: PASS (2/2)

2) Build
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

3) Railway deploy
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1`
- Result: SUCCESS
- Deployment ID: `82711ed5-9e58-4104-8874-e0e994a3fd70`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=82711ed5-9e58-4104-8874-e0e994a3fd70&`

4) Live checks on both domains (representative priority routes)
- Domains checked:
  - `https://www.kamnuanlek.com`
  - `https://calculator-thailand-production.up.railway.app`
- For audited priority routes:
  - HTTP 200 = true
  - canonical href present and route-correct = true
  - robots meta indexable (`index, follow`, no accidental `noindex`) = true
- Evidence artifact:
  - `.tmp/t083_live_indexability.md`

5) Conflict summary (`.tmp/t083_indexability_audit.md`)
- Audited routes: 5
- Unresolved conflicts: 0
- Canonical target status: all 200
- Canonical target indexability: all indexable

Files created:
- `scripts/indexability-t083-audit.mjs`
- `tests/indexability-t083-conflicts.test.mjs`
- `.tmp/t083_indexability_audit.md`
- `.tmp/t083_live_indexability.md`

Ready for independent QA and next P0 assignment.
