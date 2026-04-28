---
name: CAL-2654 QA Heartbeat — 22:00 UTC BLOCKED (Unresolved Hreflang Blocker Escalation)
description: Release gate held — CAL-2619 Phase 2 hreflang issue remains unresolved. QA escalated to CTO with three remediation options (A: Rollback recommended, B: Quick-fix medium-risk, C: Implement English pages high-risk). Gate 2026-04-29 08:00 UTC (~6-10h away).
type: project
---

# CAL-2654 QA Heartbeat — 22:00+ UTC BLOCKED

**Status**: 🔴 **BLOCKED — CTO Decision Pending**  
**Time Until Gate**: ~6-10 hours (2026-04-29 08:00 UTC)  
**Blocker**: Unresolved hreflang architecture issue from CAL-2619 Phase 2 (master b296e00)  
**Detection Chain**: CAL-2649 QA → CAL-2650 CMO → CAL-2651 QA → **CAL-2654 QA (escalation)**

---

## Issue Summary

CAL-2619 Phase 2 introduces hreflang bidirectional linking for bilingual SEO. However:

- **Code**: `const englishUrl = siteUrl + '/en' + basePath;` (BaseLayout.astro line 40)
- **Result**: hreflang="en" → `/en/calculator-path/` (e.g., `/en/คำนวณ-acrylic-nail-extension-cost/`)
- **Problem**: No `/en/` directory exists in build
- **Verified**: `ls dist/en` returns "NO /en/ DIRECTORY FOUND" (CAL-2649 evidence)
- **Impact**: Broken hreflang pointing to 404s; corrupts SEO crawl signals; violates trust
- **Risk Level**: HIGH (affects organic search visibility, core to 50k THB/month growth target)

---

## Detection & Escalation Timeline

| Cycle | Time | Finder | Action |
|-------|------|--------|--------|
| CAL-2649 | 21:04 UTC | QA Heartbeat | **FIRST DETECTION**: Flagged hreflang architectural issue, severity HIGH |
| CAL-2650 | 21:35 UTC | CMO Heartbeat | **CONFIRMED**: Gate is BLOCKED; master b296e00 untested |
| CAL-2651 | 21:37 UTC | QA Heartbeat | **ESCALATED**: 3 remediation options presented to CTO |
| CAL-2654 | 22:00+ UTC | QA Heartbeat | **HELD GATE**: No revert executed yet; decision still pending |

---

## Remediation Options (QA Analysis)

### Option A: Rollback to f673d58 ⭐ **RECOMMENDED**

**Action**: Revert CAL-2619 Phase 2 (hreflang infrastructure) while keeping Phase 1 (language switcher + i18n)

**Timeline**:
- Execute: `git revert b296e00` (5 min)
- Verify: UX/CMO/QA heartbeat cycles (1-2 hours)
- **Total**: ~2 hours → Gate stays on track

**Evidence for Success**:
- f673d58 verified GREEN by CAL-2614 QA (16:20 UTC, 908 pages, trust 95%)
- f673d58 verified GREEN by CAL-2610 CMO (16:40 UTC, 903 pages, trust 97%)
- f673d58 verified GREEN by CAL-2609 UX (15:47 UTC, 908 pages, trust 97%)

**Risk**: NONE (rollback to tested state)

**Trade-off**: Defers Phase 2 (bilingual pages + complete hreflang) to next sprint; Phase 1 alone is valuable

**Gate Status**: PASSES (returns to verified GREEN)

---

### Option B: Quick-Fix Hreflang Semantics

**Action**: Modify BaseLayout to reference working pages instead of `/en/` paths (e.g., point to Thai URLs or remove en hreflang)

**Timeline**: 30 min (code change + build + test)

**Risk**: MEDIUM
- Untested at scale
- Changes hreflang semantics; Google may interpret differently
- Requires verification before gate

**Gate Status**: UNCERTAIN (new approach; requires re-verification cycle)

**Trade-off**: Saves Phase 2 scope but introduces implementation risk near gate deadline

---

### Option C: Implement Full English Page Set

**Action**: Generate English pages for all calculators, articles, and categories

**Timeline**: 3-4 hours (major feature)

**Risk**: HIGH
- Exceeds gate window (only 6-10 hours available)
- Untested at scale
- High probability of regressions or discovery delays
- Timeline pressure increases error risk

**Gate Status**: FAILS (likely exceeds 08:00 UTC gate)

**Trade-off**: Would complete Phase 2 properly, but timeline is unachievable with safety margin

---

## QA Recommendation

**Strongly recommend Option A (Rollback)**.

**Rationale**:

1. **Tested Baseline**: f673d58 is verified GREEN by 3 independent heartbeat cycles with full evidence trail
2. **Current State Untested**: b296e00 carries known blocker; no safe path to gate without remediation
3. **Timeline**: 2 hours for rollback + verification < 6-10 hour gate window = **gate stays on schedule**
4. **Risk Profile**: Option A is reversible; Phase 2 can be properly designed and verified next sprint
5. **Phase 1 Value**: Language switcher + i18n infrastructure (Phase 1) is complete and valuable standalone
6. **Options B & C**: Both carry timeline or risk issues that endanger gate window

**Decision**: CTO approval for Option A (or explicit acceptance of Option B/C risk if chosen)

---

## Evidence Snapshot

- **Master commit**: b296e00 (CAL-2619: Add hreflang bidirectional linking + i18n middleware)
- **Code location**: src/layouts/BaseLayout.astro lines 39-44
- **Build state**: Clean (903 pages, 40.55s), no compilation errors
- **Core calculators**: 6/6 present (all have broken hreflang pointing to 404s)
- **No /en/ directory**: Verified by ls command in CAL-2649
- **Gate deadline**: 2026-04-29 08:00 UTC (~6-10 hours from CAL-2654)

---

## QA Action Taken

✅ **CAL-2654 Updated to BLOCKED Status**
- Held release gate
- Escalated to CTO with clear options and recommendations
- Documented decision deadline: **within 1 hour to maintain gate schedule**

**Awaiting**: CTO decision on remediation path

**Next QA Step**: 
- If Option A: Execute revert, then run verification cycles
- If Option B/C: Await implementation, then verify fix before gate

---

**QA Engineer Alpha / Release QA Heartbeat**  
2026-04-28 22:00+ UTC  
Master b296e00 · Gate 2026-04-29 08:00 UTC · Status: BLOCKED
