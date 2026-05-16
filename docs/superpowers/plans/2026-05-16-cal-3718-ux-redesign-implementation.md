# CAL-3718 UX Redesign + Performance/Trust Gates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the CAL-3716 redesign safely across shared layouts and priority pages while enforcing measurable performance (CLS/LCP/INP) and trust-signal gates before QA handoff.

**Architecture:** Ship in small, reversible slices starting from shared layout and style surfaces, then trust components, then priority calculator/article pages. Keep formula logic untouched unless explicitly approved. Every slice must pass local build + targeted tests + audit scripts before moving to the next slice.

**Tech Stack:** Astro 4, Tailwind/theme CSS, Node test runner, repository audit scripts (`scripts/*t083/t084/t085/t086/t087*`), static dist verification.

---

## 1) Candidate file/module map for redesign implementation

### Shared layout shell (highest leverage)
- Modify: `src/layouts/BaseLayout.astro`
  - SEO/trust/meta baseline, global script loading behavior, page wrappers, global analytics hooks.
- Modify: `src/layouts/BlogPostLayout.astro`
  - Article trust shell parity and font/script loading parity with BaseLayout.
- Modify: `src/styles/theme.css`
  - Mobile readability, spacing, contrast, sticky result behavior, trust surface visual consistency.

### Trust components (single source of truth)
- Modify: `src/components/MetadataHeader.astro`
  - Above-the-fold metadata trust markers.
- Modify: `src/components/templates/TrustBadge.astro`
  - Official-source credibility badge.
- Modify: `src/components/templates/TransparencyPanel.astro`
  - Formula/input/steps visibility shell (no formula math changes).
- Modify: `src/components/templates/PublicTrustPanel.astro`
  - Standardized trust disclosure block for calculator/article surfaces.

### Priority page surfaces for rollout (first wave)
- Modify: `src/pages/index.astro`
  - Homepage hero/discovery/trust section polish and performance-safe markup.
- Modify: `src/pages/หมวดหมู่/[category].astro`
  - Category page parity with updated trust shell.
- Modify: `src/pages/เครื่องคำนวณใหม่/index.astro`
  - New-calculator listing parity with trust/perf baseline.
- Modify: `src/pages/คำนวณภาษีเงินได้บุคคลธรรมดา/index.astro`
- Modify: `src/pages/คำนวณผ่อนบ้าน/index.astro`
- Modify: `src/pages/คำนวณเงินเดือนสุทธิ/index.astro`
- Modify: `src/pages/คำนวณค่าไฟฟ้า/index.astro`
- Modify: `src/pages/คำนวณค่าโอที/index.astro`
  - These represent high-intent revenue traffic and are mandatory in the first rollout.

### Verification assets
- Existing test: `tests/cwv-t084-quickwins.test.mjs`
- Existing test: `tests/mobile-readability-t085.test.mjs`
- Existing test: `tests/link-integrity-t086.test.mjs`
- Existing test: `tests/internal-link-depth-t087.test.mjs`
- Existing test: `tests/indexability-t083-conflicts.test.mjs`
- Existing test: `tests/home-loan-ctr-p0.test.mjs` (guard against homepage/conversion regressions)
- Existing script: `scripts/cwv-t084-audit.mjs`
- Existing script: `scripts/t085-mobile-readability-audit.mjs`
- Existing script: `scripts/link-integrity-t086-audit.mjs`
- Existing script: `scripts/internal-link-depth-t087-audit.mjs`
- Existing script: `scripts/indexability-t083-audit.mjs`
- Existing script: `verify_ux.mjs`

---

## 2) Incremental rollout plan (safe slices) + testing strategy

### Task 1: Lock baseline evidence and gates before edits

**Files:**
- Modify: `docs/superpowers/plans/2026-05-16-cal-3718-ux-redesign-implementation.md` (status updates only)
- Output: `.tmp/cal-3718-baseline-cwv.md`
- Output: `.tmp/cal-3718-baseline-mobile.md`
- Output: `.tmp/cal-3718-baseline-link-integrity.md`
- Output: `.tmp/cal-3718-baseline-link-depth.md`
- Output: `.tmp/cal-3718-baseline-indexability.md`

- [ ] **Step 1: Build current state**

Run: `npm run build`  
Expected: build succeeds and `dist/` refreshed.

- [ ] **Step 2: Capture performance/trust baseline artifacts**

