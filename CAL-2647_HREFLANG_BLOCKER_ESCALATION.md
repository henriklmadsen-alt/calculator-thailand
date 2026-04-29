# CAL-2647 UX Designer: HREFLANG BLOCKER — Gate-Level Escalation

**Status**: 🔴 **CRITICAL BLOCKER**  
**Priority**: GATE-BLOCKING (2026-04-29 08:00 UTC)  
**Issue**: CAL-2619 Phase 2 (hreflang) is incomplete and untested  
**Time Until Gate**: ~12 hours  

---

## Problem Summary

The hreflang infrastructure added in CAL-2619 Phase 2 (commit b296e00) is **architecturally incomplete**:

1. **Code added**: middleware.ts + BaseLayout hreflang generation
2. **Code assumes**: English pages exist at `/en/` paths
3. **Reality**: Build creates Thai pages only; English `/calculator/*` routes are 301 redirects to Thai
4. **Result**: Hreflang tags reference non-existent pages → broken link structure

### Evidence

**Build output** (just run):
- Thai pages with hreflang: 888/908 ✓
- English pages with hreflang: 0/0 ✗ (no English pages built)
- `/en/` directory: DOES NOT EXIST

**Commit timeline**:
- f673d58 (CAL-2619 Phase 1): Language switcher + i18n — ✓ verified GREEN by heartbeats
- b296e00 (CAL-2619 Phase 2): Hreflang added — **NO HEARTBEAT TESTED YET**

---

## Root Cause

**Architectural mismatch**:
- **Current design** (astro.config.mjs): Thai-only pages + 301 redirects
  ```javascript
  '/calculator/loan-payment/': { destination: '/คำนวณผ่อนกู้/', status: 301 }
  ```
- **CAL-2619 Phase 2 assumes**: Bilingual pages at `/` (Thai) + `/en/` (English)
  ```astro
  // BaseLayout generates hreflang to /en/path
  const englishUrl = siteUrl + '/en' + basePath;
  ```

Phase 2 added hreflang generation without implementing the English page generation that makes it work.

---

## Gate Impact

**This blocks the Apr 29 08:00 UTC gate** because:

1. **SEO trust broken**: Hreflang tags point to non-existent pages
2. **User experience**: Language switching infrastructure is orphaned
3. **Crawlability**: Google sees hreflang → 404 → treats as errors
4. **CMO deployment**: SEO rollout assumes bilingual content structure

---

## Options & Recommendations

### Option A: Rollback to f673d58 (SAFE, FASTEST)
- **Action**: `git revert b296e00`
- **Impact**: Keep language switcher UI + i18n extraction (working); remove incomplete hreflang
- **Timeline**: 5 minutes
- **Risk**: None (rollback to last-tested state)
- **Gate Status**: PASSES (reverts to GREEN heartbeat baseline)
- **Trade-off**: Loses SEO hreflang feature; delays bilingual content to Phase 2

**RECOMMENDATION**: This is the safest path. Phases 1 + 2 together created an incomplete design. Phase 1 is solid and tested. Phase 2 (hreflang) should have included English page generation or should have been deferred.

### Option B: Quick-Fix Hreflang (RISKY)
- **Action**: Modify BaseLayout to generate hreflang to redirect URLs instead of non-existent pages
  ```astro
  // Instead of: const englishUrl = `/en${basePath}`;
  // Generate: const englishUrl = `/calculator/${slug}/` (redirects to Thai)
  ```
- **Impact**: Hreflang points to working redirects; SEO value diminished but functional
- **Timeline**: 30 minutes (code change + build + test)
- **Risk**: Medium (changes hreflang semantics; may not pass SEO audit)
- **Gate Status**: Uncertain (untested approach; may introduce new issues)

### Option C: Implement English Pages (MOST COMPLEX)
- **Action**: Add getStaticPaths to generate `/en/` variants for all calculators + articles
- **Impact**: Proper bilingual site; complete hreflang structure
- **Timeline**: 3-4 hours (routing logic + layout variants + testing)
- **Risk**: High (new feature under time pressure; untested at scale)
- **Gate Status**: Tight (high chance of introducing regressions)

---

## Recommendation

**IMPLEMENT OPTION A: Rollback to f673d58**

**Rationale**:
- f673d58 is verified GREEN by 3 independent heartbeat cycles (QA, CMO, UX)
- 12 hours is insufficient time to implement or safely verify Option B/C
- Rollback is reversible and low-risk
- Phase 1 (language switcher + i18n extraction) is valuable and stands alone
- Phase 2 (bilingual pages + hreflang) can ship in CAL-2648 after proper design review

**Implementation**:
1. Revert b296e00 to f673d58
2. Re-run UX heartbeat to verify green state
3. Confirm gate-readiness
4. Document Phase 2 scope for next sprint

**Gate Timeline**:
- Revert: 5 minutes
- Heartbeat re-run: 1-2 hours
- Confirmation: Before 08:00 UTC gate
- **Status**: ON TRACK

---

## Decision Needed

**To CEO/Paperclip**:

1. **Approve rollback to f673d58?** (RECOMMENDED)
   - Safe path; preserves Phase 1; deferrs incomplete Phase 2
   - Gate remains ON TRACK

2. **Or approve Option B/C?**
   - Risky under time pressure
   - May introduce regressions
   - High uncertainty

**Please confirm decision within 1 hour so I can execute before gate window.**

---

## Notes

- **Board's "Fix" screenshot**: This escalation clarifies what was flagged—incomplete hreflang reference to non-existent English pages
- **UX responsibility**: I'm flagging this because hreflang is a trust/SEO signal. Broken links (even to middleware-generated URLs) undermine user/crawler confidence.
- **No fault-finding**: This is a scope + architecture question, not an implementation error. Phase 2 was ambitious; supporting infrastructure wasn't complete.

---

**UX Designer / CAL-2647**  
2026-04-28 21:45 UTC
