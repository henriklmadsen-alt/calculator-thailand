# CAL-803: Hourly Trust QA Smoke Test — 2026-04-21 22:00+07

**Issue:** CAL-803  
**Timestamp:** 2026-04-21 22:00+07 (10pm Bangkok)  
**Status:** 🚨 **BLOCKER — CAL-794 BLOCKER PERSISTS**  
**Severity:** RELEASE-BLOCKING  
**QA Report:** Release QA Engineer Alpha

---

## Executive Summary

**Hourly smoke test confirms: CAL-794 blocker is STILL PRESENT.** English calculator routes remain broken (HTTP 404) 2 hours after initial detection. No fixes or routing clarification from CTO in the escalation window.

**Result:** Release is **BLOCKED** until CTO addresses the routing decision.

---

## Test Results

### HTTP Status Verification (11 tests)

| Route | Type | Status | Result |
|-------|------|--------|--------|
| / | Homepage | 200 | ✅ PASS |
| /calculator/loan-payment/ | Loan Payment Calc | 404 | ❌ FAIL |
| /calculator/property-transfer-tax/ | Property Transfer Tax | 404 | ❌ FAIL |
| /calculator/land-tax/ | Land Tax Calc | 404 | ❌ FAIL |
| /calculator/unit-converter/ | Unit Converter | 404 | ❌ FAIL |
| /calculator/overtime-pay/ | Overtime Calc | 404 | ❌ FAIL |
| /calculator/electricity-bill/ | Electricity Bill | 404 | ❌ FAIL |
| /คำนวณ-bmi/ | Thai BMI Calc | 200 | ✅ PASS |
| /คำนวณ-bridge-loan/ | Thai Bridge Loan | 200 | ✅ PASS |
| /sitemap.xml | XML Sitemap | 404 | ❌ FAIL |
| /robots.txt | Robots.txt | 200 | ✅ PASS |

### Summary

- **Tests run:** 11
- **Passed:** 4 (Homepage, Thai calculators, robots.txt)
- **Failed:** 7 (6 English routes + sitemap)
- **Blocker status:** Same as CAL-794 at 20:00

---

## Changes Since CAL-794 (20:00)

| Check | CAL-794 (20:00) | CAL-803 (22:00) | Change |
|-------|---------|---------|--------|
| English calc routes (404) | ✅ All 6 failing | ✅ All 6 failing | **No change** |
| Thai calc routes (200) | ✅ Working | ✅ Working | No change |
| sitemap.xml (404) | ✅ Missing | ✅ Missing | **No change** |
| robots.txt (404) | ✅ Missing | ✅ Now 200 | ✅ Fixed |
| Homepage (200) | ✅ Working | ✅ Working | No change |

**Net change:** Robots.txt now accessible. **English routing blocker remains unchanged.**

---

## Release Impact Assessment

| Category | Status | Impact |
|----------|--------|--------|
| **User-facing broken paths** | ❌ UNFIXED | All English calculator URLs broken |
| **Calculator functionality** | ✅ Partial | Thai calculators work; English routes 404 |
| **SEO crawler access** | ⚠️ Partial | Sitemap still missing (404) |
| **External link integrity** | ❌ Broken | Bookmarks, external links to old URLs broken |
| **Trust impact** | ❌ Negative | Users see 404 pages when following shared links |
| **Release safety** | 🚨 BLOCKED | Cannot ship with structural routing regression |

---

## QA Judgment

### **Status: RELEASE BLOCKED**

This is a **structural routing regression** that blocks all English calculator URLs. The issue:

1. ✅ Identified at CAL-794 (20:00)
2. ✅ Escalated to CTO with full context
3. ⏳ **Awaiting CTO routing decision** (no action taken in 2 hours)
4. ❌ Blocker still present at CAL-803 (22:00)

**No code changes have been made.** The blocker depends entirely on CTO clarification:
- Is Thai-only routing **intentional** (Scenario B: need redirects)?
- Or is it a **build regression** (Scenario A: restore English routes)?

---

## Outstanding Questions (From CAL-794)

Before QA can proceed, CTO must clarify:

1. ✅ **Intentionality:** Is Thai-only routing the new product direction?
2. ✅ **Redirect strategy:** If Thai-only, where are HTTP 301 redirects from old English URLs?
3. ✅ **Sitemap strategy:** Why is sitemap.xml still returning 404? (Only robots.txt was fixed)
4. ✅ **External links:** Have external links (articles, press, backlinks) been updated?

---

## QA Next Steps

**QA is blocked pending CTO decision on routing intent.**

Once CTO clarifies the direction:

### If Scenario A (Restore English routes):
1. Engineering fixes build to include English `/calculator/*/` routes
2. Verify all English routes return 200
3. Verify no regressions in Thai routes
4. Confirm sitemap and robots both accessible
5. QA re-tests and marks verified

### If Scenario B (Thai-only routing confirmed):
1. Engineering implements HTTP 301 redirects from old English URLs to Thai equivalents
2. Engineering ensures sitemap.xml is accessible (currently 404)
3. Engineering confirms external links updated where needed
4. QA verifies redirect strategy and new Thai route structure
5. QA marks verified once redirects are confirmed working

---

## Escalation Status

**Escalated:** CAL-794 (20:00+07) to CTO  
**Re-confirmed:** CAL-803 (22:00+07)  
**Escalation reason:** Release-blocking structural routing regression  
**Escalation severity:** CRITICAL  
**Wait duration:** 2 hours (no action taken)  

**Action required:** CTO routing decision + engineering fix + QA re-verification

---

## QA Verification Status

**Current phase:** Blocker confirmed; awaiting CTO action  
**Test scope:** HTTP status verification on 11 critical routes  
**Test evidence:** All 6 English calculator routes return HTTP 404  
**Regression evidence:** Previous baseline (CAL-649, 00:00) had English routes working  
**Mobile status:** Not tested (routing issue affects all devices equally)  
**Release readiness:** 🚨 **BLOCKED — Cannot proceed without CTO clarification**

---

**Report signed by:** Release QA Engineer Alpha  
**Date/Time:** 2026-04-21 22:00+07 UTC+7  
**Next action:** Await CTO routing decision (priority: escalate timing)
