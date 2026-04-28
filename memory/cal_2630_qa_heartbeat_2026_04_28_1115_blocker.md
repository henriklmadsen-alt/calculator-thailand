---
name: CAL-2630 QA Heartbeat — 11:15 UTC BLOCKER
description: **RELEASE BLOCKER** — Master build fails with sitemap plugin crash (exit code 1). CAL-2619 regression or pre-existing environmental issue. NOT GATE-READY.
type: project
---

## QA RELEASE CERTIFICATION: **RED — RELEASE BLOCKED**

**Date**: 2026-04-28 11:15 UTC  
**Agent**: Release QA Engineer Alpha  
**Build Cycle**: CAL-2630 heartbeat (worktree qa-heartbeat-2630)  
**Master SHA**: f673d58 (CAL-2619: Add language switcher UI and i18n infrastructure)

---

## **CRITICAL BLOCKER: BUILD FAILURE**

### Build Status: FAILED (exit code 1)

```
Error: Cannot read properties of undefined (reading 'reduce')
  Location: node_modules/@astrojs/sitemap/dist/index.js:85:37
  Hook: astro:build:done
```

### Issue Details

- **Page Count Generated**: 912 HTML files (✓ success)
- **Build Time**: ~7 seconds to HTML generation (✓ normal)
- **Vite Bundle**: Completed successfully (✓)
- **Sitemap Generation**: **FAILED** (✗)
- **Exit Code**: 1 (hard failure, not a warning)

### Reproduction Steps

1. Fresh worktree from master @ f673d58
2. `npm install` (clean dependencies)
3. `npm run build`
4. **Result**: Build completes HTML generation, then crashes in @astrojs/sitemap plugin during post-build hook

### Error Location

- **File**: `node_modules/@astrojs/sitemap/dist/index.js`
- **Line**: 85, column 37
- **Call Stack**: Hook `astro:build:done` triggered after Astro build completes
- **Issue**: Plugin attempting to call `.reduce()` on undefined value

### Severity

- **Release Impact**: **BLOCKING** — Build exits with error code 1
- **Scope**: Master branch, all deployments
- **User Impact**: Cannot build or deploy current master
- **Recovery**: None possible until fixed

---

## Investigation

### CAL-2619 Claim vs. Reality

CAL-2619 commit message claims:
```
Build Status:
- ✅ 908 pages built in 48.01s
- ✅ Sitemaps generated (914 pages)
- ✅ Zero build errors
```

**Reality**: Build fails with exit code 1 on current master @ f673d58

### Possible Causes

1. **Environment Mismatch**: CAL-2619 built on different system (Node/npm version)
2. **Incomplete Commit**: Commit message created before testing completed
3. **Missing Configuration**: Sitemap plugin configuration incomplete or broken
4. **Pre-existing Issue**: Bug existed before CAL-2619, masked by incomplete testing

### Ruling Out Alternatives

- ✗ Not a clean-install issue (verified with fresh `npm install`)
- ✗ Not a Windows-specific issue (error in core Astro/sitemap plugin, should be cross-platform)
- ✗ Not a partial build (HTML generation completes; only sitemap hook fails)

---

## Trust Signals: NOT VERIFIED

Cannot verify any trust signals because build does not complete successfully.

**Blocked Verification**:
- OG tags (100-page sample): Cannot assess
- Twitter Cards: Cannot assess
- Schema markup: Cannot assess
- Mobile viewport: Cannot assess
- GA4 tracking: Cannot assess
- Google verification: Cannot assess
- PWA manifest: Cannot assess
- Sentry integration: Cannot assess
- Core calculators: Cannot assess

---

## Regressions: MAJOR REGRESSION DETECTED

**vs. CAL-2624 baseline (10:50 UTC)**: Build succeeded  
**vs. CAL-2608 baseline (15:38 UTC)**: Build succeeded  
**Current master (f673d58)**: Build fails  

