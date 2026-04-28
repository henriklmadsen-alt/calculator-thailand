# CAL-774: Hourly Trust QA Smoke Test Report
**Date:** 2026-04-21 14:05 UTC+7  
**Test Status:** ❌ **FAILED — RELEASE BLOCKING**  
**Priority:** CRITICAL  

## Executive Summary

Smoke test detected a **critical routing/page-serving regression** on the deployed site. All calculator pages are returning identical home page HTML instead of their individual page content. This blocks the release of [CAL-666](/CAL/issues/CAL-666) WAVE2 Batches S+T deployment.

---

## Critical Finding

### Issue Description
All calculator URLs return the same home page HTML instead of their individual page content.

### Reproduction Steps

1. **Test URL:** `https://www.kamnuanlek.com/คำนวณ-bmi/`
2. **Check page title:** Should be "คำนวณ BMI ฟรี | Calculator Thailand"
3. **Actual result:** Returns "เครื่องคำนวณไทย 2569 — ภาษี ผ่อนบ้าน ผ่อนรถ ค่าไฟ ฟรี" (home page title)

### URLs Tested

| URL | Status | Expected Title | Actual Title | Result |
|-----|--------|---|---|---|
| https://www.kamnuanlek.com/คำนวณ-bmi/ | 200 | "คำนวณ BMI ฟรี" | Home page | ❌ FAIL |
| https://www.kamnuanlek.com/คำนวณ-apr/ | 200 | "คำนวณ APR" | Home page | ❌ FAIL |
| https://www.kamnuanlek.com/คำนวณ-bridge-loan/ | 200 | "คำนวณ Bridge Loan" | Home page | ❌ FAIL |
| https://www.kamnuanlek.com/คำนวณ-cashback/ | 200 | "คำนวณ Cashback" | Home page | ❌ FAIL |
| https://www.kamnuanlek.com/คำนวณ-dca-เฉลี่ยต้นทุน/ | 200 | "คำนวณ DCA" | Home page | ❌ FAIL |
| https://www.kamnuanlek.com/คำนวณ/คำนวณ-bmi/ | 200 | "คำนวณ BMI ฟรี" | Home page | ❌ FAIL |

---

## Impact Assessment

### Severity: **CRITICAL**
### Release Risk: **BLOCKING**

### Why This Blocks Release

#### 1. **SEO Damage** 🔴
- All calculator pages appear identical to search engines
- Duplicate page titles, descriptions, and canonical tags
- Google will penalize duplicate content
- Violates on-page SEO best practices for organic search growth
- **Impact on objective:** Undermines 50,000 THB/month AdSense revenue target through organic search

#### 2. **User Experience Broken** 🔴
- Users navigating to a specific calculator URL see the home page instead
- If JavaScript fails to load, users only see home page content
- Mobile users on slow connections may not load JavaScript
- Creates trust deficit when users see wrong content
- No calculator forms accessible server-side

#### 3. **Accessibility Regression** 🔴
- Screen readers and assistive technology see home page instead of calculator
- Server-side HTML **must** include calculator content
- Not relying on JavaScript alone for critical content
- Violates WCAG accessibility standards
- Impacts users with disabilities

#### 4. **Deployment Verification Incomplete** 🔴
- [CAL-666](/CAL/issues/CAL-666) WAVE2 Batches S+T (50 calculators) marked as deployed
- Actual calculator pages not accessible to users
- Deployment validation is incomplete
- 50 calculators built but not reachable

---

## Technical Root Cause (Hypothesis)

One of the following must be true:

1. **Astro build issue:** Individual calculator pages not being pre-rendered as static HTML files
   - `output: 'static'` configured but pages missing from build output
   
2. **Deployment routing issue:** All URLs routing to index.html (SPA mode)
   - Railway configuration treating site as single-page application
   - Static file serving not configured correctly
   
3. **Missing page routes:** Astro route configuration incomplete
   - Dynamic routes not generating static pages
   - Page directory structure mismatch

---

## Test Results Summary

| Metric | Result | Status |
|--------|--------|--------|
| HTTP Status | All 200 OK | ✓ Pass |
| Page Uniqueness | All identical | ❌ **FAIL** |
| Calculator Form Elements | Not present in HTML | ❌ **FAIL** |
| Unique Meta Descriptions | Not unique | ❌ **FAIL** |
| Unique Schema Markup | Not unique | ❌ **FAIL** |
| Mobile Viewport Testing | Not tested (content blocker) | ⏸ Blocked |
| JavaScript-Disabled Testing | Not tested (content blocker) | ⏸ Blocked |

---

## Required Actions Before Release

**All of the following must be completed and verified:**

- [ ] **Verify Astro build output**
  - Check `/dist` or build output directory for individual calculator HTML files
  - Confirm each page has unique HTML (not SPA single file)

- [ ] **Test deployed URLs**
  - Each calculator URL must return unique HTML content
  - Unique `<title>` tag per page
  - Unique `<meta name="description">` per page
  - Unique schema.org markup per calculator

- [ ] **Test with JavaScript disabled**
  - Calculators must be accessible without JavaScript
  - Content must be server-side rendered, not client-side only

- [ ] **Test mobile user-agent**
  - Mobile browsers must see correct calculator page
  - Responsive layout must not break

- [ ] **SEO validation**
  - Run Google Lighthouse audit on sample pages
  - Verify unique canonical URLs
  - Check for redirect chains

- [ ] **Escalate to CTO**
  - Technical investigation into Astro build configuration
  - Deployment routing configuration review
  - Fix and re-deploy
  - Re-run smoke test to verify resolution

---

## Recommendation

### **BLOCK [CAL-666](/CAL/issues/CAL-666) and all subsequent calculator releases** 

Until this is resolved, the deployed site:
- ❌ Does not meet SEO requirements
- ❌ Does not meet user experience standards  
- ❌ Does not meet accessibility standards
- ❌ Cannot be released to production

**This must be escalated to the CTO for immediate investigation and resolution.**

---

## Next Steps

1. **Escalate:** Report to CTO with this QA report
2. **Investigate:** CTO to determine root cause (build vs. deployment)
3. **Fix:** Correct Astro build or deployment routing
4. **Re-test:** Run smoke test again to verify resolution
5. **Deploy:** Only after QA re-verification

---

## QA Sign-Off

**QA Status:** ❌ **NOT APPROVED FOR RELEASE**

**QA Engineer:** Release QA Engineer Alpha  
**Date:** 2026-04-21  
**Time:** 14:05 UTC+7  

This smoke test identified release-blocking issues. Release cannot proceed without CTO resolution and QA re-verification.
