# CAL-197 P0 Checkpoint: Release Integrity Root Cause and Fix

Date: 2026-04-18 (ICT)  
Owner: CTO  
Issue: CAL-197 `UNBLOCK: Railway upload 500 blocks CAL-124 production deploy`

## Wake-Ack Impact

Board escalation set this lane to P0 with hard requirements:
- deploy only from latest `master` head
- post deploy evidence must include release SHA + deployment ID
- verify approved calculators live after deploy (HTTP 200 + visible UI + screenshots)
- attach approved-vs-live route diff and before/after checklist

## Root Cause (Confirmed)

1. Deploy source drift was possible because Railway can deploy from local workspace snapshot; without strict guards this allows stale/non-head deploys.
2. Rollback blast radius was amplified by direct `railway down -y` usage (documented in earlier CAL-197 evidence), which removed the active deployment.
3. No mandatory approved-route inventory diff existed in the deploy gate, so removed/missing calculators could pass basic smoke checks.
4. Stale branch state (`master` behind remote) plus dirty worktree conditions increased the chance of release mismatch or manual bypass.

## Fix Implemented in This Lane

1. Added test-backed route integrity helper library:
- `scripts/release-route-integrity-lib.mjs`
- `scripts/release-route-integrity.test.mjs`

2. Added mandatory live route verification script:
- `scripts/release-route-integrity.mjs`
- Functionality:
  - builds approved calculator inventory from tracked git files (`src/pages/คำนวณ*/index.astro`)
  - fetches live sitemap inventory
  - checks every approved route for HTTP 200 + visible UI in mobile viewport
  - captures screenshots (post-deploy phase)
  - writes before/after JSON+Markdown evidence and regression delta
  - exits non-zero on post-deploy route integrity failures

3. Hardened production deploy pipeline:
- Updated `scripts/deploy-railway.ps1` to:
  - run `release-route-integrity.mjs` **before deploy** (baseline checklist)
  - run `release-route-integrity.mjs` **after deploy** (with screenshots + compare-to-baseline)
  - emit required evidence fields:
    - source SHA
    - GitHub SHA
    - deployed SHA
    - Railway deployment ID
    - before/after checklist paths
    - approved-vs-live diff summary
    - before/after regression count
  - run route integrity checks against live production domain (`https://www.kamnuanlek.com`) by default

4. Updated operator checklist:
- `scripts/deploy-release-checklist.md`
- added explicit route-integrity and evidence-bundle requirements

## Verification Evidence (Local)

1. Unit tests for new route-integrity helpers:
- Command: `node --test scripts/release-route-integrity.test.mjs`
- Result: PASS (`4/4`)

2. Existing calculator/unit regression suite:
- Command: `npm test`
- Result: PASS (`24/24`)

3. Route integrity script dry verification:
- Command: `node scripts/release-route-integrity.mjs --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-197/2026-04-18/manual-route-integrity-20260418-3 --phase before --release-sha local-check --skip-screenshots`
- Result: PASS with generated evidence:
  - `reports/qa/cal-197/2026-04-18/manual-route-integrity-20260418-3/release-route-integrity-before.json`
  - `reports/qa/cal-197/2026-04-18/manual-route-integrity-20260418-3/release-route-integrity-before.md`

4. Post phase failure behavior validation (expected hard fail on mismatch):
- Command: `node scripts/release-route-integrity.mjs --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-197/2026-04-18/manual-route-integrity-20260418-3 --phase after --release-sha local-check --deployment-id local --compare-report reports/qa/cal-197/2026-04-18/manual-route-integrity-20260418-3/release-route-integrity-before.json`
- Result: FAIL (as designed) when approved-vs-live diff is non-zero

5. Deploy script syntax validation:
- Command: PowerShell parser check on `scripts/deploy-railway.ps1`
- Result: OK

## Current Blocker to Full End-to-End Deploy Test

`scripts/deploy-railway.ps1` requires a clean worktree and up-to-date `master` by design.  
Current workspace is intentionally dirty and behind remote, so a real deploy run is blocked until release operator executes from clean head state.

## Expected Production Evidence Bundle After Next Clean Deploy

- Source SHA / GitHub SHA / Deployed SHA
- Railway deployment ID
- Route checklist before: JSON + Markdown
- Route checklist after: JSON + Markdown + screenshots
- Approved-vs-live diff summary
- Before/after regression delta summary
