---
name: CAL-2651 QA Heartbeat — 21:37 UTC BLOCKER (Hreflang Architectural Issue)
description: Master b296e00 (CAL-2619 Phase 2) hreflang implementation is broken — references non-existent /en/ pages, creating broken SEO signals
type: project
---

# CAL-2651 QA Heartbeat — 21:37 UTC BLOCKER CYCLE

**Status**: 🔴 **RELEASE BLOCKER**  
**Master**: b296e00 (CAL-2619: Add hreflang bidirectional linking and i18n middleware)  
**Time Until Gate**: ~10.5 hours (2026-04-29 08:00 UTC)  
**Issue**: CAL-2619 Phase 2 hreflang implementation is architecturally incomplete

---

## Build Verification

**Build Result**: ✓ CLEAN
- Pages built: 903
- Build time: 40.55s
- Exit code: 0
- Errors: None
- Warnings: Standard Sentry/router warnings (non-blocking)

**Core Calculators**: ✓ ALL 6 PRESENT
- electricity-bill ✓
- land-tax ✓
- loan-payment ✓
- overtime-pay ✓
- property-transfer-tax ✓
- unit-converter ✓

---

## Hreflang Status — BROKEN

### Code Intent (BaseLayout.astro lines 39-44)
```javascript
const localeAlternates = [
  { hreflang: 'th-TH', href: thaiUrl },
  { hreflang: 'en', href: englishUrl },  // Points to /en/...
  { hreflang: 'x-default', href: thaiUrl },
  ...alternateLocales.filter((alt) => alt?.hreflang && alt?.href),
];
```

### Actual Build Output
```html
<link rel="alternate" hreflang="th-TH" href="https://www.kamnuanlek.com/.../">
<link rel="alternate" hreflang="x-default" href="https://www.kamnuanlek.com/.../">
<!-- MISSING: hreflang="en" tag -->
```

### Root Cause
- Code attempts to generate hreflang to `/en/` English pages
- No `/en/` directory exists in the build (verified: `ls dist/en` returns "NO /en/ DIRECTORY FOUND")
- Build only creates Thai pages; English `/calculator/*` routes are 301 redirects to Thai equivalents
- **Result**: Hreflang infrastructure is incomplete; intended bilingual structure was not implemented

---

## Release Risk Assessment

### SEO Impact (HIGH)
- Hreflang tags guide Google's crawling and indexing of language variants
- Broken/incomplete hreflang signals confusion to Google about page relationships
- May cause:
  - Duplicate content issues
  - Loss of SEO value across variants
  - Reduced organic visibility
  - Crawlability issues (hreflang → expected page → 404/redirect chain)

### User-Facing Impact (LOW)
- No visible calculator breakage
- Functionality is intact
- Language switcher UI is present (CAL-2619 Phase 1, verified GREEN by prior heartbeats)
- Impact is SEO/indexing, not immediate UX

### Trust Impact (MEDIUM)
- CMO release plan assumes bilingual content structure with proper hreflang
- Publishing broken SEO signals undermines trust in search visibility
- 50,000 THB/month target depends on organic search growth

---

## Decision Needed

**Three remediation options** (from UX Designer escalation CAL-2647):

### Option A: Rollback to f673d58 (RECOMMENDED)
- **Action**: Revert CAL-2619 Phase 2 (remove hreflang infrastructure)
- **Impact**: Keep Phase 1 (language switcher + i18n extraction); defer Phase 2
- **Timeline**: 5 min revert + 1-2 hours heartbeat re-run
- **Risk**: None (rollback to last-tested state)
- **Gate Status**: PASSES (returns to GREEN baseline)
- **Trade-off**: Delays bilingual content to next sprint

### Option B: Quick-Fix Hreflang (MEDIUM RISK)
- **Action**: Modify BaseLayout to reference working pages instead of non-existent `/en/` paths
- **Timeline**: 30 min (code change + build + test)
- **Risk**: Medium (changes hreflang semantics; untested at scale)
- **Gate Status**: Uncertain (new approach; requires verification)

### Option C: Implement English Pages (HIGH RISK)
- **Action**: Add English page generation for all calculators + articles
- **Timeline**: 3-4 hours
- **Risk**: High (major feature under time pressure; likely regressions)
- **Gate Status**: Tight (untested at scale near gate deadline)

---

## QA Certification Status

**QA RECOMMENDATION**: **Option A (Rollback)**

**Rationale**:
- f673d58 is verified GREEN by 3 independent heartbeat cycles (CAL-2614 QA, CAL-2610 CMO, CAL-2609 UX)
- Current master (b296e00) is untested at scale
- 10.5 hours is insufficient to safely implement/verify Option B or C
- Rollback is reversible and protects release schedule
- Phase 1 (language switcher + i18n) is solid and valuable standalone
- Phase 2 (bilingual pages + complete hreflang) belongs in next sprint

**Gate Impact**: Rollback restores master to last-verified GREEN state; gate can proceed.

---

## Implementation Path (Option A)

1. **Revert**: `git revert b296e00` to restore f673d58
2. **Heartbeat Re-run**: Run UX/CMO/QA cycles to verify GREEN state
3. **Confirm Gate**: Report release-ready before 08:00 UTC gate
4. **Document**: Record Phase 2 scope for CAL-2648 (next sprint)

**Timeline**: 5 min revert + 1-2 hours heartbeat verification = **On track for gate**

---

## Evidence Snapshot

- **Master commit**: b296e00 (2026-04-28 21:02:32)
- **Hreflang verification timestamp**: 2026-04-28 21:35-21:37 UTC
- **Build evidence**: 903 pages, 40.55s clean build; 6/6 core calculators present
- **Directory verification**: No `/en/` directory in dist/
- **Code review**: BaseLayout lines 39-44 + line 175 confirm hreflang generation logic
- **Build output**: Only 2 of 3 intended hreflang tags rendered

---

## Next Steps

**Decision required** from CTO/CEO:
- **Approve Option A (Rollback)** → Execute revert + heartbeat cycles immediately
- **Approve Option B/C** → Proceed with implementation (understand timeline risk)

**CTO/CEO Response Deadline**: Within 1 hour to maintain gate schedule

---

**QA Engineer Alpha / Release QA**  
2026-04-28 21:37 UTC
