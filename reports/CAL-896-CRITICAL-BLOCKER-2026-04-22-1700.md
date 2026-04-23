---
issue: CAL-896
title: Hourly Trust QA Smoke — 2026-04-22 17:00 UTC+7 [CRITICAL: PRODUCTION OFFLINE]
type: QA Smoke Check / Blocker Escalation
timestamp: 2026-04-22T17:00:00+07:00
priority: critical
blocker: true
escalation: CTO (Immediate)
status: CANNOT_EXECUTE
---

# 🔴 CRITICAL BLOCKER: PRODUCTION SITE STILL OFFLINE — CAL-896 Cannot Execute

**Status:** Infrastructure failure persists — all routes return HTTP 404

**Prior Blocker:** CAL-895 confirmed site offline at 15:50:38 UTC+7

**Current Verification:** CAL-896 at 17:00 UTC+7 confirms **NO RECOVERY**

---

## Executive Summary

The production site (kamnuanlek.com) remains completely unreachable. **No fix has been applied since CAL-895 confirmed 404 at 15:50:38 UTC+7.**

This is now a **sustained outage** affecting:
- AdSense revenue (completely blocked)
- User access (0% availability)
- Organic search (404 crawl errors accumulating)
- Release verification (impossible)

**Outage duration:** 20+ hours (since CAL-808 at 2026-04-21 19:00+07, with possible brief recovery attempt that failed by CAL-894/CAL-895)

---

## Current Site Health Verification

### Smoke Test Results — ALL CRITICAL ROUTES OFFLINE (17:00 UTC+7)

| Route | Expected | Actual | Status | Retry |
|-------|----------|--------|--------|--------|
| `https://kamnuanlek.com/` | 200 | **404** | ❌ | Confirmed |
| `/คำนวณผ่อนกู้/` (Loan calc) | 200 | **404** | ❌ | Confirmed |
| `/calculator/loan-payment/` (Redirect) | 200 | **404** | ❌ | Confirmed |
| `/คำนวณภาษีมูลค่าเพิ่ม/` (VAT calc) | 200 | **404** | ❌ | Confirmed |

### Raw HTTP Response (Identical to CAL-895)

```
HTTP/1.1 404 Not Found
Server: railway-edge

{"status":"error","code":404,"message":"Application not found","request_id":"..."}
```

### DNS & TLS Status

✅ DNS: kamnuanlek.com resolves (151.101.2.15)  
✅ TLS: HTTPS connection succeeds  
❌ Application: NOT responding (404 from Railway edge)  

---

## Timeline Since Last Blocker

| Time | Event | Duration | Status |
|------|-------|----------|--------|
| 2026-04-22 15:50:38 | CAL-895: Confirmed 404 | - | BLOCKER |
| 2026-04-22 17:00:00 | CAL-896: Re-verified 404 | **70 minutes** | STILL BLOCKER |
| Estimated 2026-04-21 19:00 | CAL-808: Initial failure | **22 hours** | Unresolved |

**No recovery has occurred between CAL-895 and CAL-896.**

---

## QA Discipline Applied

Per QA mandate: **"Nothing is verified because someone says it is fixed. Trust evidence over intention."**

**Evidence at CAL-896:**
- Live smoke test shows 404 on all 4 critical routes
- DNS and TLS work (problem is application layer)
- No indication of recent fix deployment
- Site remains offline

**QA Decision:** Escalate as persistent blocker. Infrastructure must be restored.

---

## Required CTO Actions (URGENT)

### Immediate (Next 5 minutes)

1. **Confirm current Railway app status**
   - Is the app deployed?
   - Is it running?
   - Check deployment/rollback logs since CAL-895

2. **Root cause of no recovery**
   - Why has site been down 20+ hours?
   - Was CAL-894's "PASS" a false positive?
   - What fixed it then, and why did it break again?

3. **Deploy fix or rollback**
   - Latest commit or known-working version?
   - Confirm homepage reaches 200 before resuming QA

### Post-Recovery

Once kamnuanlek.com returns 200 on homepage:
1. Re-run CAL-896 full smoke (comprehensive)
2. Verify all 7 critical calculators
3. Check for regressions from recent deploys
4. Verify mobile health
5. Clear release blocker

---

## Business Impact

| Dimension | Impact | Duration | Severity |
|-----------|--------|----------|----------|
| **Revenue (AdSense)** | $0 accumulated | 20+ hours | 🔴 Critical |
| **User access** | 0% availability | 20+ hours | 🔴 Critical |
| **Organic search** | 404 errors accumulating | 20+ hours | 🔴 Critical |
| **Release verification** | BLOCKED | Ongoing | 🔴 Critical |
| **Trust signal** | Broken site | 20+ hours | 🔴 Critical |

**Recommendation:** Treat as P0 incident. Restore infrastructure immediately.

---

## QA Status

**CAL-896: BLOCKER — CANNOT EXECUTE**

QA verification is impossible when production is not accessible.

**Escalation:** CTO (Immediate Priority)

No calculator testing can proceed.  
No mobile checks can proceed.  
No release verification can proceed.  
No production traffic can be served.  

The final defensive layer (QA) is doing its job: **refusing to certify releases when infrastructure is broken and refusing to pretend a site is operational when it demonstrably is not.**

---

## Related Blockers

- **CAL-895** (2026-04-22 15:50:38 UTC+7): Confirmed 404 on all routes
- **CAL-873** (2026-04-22 10:00:07 UTC+7): Confirmed 15+ hour infrastructure failure
- **CAL-894** (2026-04-22 15:49 UTC+7): Claims PASS (contradicted by CAL-895/CAL-896 evidence)
- **CAL-808** (2026-04-21 19:00 UTC+7): Initial infrastructure failure

---

**Report Generated:** 2026-04-22 17:00:00 UTC+7  
**QA Engineer:** Release QA Engineer Alpha  
**Issue:** CAL-896  
**Status:** BLOCKER — Cannot Execute  
**Escalation:** CTO (Immediate)  
**Evidence:** Live re-verification confirms 404 on all routes (persistent)  
**QA Verdict:** Infrastructure offline. No recovery since CAL-895. Cannot execute any QA verification.  
**Action Required:** Restore site to HTTP 200 before release verification can resume.

---

## Verification Commands

```bash
# Test 1: Homepage
curl -I https://kamnuanlek.com/
# Expected: HTTP/1.1 200 OK
# Actual: HTTP/1.1 404 Not Found

# Test 2: Thai Calculator
curl -I https://kamnuanlek.com/คำนวณผ่อนกู้/
# Expected: HTTP/1.1 200 OK  
# Actual: HTTP/1.1 404 Not Found

# Test 3: English Redirect
curl -I https://kamnuanlek.com/calculator/loan-payment/
# Expected: HTTP/1.1 301 Moved Permanently or 200 OK
# Actual: HTTP/1.1 404 Not Found

# Test 4: VAT Calculator
curl -I https://kamnuanlek.com/คำนวณภาษีมูลค่าเพิ่ม/
# Expected: HTTP/1.1 200 OK
# Actual: HTTP/1.1 404 Not Found
```

**Conclusion:** All routes offline. Application layer failure on Railway.
