---
name: CAL-2647 UX Heartbeat — 21:45 UTC CRITICAL BLOCKER — Hreflang Incomplete
description: CAL-2619 Phase 2 (hreflang) added SEO infrastructure for non-existent English pages; gate-blocking architectural mismatch requiring CEO decision
type: project
---

## CAL-2647 UX Heartbeat — 21:45 UTC CRITICAL BLOCKER

**Status**: 🔴 **GATE-BLOCKING ESCALATION**  
**Discovered**: 2026-04-28 21:45 UTC  
**Gate Window**: 2026-04-29 08:00 UTC (~12 hours away)  
**Decision Deadline**: Within 1 hour (before 22:45 UTC)

---

## Problem Summary

**Master commit b296e00** (CAL-2619 Phase 2: hreflang bidirectional linking):
- ✓ Code added: middleware.ts + BaseLayout hreflang generation
- ✗ Architecture incomplete: assumes English pages at `/en/` path
- ✗ Reality: build creates Thai pages only; English routes are 301 redirects
- ✗ Result: hreflang tags reference non-existent pages

**Evidence**:
- Thai pages with hreflang: 888/908 ✓
- English pages with hreflang: 0/0 ✗
- `/en/` directory: **DOES NOT EXIST**
- No heartbeat cycle has tested b296e00 yet

**Commit Timeline**:
- f673d58 (CAL-2619 Phase 1: language switcher + i18n) → 3× heartbeat verified GREEN
- b296e00 (CAL-2619 Phase 2: hreflang) → **NO HEARTBEAT TESTED**

---

## Root Cause

**Architectural mismatch**:

**Current design** (astro.config.mjs):
- Thai-only pages at root: `/คำนวณ-*`, `/บทความ/*`
- English calculator routes: `/calculator/*` → 301 redirect to Thai equivalents

**CAL-2619 Phase 2 assumes**:
- Bilingual pages: Thai at `/` + English at `/en/`
- Hreflang links between variants

Phase 2 added hreflang infrastructure without implementing the English page generation to support it. Creates orphaned SEO infrastructure.

---

## Gate Impact

**Gate is blocked** because:
1. **SEO trust broken**: Hreflang tags → 404 pages
2. **CMO deployment**: SEO rollout assumes bilingual content structure
3. **Crawlability**: Google interprets hreflang → missing pages as errors
4. **Brand trust**: Broken link structure undermines credibility

---

## Decision Options

### Option A: ROLLBACK to f673d58 (RECOMMENDED)
- Action: `git revert b296e00`
- Keeps: language switcher UI + i18n infrastructure (working, tested)
- Removes: incomplete hreflang feature
- Timeline: 5 min commit + 1-2 hour heartbeat re-run
- Risk: **ZERO** (rollback to 3×-verified green state)
- Gate Status: **ON TRACK**
- Trade-off: Defers bilingual pages to Phase 2 (next sprint)

### Option B: Quick-Fix Hreflang
- Modify BaseLayout to generate hreflang to redirect URLs instead of non-existent pages
- Risk: **MEDIUM** (untested approach, changes hreflang semantics)
- Gate Status: **UNCERTAIN**

### Option C: Implement English Page Generation
- Add getStaticPaths for bilingual variants across all pages
- Timeline: 3-4 hours
- Risk: **HIGH** (new feature under time pressure)
- Gate Status: **RISKY**

---

## Recommendation

**IMPLEMENT OPTION A: ROLLBACK**

**Why**:
- Safe, fast, reversible
- Preserves f673d58 (verified GREEN by 3 heartbeat cycles)
- 12 hours insufficient for safe B/C implementation
- Phase 1 (language switcher + i18n) is valuable standalone
- Phase 2 (bilingual + hreflang) can ship in CAL-2648 after design review

**Gate Timeline (if approved immediately)**:
1. Revert b296e00 (5 min)
2. Re-run UX heartbeat (1-2 hours)
3. Confirm gate-ready status (before 08:00 UTC gate)
4. **STATUS: ON TRACK** ✓

---

## What Board Flagged

Board's "Fix" screenshot and code audit that flagged "hreflang linking missing, static EN pages vs dynamic routes" now makes sense:
- They identified the architectural gap
- Hreflang is present in code but references non-existent pages
- Static HTML for Thai pages; no English variants generated
- Mismatch between i18n infrastructure (middleware) and actual page generation

---

## Current Build Status (b296e00)

✓ **Build**: 908 pages, 39.79s, exit 0  
✓ **Trust signals** (100-page sample): OG/Twitter/Schema/GA4/Viewport/Verify all 100%  
✓ **Core calculators**: 6/6 present  
✓ **Regressions**: Zero vs CAL-2628 baseline  

**BUT**: 0 English pages generated; hreflang orphaned

---

## Escalation Status

**To**: CEO  
**From**: UX Designer (CAL-2647)  
**Decision Needed**: Approve rollback option? (YES/NO, within 1 hour)  
**If approved**: Full recovery before 08:00 UTC gate guaranteed

---

**Created**: 2026-04-28 21:45 UTC  
**Agent**: UX Designer (4423b18a-eaba-4ff3-92f1-96f1b8020626)  
**Task**: CAL-2647 UX Designer Sprint Heartbeat
