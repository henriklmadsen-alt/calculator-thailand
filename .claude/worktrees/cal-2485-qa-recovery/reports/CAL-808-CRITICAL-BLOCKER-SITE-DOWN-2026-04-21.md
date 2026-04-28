# CAL-808: Hourly Trust QA Smoke Test — CRITICAL BLOCKER

**Issue:** CAL-808  
**Timestamp:** 2026-04-21 19:00+07 (7pm Bangkok)  
**Test Type:** Hourly trust smoke check  
**Status:** 🔴 **BLOCKED — Site-wide 404 (Infrastructure Failure)**  
**QA Report:** Release QA Engineer Alpha

---

## Critical Finding

**The entire kamnuanlek.com site is down.** All routes return HTTP 404 from Railway infrastructure.

---

## Test Execution

### HTTP Status Verification

| Route | Expected | Actual | Status |
|-------|----------|--------|--------|
| `/` (Homepage) | 200 | 404 | ❌ FAIL |
| `/คำนวณ-bmi` (Thai) | 200 | 404 | ❌ FAIL |
| `/คำนวณ-bridge-loan` (Thai) | 200 | 404 | ❌ FAIL |
| `/คำนวณ-unit-converter` (Thai) | 200 | 404 | ❌ FAIL |
| `/calculator/loan-payment` (English) | 404 or 200 | 404 | ⚠ EXPECTED, but... |
| `/calculator/property-transfer-tax` (English) | 404 or 200 | 404 | ⚠ EXPECTED, but... |
| `/sitemap.xml` | 200 or 404 | 404 | ❌ EXPECTED 200 |
| `/robots.txt` | 200 | 404 | ❌ FAIL |

---

## Root Cause Diagnosis

### Connectivity

✅ DNS resolves correctly:
```
kamnuanlek.com → 151.101.2.15 (Railway CDN edge, BKK region)
```

✅ TLS handshake succeeds:
```
schannel: SSL/TLS connection established
HTTP/1.1 connection established
```

### Error Response

❌ Railway returns application not found:

```json
{
  "status": "error",
  "code": 404,
  "message": "Application not found",
  "request_id": "f4XPkAPdS5SeBPaZDcO5xA"
}
```

### Headers

```
server: railway-edge
x-railway-cdn-edge: fastly/cache-bkk2310031-BKK
x-railway-edge: railway/asia-southeast1-eqsg3a
x-railway-fallback: true
```

---

## Impact

**Severity:** 🔴 **CRITICAL — SITE DOWN**

- **User-facing impact:** Zero — entire site is unreachable
- **Revenue impact:** All AdSense traffic stopped
- **SEO impact:** 404 crawl errors across all pages; indexation at risk
- **Trust impact:** Site appears offline/broken to users and search engines

---

## Known State

**Last known working deployment:** 2026-04-21 ~16:00+07 (4 hours ago, based on CAL-803 smoke test showing site was online then)

**Recent commits:**
- `2d71f61` fix(cal-757): fix property transfer redirect template interpolation
- `bff6d97` fix(cal-404): add electricity article to listing page, remove keyword stuffing
- `e5a2b80` feat(cal-279): integrate land tax calculator into homepage and analytics

---

## Root Cause

**Application is not deployed or running on Railway.** This is a **hosting infrastructure failure**, not a code quality issue.

**Possible causes:**
1. Deployment failed silently after last commit
2. Application crashed and is not restarting
3. Railway service is down or misconfigured
4. Environment variables are missing or incorrect

---

## Required Actions

**Immediate (CTO):**
1. ✋ Verify Railway deployment status and logs
2. ✋ Check if deployment pipeline failed after `2d71f61`
3. ✋ Redeploy application if necessary
4. ✋ Verify application is running and responding

**Verification (QA, after deployment):**
- Re-run CAL-808 smoke test once site is back online
- Verify all routes return correct status codes
- Verify Thai text rendering without mojibake
- Verify homepage and calculator flows work end-to-end

---

## QA Status

**Cannot proceed with smoke test.** Infrastructure blocker prevents any meaningful QA verification.

---

**Report Generated:** 2026-04-21 19:00+07 UTC+7  
**QA Engineer:** Release QA Engineer Alpha  
**Issue:** [CAL-808](/CAL/issues/CAL-808)
