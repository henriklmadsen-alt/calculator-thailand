# T086 Link Integrity Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit and harden internal link integrity for priority cluster pages, remove critical broken/chain issues, and ship deterministic regression coverage.

**Architecture:** Build a deterministic dist-based crawler that starts from a priority route seed list (T074-T085 footprint), classifies internal links, and emits markdown reports. Use a node test that runs the audit and fails when unresolved critical classes remain.

**Tech Stack:** Node.js (fs/path/url), Astro build artifacts (`dist`), `node:test`.

---

### Task 1: Add failing regression test shell

**Files:**
- Create: `tests/link-integrity-t086.test.mjs`

- [ ] Write failing test that imports `runT086Audit` and expects zero critical issues.
- [ ] Run test and verify RED (missing module/export expected).

### Task 2: Implement audit script + baseline report

**Files:**
- Create: `scripts/link-integrity-t086-audit.mjs`
- Create: `.tmp/t086_link_integrity_baseline.md`

- [ ] Implement priority route discovery (top calculator routes + T074-T085 article routes).
- [ ] Crawl internal links from route HTML and classify status: `200_ok`, `redirect_ok`, `redirect_chain`, `404`, `5xx`, `timeout`, `invalid_target`.
- [ ] Emit baseline markdown report and expose `runT086Audit` API.
- [ ] Re-run test and verify still RED if critical classes remain.

### Task 3: Fix link issues and close gaps

**Files:**
- Modify: route/content files found by baseline audit

- [ ] Fix all `404`, `5xx`, and `redirect_chain` issues in audited scope.
- [ ] Rebuild and rerun audit until critical unresolved count reaches zero.

### Task 4: Finalize deterministic test + after report

**Files:**
- Modify: `tests/link-integrity-t086.test.mjs`
- Create: `.tmp/t086_link_integrity_after.md`

- [ ] Ensure test executes audit and asserts no unresolved critical issues.
- [ ] Generate after report and confirm delta summary (critical unresolved=0).

### Task 5: Verify, deploy, and live-check evidence

**Files:**
- Create: `.tmp/t086_live_checks.md`

- [ ] Run `node --test tests/link-integrity-t086.test.mjs` and confirm PASS.
- [ ] Run `npm run build` and confirm PASS.
- [ ] Deploy Railway and capture deployment ID.
- [ ] Run live checks on both domains for representative corrected links (200 or single-hop canonical redirect only).
