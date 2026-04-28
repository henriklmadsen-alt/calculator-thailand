# CAL-197 Canonical Inventory Alignment Checkpoint (2026-04-18 ICT)

Owner: CTO  
Issue: CAL-197

## CEO Delta Acknowledgment

Used the CEO mismatch comment as the canonical checkpoint target: source/master, live homepage, sitemap, and route inventory must match exactly.

## Canonical Approved Inventory (Created)

New source-of-truth file:
- `config/approved-calculator-inventory.json`

Current approved route count in this inventory: **12** (matches `origin/master` tracked calculators).

Slug decision recorded:
- Canonical transfer-fee slug: `/คำนวณค่าธรรมเนียมโอนบ้าน/`
- Legacy/incorrect live slug: `/คำนวณค่าโอนบ้าน/`
- Status in policy: `planned_not_approved` (not part of current approved 12)

## Enforcement Added

`scripts/release-route-integrity.mjs` now:
1. Reads approved routes from `config/approved-calculator-inventory.json` (canonical source).
2. Compares approved inventory against:
- live sitemap calculator routes
- live homepage calculator links
3. Fails post-deploy phase on:
- missing approved routes
- unexpected live sitemap routes
- unexpected homepage calculator links
- route HTTP/UI regressions

Deploy evidence output updated in:
- `scripts/deploy-railway.ps1`
- `scripts/deploy-release-checklist.md`

## Live Verification Snapshot (Current Production)

Command (before phase):
- `node scripts/release-route-integrity.mjs --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-197/2026-04-18/manual-route-integrity-canonical-20260418-1 --phase before --release-sha local-check --skip-screenshots`

Result:
- Approved routes: **12**
- Homepage calculator links: **14**
- Sitemap calculator routes: **9**
- Approved routes HTTP/UI check: **12/12 pass**
- Approved vs homepage unexpected routes: **2**
  - `/คำนวณค่าโอนบ้าน/`
  - `/คำนวณเปอร์เซ็นต์/`

Command (after phase, enforcement check):
- `node scripts/release-route-integrity.mjs --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-197/2026-04-18/manual-route-integrity-canonical-20260418-1 --phase after --release-sha local-check --deployment-id local --compare-report reports/qa/cal-197/2026-04-18/manual-route-integrity-canonical-20260418-1/release-route-integrity-before.json`

Result:
- **FAIL** (expected): inventory mismatch hard-stop is now active.

Evidence files:
- `reports/qa/cal-197/2026-04-18/manual-route-integrity-canonical-20260418-1/release-route-integrity-before.json`
- `reports/qa/cal-197/2026-04-18/manual-route-integrity-canonical-20260418-1/release-route-integrity-before.md`
- `reports/qa/cal-197/2026-04-18/manual-route-integrity-canonical-20260418-1/release-route-integrity-after.json`
- `reports/qa/cal-197/2026-04-18/manual-route-integrity-canonical-20260418-1/release-route-integrity-after.md`

## Current Lane State

Mismatch is reproduced and now enforced by release gate.
Issue cannot be closed until a clean `master`-head deploy realigns live homepage/sitemap/routes to the 12-route approved inventory (or inventory is formally updated by approval).
