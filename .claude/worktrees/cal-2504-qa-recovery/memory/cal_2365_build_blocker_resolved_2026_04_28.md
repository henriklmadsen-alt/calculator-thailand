---
name: CAL-2365 Build Blocker Resolved — Day 2 Monitoring
description: Critical build blocker fixed (Sentry incompatibility + syntax errors)
type: project
---

# CAL-2365 — Build Blocker RESOLVED

**Date:** 2026-04-28 14:16 UTC (Day 2 monitoring checkpoint)
**Status:** ✅ RESOLVED
**Build:** 908 pages, 64.05s, exit code 0
**Sitemaps:** Generated and verified

## Issues Found & Fixed

### 1. Sentry Integration Blocker (CRITICAL)
**Symptom:** Cannot find module 'dist/renderers.mjs'
**Root Cause:** @sentry/astro using deprecated configuration options that interfered with Astro's static build renderers generation
**Solution:** Temporarily disabled Sentry in astro.config.mjs
**Impact:** Non-critical for gate window; Sentry is development/monitoring tool, not core functionality
**Follow-up:** CAL-2366 (post-gate) — Migrate to proper sentry.client.config.mjs

### 2. Exchange Rate Calculator Syntax Error
**File:** src/pages/คำนวณอัตราแลกเปลี่ยน/index.astro
**Line:** 83
**Issue:** Script tag closing and article tag opening on same line without newline
**Before:** `</script /> <article>`
**After:** Proper line separation
**Commit:** d75ad67

### 3. Credit Card Interest Calculator Syntax Error
**File:** src/pages/คำนวณดอกเบี้ยบัตรเครดิต/index.astro
**Line:** 61
**Issue:** Stray comma in FAQ array creating empty element
**Before:** `}, ,` (orphan comma)
**After:** Removed stray comma
**Commit:** d75ad67

## Build Verification Results

✅ **Clean rebuild:** 908 pages generated in 64.05 seconds
✅ **Vite bundles:** Both client and server bundles built successfully
✅ **Page generation:** All pages rendering without module resolution errors
✅ **Sitemaps:** sitemap-index.xml, sitemap-0.xml, sitemap.xml all generated and valid
✅ **Article pages:** All 3+ article pages verified rendering with Phase 2 UX templates
✅ **Mobile responsive:** Verified on 375px baseline (mobile-first)
✅ **Exit code:** 0 (success)

## Gate Readiness

- **Gate checkpoint:** 2026-04-29 08:00 UTC
- **Build status:** ✅ Green light
- **UX verification:** Phase 2 templates intact, no regressions
- **Template consistency:** Maintained across all page types
- **Trust signals:** Live site verification ready
- **Sitemaps:** Ready for GSC submission (CTO task)

## Non-Launch-Blocking Follow-Ups

1. **CAL-2366:** Proper Sentry configuration (post-gate)
   - Create sentry.client.config.mjs with modern Astro integration
   - Re-enable Sentry integration without deprecated options
   - Timeline: After launch verification

## Notes for UXDesigner & QA

- Build can proceed without Sentry until gate window closes
- Article pages rendering correctly with Phase 2 UX
- Mobile experience stable
- All 908 pages compile without errors
- Ready for continuous Day 2-3 monitoring through gate checkpoint

**Status: BUILD STABLE. GATE WINDOW ON TRACK.**
