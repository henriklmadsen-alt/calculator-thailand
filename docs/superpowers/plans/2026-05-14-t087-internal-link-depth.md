# T087 Internal Link Depth Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent shallow orphan risk by enforcing max click-depth 3 and reachability for priority cluster pages.

**Architecture:** Build a deterministic dist-based link graph from internal `<a>` links, run BFS from homepage plus key hub routes, compute min depth for priority routes, and fail when any priority route is unreachable or depth > 3.

**Tech Stack:** Node.js (`fs`, `path`, `node:test`), Astro `dist` output.

---

### Task 1: Add failing regression test

**Files:**
- Create: `tests/internal-link-depth-t087.test.mjs`

- [ ] Write failing test that imports `runT087DepthAudit` from a not-yet-created script.
- [ ] Run test and verify RED (`ERR_MODULE_NOT_FOUND`).

### Task 2: Implement depth audit script + baseline report

**Files:**
- Create: `scripts/internal-link-depth-t087-audit.mjs`
- Create: `.tmp/t087_depth_baseline.md`

- [ ] Build priority route set (T074-T085 clusters + core calculators).
- [ ] Build link graph from built pages.
- [ ] Compute BFS depth from seed routes (`/`, article hub, calculator hubs).
- [ ] Emit baseline report with per-route depth status and fail count.

### Task 3: Enforce gate and generate after report

**Files:**
- Modify: `scripts/internal-link-depth-t087-audit.mjs`
- Create: `.tmp/t087_depth_after.md`
- Modify: `tests/internal-link-depth-t087.test.mjs`

- [ ] Expose stable API for tests and CLI modes (`baseline`, `after`).
- [ ] Ensure unresolved set includes `unreachable` and `depth > 3`.
- [ ] Make test assert zero unresolved on `after` mode.

### Task 4: Verify, deploy, and live evidence

**Files:**
- Create: `.tmp/t087_live_checks.md`

- [ ] Run `node --test tests/internal-link-depth-t087.test.mjs` and confirm PASS.
- [ ] Run `npm run build` and confirm PASS.
- [ ] Deploy via Railway and capture deployment ID.
- [ ] Live-check both domains for representative priority routes (HTTP 200) and include depth report references.