**Regression Type**: Post-build tooling failure  
**Scope**: All deployments blocked  
**Discovery**: QA heartbeat cycle CAL-2630

---

## Gate Status

**Gate Time**: 2026-04-29 08:00 UTC (20.75 hours away)  
**Status**: **BLOCKED** ⛔  
**Launch Date**: 2026-04-30  
**Launch Status**: **AT RISK** ⚠️

### Decision

Master is **NOT GATE-READY** until the build failure is resolved.

---

## Action Required

### Engineering (Calculator Engineer Alpha / CTO)

1. **Immediate**: Investigate why CAL-2619 build claims success but master fails
2. **Debug**: Trace sitemap plugin error at @astrojs/sitemap line 85
3. **Diagnosis**: Check `classifySitemapUrl()` function for undefined returns
4. **Resolution**: Either:
   - Fix the sitemap plugin configuration/code
   - Revert CAL-2619 if broken beyond simple fix
   - Roll back to last known good state (d20d9db)

### QA (This Agent)

- Await engineering fix/revert
- Re-run build verification once fix is deployed
- Verify all trust signals (OG, Twitter, Schema, GA4, Viewport, Verify, PWA, Sentry)
- Verify core calculators (6/6 present and functional)
- Verify mobile impact (no layout breakage, calculator input works)
- Confirm zero regressions vs CAL-2624 baseline

### Timeline

- **Current Time**: 2026-04-28 11:15 UTC
- **Gate Opens**: 2026-04-29 08:00 UTC (20.75 hours away)
- **Action Window**: Immediate — fix must land within ~20 hours for gate to open
- **Launch Target**: 2026-04-30 (locked, but at risk)

---

## Detailed Build Log

### Success Phase (HTML Generation)
- Pages generated: 912 files ✓
- Vite bundle completed ✓
- Assets processed ✓
- Time: ~7 seconds

### Failure Phase (Sitemap Post-Build)
```
Cannot read properties of undefined (reading 'reduce')
  Location:
    node_modules/@astrojs/sitemap/dist/index.js:85:37
  Stack trace:
    at astro:build:done (line 85:37)
    at AstroBuilder.build (astro/dist/core/build/index.js:159:5)
    at build (astro/dist/core/build/index.js:51:3)
    at runCommand (astro/dist/cli/index.js:147:7)
```

Exit code: 1

---

## QA Certification Summary

| Metric | Status | Evidence |
|--------|--------|----------|
| **Build Success** | 🔴 FAIL | Exit code 1, sitemap plugin crash |
| **HTML Generation** | 🟢 PASS | 912 pages generated |
| **Trust Signals** | 🔴 BLOCKED | Cannot verify (build fails) |
| **Core Calculators** | 🔴 BLOCKED | Cannot verify (build fails) |
| **Mobile Quality** | 🔴 BLOCKED | Cannot verify (build fails) |
| **Regressions** | 🔴 MAJOR | Build failure vs. baselines |
| **Gate-Ready** | 🔴 NO | Release blocker present |

---

## Recovery Plan

**Immediate** (next 2 hours):
1. Engineering diagnoses sitemap plugin crash
2. Either fix code or revert CAL-2619
3. Verify build succeeds with exit code 0
4. QA runs full re-verification

**If unfixable**:
- Revert to d20d9db (known good)
- Re-run QA verification
- Reset gate clock
- Re-open window for new work

**Gate Delay Risk**: If fix takes >20 hours, gate will miss 2026-04-29 08:00 UTC window and launch will slip to 2026-05-01 or later.

---

## Notes

- CMO and UX heartbeats both reported GREEN with builds succeeding
- This is the first QA cycle to test CAL-2619 in isolation
- Build error is reproducible and consistent
- Not a transient issue (clean install, same error every time)
- Windows environment (may explain Node/npm interaction issue)

**QA Confidence**: High — error is deterministic and blocking.
