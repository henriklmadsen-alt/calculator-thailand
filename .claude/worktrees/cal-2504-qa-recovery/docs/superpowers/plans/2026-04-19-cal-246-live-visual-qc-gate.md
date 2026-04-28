# CAL-246 Live Visual QC + Release Gate Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add mandatory live visual QC (Thai text rendering + contrast + layout + route presence) to release QA and deploy gates, with incident-cycle evidence output.

**Architecture:** Create a dedicated visual gate script (`release-visual-integrity.mjs`) that checks required surfaces in light/dark mode, captures screenshots, emits JSON/Markdown evidence, and exits non-zero on post-phase failures. Integrate the script into `deploy-railway.ps1` for both pre-deploy baseline and post-deploy enforcement. Run one immediate CAL-246 incident cycle and publish evidence.

**Tech Stack:** Node.js, Playwright, PowerShell deploy pipeline, markdown/json report artifacts

---

### Task 1: Add test-first coverage for visual helper logic

**Files:**
- Create: `scripts/release-visual-integrity-lib.mjs`
- Create: `scripts/release-visual-integrity.test.mjs`
- Test: `scripts/release-visual-integrity.test.mjs`

- [ ] **Step 1: Write failing tests**
- [ ] **Step 2: Run tests and confirm failure**
- [ ] **Step 3: Implement minimal helper logic**
- [ ] **Step 4: Re-run tests and confirm pass**

### Task 2: Implement visual integrity checker

**Files:**
- Create: `scripts/release-visual-integrity.mjs`
- Modify: `scripts/release-visual-integrity-lib.mjs`
- Test: `scripts/release-visual-integrity.test.mjs`

- [ ] **Step 1: Implement required surfaces and modes**
- [ ] **Step 2: Add checks for mojibake/Thai rendering, contrast, overflow, and route availability**
- [ ] **Step 3: Emit markdown/json pass-fail matrix and screenshots**
- [ ] **Step 4: Enforce non-zero exit on post-phase failures**

### Task 3: Integrate visual checker into deploy gate

**Files:**
- Modify: `scripts/deploy-railway.ps1`
- Modify: `scripts/deploy-release-checklist.md`

- [ ] **Step 1: Add pre-deploy visual baseline invocation**
- [ ] **Step 2: Add post-deploy visual enforcement invocation**
- [ ] **Step 3: Surface visual evidence paths and summary in deploy output**
- [ ] **Step 4: Update checklist to include Thai rendering + contrast gate requirements**

### Task 4: Execute live incident visual cycle and publish evidence

**Files:**
- Create: `reports/qa/cal-246/2026-04-19/live-visual-qc-*/release-visual-integrity-*.{json,md}`
- Modify: `reports/qa/cal-246/2026-04-18/cal-246-release-qa-inventory-regression-gate.md`

- [ ] **Step 1: Run live visual cycle against production domain**
- [ ] **Step 2: Capture screenshots and pass/fail matrix**
- [ ] **Step 3: Append CTO-facing CAL-246 heartbeat update with defects/evidence**

### Task 5: Verify before completion

**Files:**
- Test: `scripts/release-visual-integrity.test.mjs`
- Test: `scripts/release-route-integrity.test.mjs`
- Test: `src/lib/*.test.ts`

- [ ] **Step 1: Run helper/unit test suites**
- [ ] **Step 2: Run the new visual script in before/after modes**
- [ ] **Step 3: Verify deploy script parses after integration**
- [ ] **Step 4: Report only evidence-backed status**