Run: `node scripts/cwv-t084-audit.mjs --out .tmp/cal-3718-baseline-cwv.md`  
Run: `node scripts/t085-mobile-readability-audit.mjs --mode baseline --out .tmp/cal-3718-baseline-mobile.md`  
Run: `node scripts/link-integrity-t086-audit.mjs --mode baseline`  
Run: `node scripts/internal-link-depth-t087-audit.mjs --mode baseline`  
Run: `node scripts/indexability-t083-audit.mjs`  
Expected: all reports produced in `.tmp/`.

- [ ] **Step 3: Record baseline pass/fail table in checkpoint note**

Run: `node verify_ux.mjs`  
Expected: explicit baseline percentages printed for trust/mobile/ad safety.

### Task 2: Shared-shell redesign slice (layout + theme only)

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/layouts/BlogPostLayout.astro`
- Modify: `src/styles/theme.css`
- Test: `tests/cwv-t084-quickwins.test.mjs`
- Test: `tests/mobile-readability-t085.test.mjs`

- [ ] **Step 1: Implement shell-only redesign changes**

Rules:
- Do not edit any calculator formula files in `src/lib/*calculator*.ts`.
- Preserve canonical, robots, schema, and language alternates.

- [ ] **Step 2: Run focused tests for shell/performance risk**

Run: `node --test tests/cwv-t084-quickwins.test.mjs`  
Run: `node --test tests/mobile-readability-t085.test.mjs`  
Expected: both pass.

- [ ] **Step 3: Rebuild and rerun audits**

Run: `npm run build`  
Run: `node scripts/cwv-t084-audit.mjs --out .tmp/cal-3718-slice2-cwv.md`  
Run: `node scripts/t085-mobile-readability-audit.mjs --mode after --out .tmp/cal-3718-slice2-mobile.md`  
Expected: no regression vs baseline unresolved counts.

### Task 3: Trust component standardization slice

**Files:**
- Modify: `src/components/MetadataHeader.astro`
- Modify: `src/components/templates/TrustBadge.astro`
- Modify: `src/components/templates/TransparencyPanel.astro`
- Modify: `src/components/templates/PublicTrustPanel.astro`
- Test: `tests/indexability-t083-conflicts.test.mjs`
- Test: `tests/link-integrity-t086.test.mjs`

- [ ] **Step 1: Standardize trust component markup and semantics**

Rules:
- Keep trust copy clear and non-ambiguous.
- External source links must remain `target="_blank"` + `rel="noopener noreferrer"`.
- No hard-coded formula constants may be changed in this slice.

- [ ] **Step 2: Run trust/indexability/link tests**

Run: `node --test tests/indexability-t083-conflicts.test.mjs`  
Run: `node --test tests/link-integrity-t086.test.mjs`  
Expected: both pass.

- [ ] **Step 3: Rebuild and rerun trust/link audits**

Run: `npm run build`  
Run: `node scripts/indexability-t083-audit.mjs`  
Run: `node scripts/link-integrity-t086-audit.mjs --mode after`  
Expected: no new canonical/noindex/link-critical failures.

### Task 4: Priority-page rollout slice

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/หมวดหมู่/[category].astro`
- Modify: `src/pages/เครื่องคำนวณใหม่/index.astro`
- Modify: `src/pages/คำนวณภาษีเงินได้บุคคลธรรมดา/index.astro`
- Modify: `src/pages/คำนวณผ่อนบ้าน/index.astro`
- Modify: `src/pages/คำนวณเงินเดือนสุทธิ/index.astro`
- Modify: `src/pages/คำนวณค่าไฟฟ้า/index.astro`
- Modify: `src/pages/คำนวณค่าโอที/index.astro`
- Test: `tests/home-loan-ctr-p0.test.mjs`
- Test: `tests/internal-link-depth-t087.test.mjs`

- [ ] **Step 1: Apply trust/perf-safe redesign on first-wave pages**

Rules:
- Keep heading hierarchy (`h1` unique, `h2` sections) intact.
- Keep result containers stable (avoid layout shift in result reveal areas).

- [ ] **Step 2: Run route-integrity and conversion-adjacent tests**

Run: `node --test tests/home-loan-ctr-p0.test.mjs`  
Run: `node --test tests/internal-link-depth-t087.test.mjs`  
Expected: both pass.

- [ ] **Step 3: Full slice verification**

Run: `npm run build`  
Run: `node scripts/cwv-t084-audit.mjs --out .tmp/cal-3718-slice4-cwv.md`  
Run: `node scripts/t085-mobile-readability-audit.mjs --mode after --out .tmp/cal-3718-slice4-mobile.md`  
Run: `node scripts/link-integrity-t086-audit.mjs --mode after`  
Run: `node scripts/internal-link-depth-t087-audit.mjs --mode after`  
Run: `node scripts/indexability-t083-audit.mjs`  
Expected: zero new critical unresolved issues.

### Task 5: QA handoff package and marker discipline

**Files:**
- Output: `.tmp/cal-3718-release-audit-summary.md`
- Output: `qa/CAL-3718-QA-HANDOFF.md`

- [ ] **Step 1: Compile before/after deltas**

Include:
- CWV unresolved route delta
- mobile readability failing route delta
- link integrity critical delta
- indexability conflict delta

- [ ] **Step 2: Assert marker boundary**

Gate statements:
- `IMPLEMENTATION COMPLETE` only when all planned file updates are merged and audit/test gates pass.
- `QA VERIFIED` reserved for Release QA confirmation only.

---

## 3) Performance guardrails (CLS/LCP/INP) + measurement commands

### Guardrails (release-blocking)
- `CLS`: p75 <= `0.10` on priority routes.
- `LCP`: p75 <= `2.5s` on priority routes (mobile).
- `INP`: p75 <= `200ms` on priority routes (mobile).
- No new blocking CSS/JS signals in top-route CWV audit report.

### Local/lab measurement commands
- Build: `npm run build`
- Static CWV heuristics: `node scripts/cwv-t084-audit.mjs --out .tmp/cal-3718-cwv-after.md`
- Mobile readability heuristics: `node scripts/t085-mobile-readability-audit.mjs --mode after --out .tmp/cal-3718-mobile-after.md`
- Trust/indexability: `node scripts/indexability-t083-audit.mjs`
- Link stability: `node scripts/link-integrity-t086-audit.mjs --mode after`
- Link-depth stability: `node scripts/internal-link-depth-t087-audit.mjs --mode after`

### Live-field validation commands (post-deploy)
- `curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://www.kamnuanlek.com/คำนวณภาษีเงินได้บุคคลธรรมดา/&strategy=mobile" > .tmp/cal-3718-psi-income-tax.json`
- Repeat for:
  - `/คำนวณผ่อนบ้าน/`
  - `/คำนวณเงินเดือนสุทธิ/`
  - `/คำนวณค่าไฟฟ้า/`
  - `/คำนวณค่าโอที/`
- Review `loadingExperience.metrics` values for `LARGEST_CONTENTFUL_PAINT_MS`, `CUMULATIVE_LAYOUT_SHIFT_SCORE`, `INTERACTION_TO_NEXT_PAINT`.

---

## 4) Risk list for formula/trust regressions + mitigation

1. **Risk:** formula-sensitive calculator logic changed during UI refactor.
- Mitigation: do not modify `src/lib/*calculator*.ts` in redesign slices; if any formula edit is required, pause and request `FORMULA APPROVED` from CEO before merge.

2. **Risk:** trust component text implies guarantees not backed by source.
- Mitigation: source labels must point to explicit authority links; avoid absolute claims; keep “for planning/estimate” disclaimers where applicable.

3. **Risk:** trust blocks or sticky results create CLS on mobile.
- Mitigation: reserve vertical space, maintain fixed min-heights for interactive controls, rerun T084/T085 after each slice.

4. **Risk:** canonical/robots/schema regressions from layout edits.
- Mitigation: run `tests/indexability-t083-conflicts.test.mjs` and `node scripts/indexability-t083-audit.mjs` on every slice touching layouts.

5. **Risk:** internal links break in high-intent clusters and reduce crawl depth.
- Mitigation: run T086/T087 audits after each page rollout slice; block release on new `404`, `redirect_chain`, `unreachable`, or `depth_gt_3`.

6. **Risk:** ad integration clashes with trust/result zones (UX trust erosion).
- Mitigation: preserve `GuardedAdSlot` placement and reveal triggers; verify through `verify_ux.mjs` and targeted HTML checks in built pages.

7. **Risk:** encoded Thai paths mismatch canonical or sitemap entries.
- Mitigation: always verify decoded route-path equivalence in dist outputs and re-run sitemap/indexability checks before QA handoff.

---

## Checkpoint completion rule for CAL-3718

- Do not claim `IMPLEMENTATION COMPLETE` until:
  - all slices above are executed,
  - required tests are passing,
  - required audit outputs are attached,
  - QA handoff file is written and scoped.

