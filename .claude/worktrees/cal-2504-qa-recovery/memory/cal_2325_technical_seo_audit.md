---
name: CAL-2325 Technical SEO Audit Results
description: Critical blocker identified — sitemap generation disabled, XML sitemaps missing from build output
type: project
---

## CAL-2325: Technical SEO Audit — CRITICAL BLOCKER IDENTIFIED

**Status:** Audit Complete 2026-04-27 10:00 UTC  
**Critical Issue:** Sitemap generation is disabled (version incompatibility)  
**Impact:** Launch blocker — search engines cannot discover all 908 pages  
**Deadline:** Fix by 2026-04-28 EOD  

## Critical Findings

### Blocker: Sitemap Generation DISABLED
- **Root Cause:** Astro sitemap plugin (@astrojs/sitemap 3.7.2) disabled in astro.config.mjs (lines 45-48) due to reported version incompatibility with Astro 4.16.19
- **Error Reported:** "Cannot read properties of undefined (reading 'reduce')" in sitemap:build:done hook
- **Current Status:** No XML sitemaps generated in dist/ after clean build
- **Impact:** 
  - robots.txt references `/sitemap-index.xml` which doesn't exist
  - Search engines cannot discover full 908-page site
  - IndexNow API submissions will fail
  - SEO discovery severely impaired

### Files Generated vs. Required
| File | Required | Exists | Status |
|------|----------|--------|--------|
| sitemap-index.xml | YES | ❌ NO | **MISSING** |
| sitemap-0.xml (calculators) | YES | ❌ NO | **MISSING** |
| sitemap-1.xml (articles) | YES | ❌ NO | **MISSING** |
| indexnow.sitemaps.xml | OPTIONAL | ✅ YES | Present but incomplete |
| sitemap-llm.txt | OPTIONAL | ✅ YES | Present |

## Robots.txt Status

**Grade: A** — Well-configured, no issues
- Allow: / with proper API disallows ✅
- AI crawler permissions ✅
- Security/payment API restrictions ✅
- BUT: Sitemap path points to non-existent file ⚠️

## Core Web Vitals

**Status:** Cannot assess without live testing
- Site is static HTML (should have excellent performance)
- Requires live environment verification
- Lighthouse testing blocked pending live site access

## Corrective Actions (Priority Order)

### Tier 0 — LAUNCH BLOCKER (2026-04-28 EOD)
1. **Re-enable sitemap plugin** or **implement post-build script**
   - Test if @astrojs/sitemap 3.7.2 still incompatible (try re-enabling first)
   - If incompatible, create post-build sitemap generation script
   - Verify sitemap-index.xml + nested sitemaps exist after build
   - Effort: 1-2 hours

2. **Verify robots.txt → sitemap path works**
   - Test 200 response for /sitemap-index.xml on live site
   - Effort: 15 min

3. **Test IndexNow submission**
   - Effort: 15 min

### Tier 1 — LAUNCH QUALITY (2026-04-29 EOD)
1. Core Web Vitals verification on live site
2. Mobile responsiveness with articles
3. Internal linking audit

### Tier 2 — POST-LAUNCH (Week 2)
1. Automated sitemap validation in CI
2. Live metrics monitoring

## Why This Matters

Without proper XML sitemap generation:
- Google cannot efficiently crawl all 908 pages
- Missed indexing opportunities
- Slower discovery of new articles added post-launch
- IndexNow rapid indexing cannot work
- Search rankings will be negatively impacted
- Blocks Phase 1 SEO execution plan

## Next Steps

1. ✅ Audit complete — report filed
2. → CTO: Fix sitemap generation
3. → SEO Specialist: Test fix and IndexNow submission
4. → All: Proceed to gate verification once sitemap confirmed
