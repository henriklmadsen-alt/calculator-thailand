# CAL-197 Release Integrity Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent stale/non-head/rollback deploy regressions by enforcing head-only release and mandatory post-deploy approved-route verification evidence.

**Architecture:** Add a dedicated release-route verifier script (Node + Playwright) that computes approved calculator inventory from source, checks live HTTP/UI state, takes screenshots, and emits JSON/Markdown evidence. Integrate it as a required gate in `scripts/deploy-railway.ps1` with before/after snapshots and diff output tied to release SHA and Railway deployment ID.

**Tech Stack:** PowerShell, Node.js test runner, Playwright, Astro page-route conventions

---

### Task 1: Add Test-First Coverage for Route Integrity Helpers

**Files:**
- Create: `scripts/release-route-integrity.test.mjs`
- Create: `scripts/release-route-integrity-lib.mjs`
- Test: `scripts/release-route-integrity.test.mjs`

- [ ] **Step 1: Write failing tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { isApprovedCalculatorPagePath, toRouteFromPagePath, diffApprovedVsLive } from './release-route-integrity-lib.mjs';

test('detects approved calculator page paths', () => {
  assert.equal(isApprovedCalculatorPagePath('src/pages/คำนวณค่าไฟฟ้า/index.astro'), true);
  assert.equal(isApprovedCalculatorPagePath('src/pages/บทความ/คำนวณค่าไฟฟ้า/index.astro'), false);
});

test('converts page path to encoded route', () => {
  assert.equal(
    toRouteFromPagePath('src/pages/คำนวณค่าไฟฟ้า/index.astro'),
    '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/'
  );
});

test('computes missing and unexpected live routes', () => {
  const diff = diffApprovedVsLive(
    ['/a/', '/b/', '/c/'],
    ['/b/', '/c/', '/d/']
  );
  assert.deepEqual(diff.missingLiveRoutes, ['/a/']);
  assert.deepEqual(diff.unexpectedLiveRoutes, ['/d/']);
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `node --test scripts/release-route-integrity.test.mjs`  
Expected: FAIL due missing helper exports/module.

- [ ] **Step 3: Implement minimal helper module**

```js
export function isApprovedCalculatorPagePath(pagePath) { /* ... */ }
export function toRouteFromPagePath(pagePath) { /* ... */ }
export function diffApprovedVsLive(approvedRoutes, liveRoutes) { /* ... */ }
```

- [ ] **Step 4: Re-run test to verify pass**

Run: `node --test scripts/release-route-integrity.test.mjs`  
Expected: PASS.

### Task 2: Build Release Route Integrity Verifier Script

**Files:**
- Create: `scripts/release-route-integrity.mjs`
- Modify: `scripts/release-route-integrity-lib.mjs`
- Test: `scripts/release-route-integrity.test.mjs`

- [ ] **Step 1: Implement script behavior**

```js
// Responsibilities:
// 1) Discover approved routes from src/pages/คำนวณ*/index.astro
// 2) Fetch live sitemap + probe each approved route
// 3) Validate HTTP 200 + visible h1 + visible form/input controls
// 4) Capture screenshots for each checked route (mobile viewport)
// 5) Emit JSON + Markdown report with route checklist + diff
```

- [ ] **Step 2: Add CLI args**

Run mode flags:
- `--base-url`
- `--report-dir`
- `--phase before|after`
- `--release-sha`
- `--deployment-id`
- `--skip-screenshots` (optional, before-phase only)

- [ ] **Step 3: Validate failure conditions**

Script exits non-zero when:
- any approved route is non-200
- visible calculator UI checks fail
- any approved route missing from live route inventory

### Task 3: Enforce Verifier in Deploy Pipeline

**Files:**
- Modify: `scripts/deploy-railway.ps1`
- Modify: `scripts/deploy-release-checklist.md`

- [ ] **Step 1: Add verifier invocation before deploy**

```powershell
# Create before snapshot for route checklist baseline
node scripts/release-route-integrity.mjs --phase before ...
```

- [ ] **Step 2: Add verifier invocation after deploy**

```powershell
# Mandatory post-deploy verification with screenshots
node scripts/release-route-integrity.mjs --phase after ...
```

- [ ] **Step 3: Surface evidence bundle fields in console output**

Required output lines:
- release/source SHA
- deployed SHA + deployment ID
- before report path
- after report path
- approved-vs-live diff summary

- [ ] **Step 4: Update checklist doc**

Add explicit gate that post-deploy verification must include:
- HTTP 200 + visible UI check for approved routes
- screenshot artifact references
- before/after route checklist and diff summary

### Task 4: Verify and Report

**Files:**
- Create: `reports/qa/cal-197/2026-04-18/cal-197-release-integrity-root-cause-and-fix.md`

- [ ] **Step 1: Run tests**

Run: `node --test scripts/release-route-integrity.test.mjs`  
Expected: PASS.

- [ ] **Step 2: Run deploy script dry-run**

Run: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1 -DryRun -SkipAdSensePreflight`  
Expected: dry-run output includes SHA checks and route-integrity evidence paths.

- [ ] **Step 3: Save checkpoint report**

Document:
- confirmed root cause
- new guardrails
- verification results
- remaining blocker (if any)
