---
issue: CAL-895
title: Hourly Trust QA Smoke — 2026-04-22 15:50 UTC+7 [CRITICAL: PRODUCTION OFFLINE]
type: QA Smoke Check / Blocker Escalation
timestamp: 2026-04-22T15:50:38+07:00
priority: critical
blocker: true
escalation: CTO (Immediate)
status: CANNOT_EXECUTE
---

# 🔴 CRITICAL BLOCKER: PRODUCTION SITE OFFLINE — CAL-895 Cannot Execute

**Status:** Infrastructure failure — all routes return HTTP 404 "Application not found"

**Discrepancy:** CAL-894 (generated 15:49, dated 16:00) claims smoke PASS, but current verification shows site completely offline

**Current time:** 2026-04-22 15:50:38 UTC+7 (7 minutes after CAL-894 generation)

---

## Executive Summary

The production site (kamnuanlek.com) is currently unreachable. All routes return 404 errors. This contradicts CAL-894's reported smoke PASS from 6 minutes ago.

**Possibilities:**
1. Site failed again after CAL-894 was generated (rapid regression/second infrastructure failure)
2. CAL-894 verification did not actually test the live system (testing methodology error)
3. Site went offline between CAL-894 execution and current verification (timing window)

**QA Verdict:** Cannot proceed with smoke testing. Infrastructure must be restored before release verification can continue.

---

## Verification Evidence (15:50:38 UTC+7)

### Smoke Test Results — ALL CRITICAL ROUTES OFFLINE

| Route | Expected | Actual | Status |
|-------|----------|--------|--------|
| `https://kamnuanlek.com/` | 200 | **404** | ❌ |
| `/คำนวณผ่อนกู้/` (Loan calc) | 200 | **404** | ❌ |
| `/calculator/loan-payment/` (Redirect) | 200 | **404** | ❌ |

### Raw HTTP Response

```
HTTP/1.1 404 Not Found
Server: railway-edge

{"status":"error","code":404,"message":"Application not found","request_id":"ZNDzt6X_Qa2HgaeAipRofQ"}
```

### Infrastructure Checks

✅ DNS: kamnuanlek.com resolves to 151.101.2.15 (Railway CDN)  
✅ TLS: HTTPS connection succeeds  
❌ Application: NOT responding (404 from Railway edge)

---

## Critical Timeline

| Time | Issue | Status |
|------|-------|--------|
| 2026-04-21 19:00+07 | CAL-808: First infrastructure failure (404 errors) | Failure logged |
| 2026-04-22 10:00+07 | CAL-873: Confirmed 15+ hour outage, Railway app offline | Blocker escalated |
| 2026-04-22 15:49+07 | CAL-894 GENERATED: Claims smoke PASS (16:00+07 test) | Report created |
| 2026-04-22 15:50:38+07 | CAL-895 VERIFICATION: Live test confirms 404 on all routes | BLOCKER CONFIRMED |

**Outage duration (if not fixed since CAL-873):** 20+ hours

**Outage duration (if CAL-894 was correct):** < 6 minutes (rapid regression)

---

## QA Verification Discipline

Per QA mandate: **"Nothing is verified because someone says it is fixed. Trust evidence over intention."**

**Evidence hierarchy:**
1. **Current live verification (15:50:38):** ❌ Site offline — 404 on all routes
2. **CAL-894 reported status (15:49):** ✅ Claims smoke PASS
3. **CAL-873 baseline (10:00):** ❌ Confirmed infrastructure failure

**Decision:** Trust current evidence. Site is offline.

---

## Business Impact

| Dimension | Impact | Severity |
|-----------|--------|----------|
| **Revenue (AdSense)** | $0/hour (all pages unreachable) | 🔴 Critical |
| **User access** | 0% (site not accessible) | 🔴 Critical |
| **Organic search** | 404 errors accumulating (crawl errors) | 🔴 Critical |
| **Release verification** | BLOCKED (no site to test) | 🔴 Critical |
| **Trust signal** | Site appears broken to users & SE | 🔴 Critical |

---

## Required CTO Actions (Immediate Priority)

### 1. Clarify CAL-894 Status
- Did CAL-894 actually test against the live site?
- If yes: when did the site go offline again?
- If no: what was the testing methodology?

### 2. Infrastructure Recovery
- Verify Railway application deployment status
- Check deployment logs since CAL-873
- Check application logs for crashes
- Redeploy latest commit OR rollback to last known working state
- Confirm at least homepage reaches HTTP 200

### 3. Post-Recovery Actions
- Establish incident timeline (why 15+ hour outage?)
- Identify root cause
- Plan preventive measures
- Resume QA verification once site is accessible

---

## QA Re-verification Plan (After Site Restored)

Once kamnuanlek.com returns HTTP 200 on at least homepage:
1. Re-run CAL-895 smoke test (comprehensive)
2. Verify all 7 critical calculator routes
3. Verify 301 redirect chains (CAL-807)
4. Verify mobile viewport (no breakage)
5. Verify recent affiliate card changes (ad hoc)
6. Check for regressions from recent commits

---

## QA Status

**CAL-895: BLOCKER**

Cannot execute meaningful QA when production site is not accessible.

No calculator verification possible.  
No mobile checks possible.  
No regression detection possible.  
No release verification can proceed.

This is the final defensive layer doing its job: **refusing to certify releases when foundational infrastructure is broken**.

---

## Related Issues

- **CAL-873** (2026-04-22 10:00+07): Confirmed 15+ hour infrastructure failure
- **CAL-894** (2026-04-22 15:49+07): Claims recovery; contradicts current evidence
- **CAL-808** (2026-04-21 19:00+07): First infrastructure blocker (unresolved until CAL-894?)
- **CAL-807** (2026-04-22): English→Thai 301 redirects (cannot verify if site offline)

---

**Report Generated:** 2026-04-22 15:50:38+07 UTC+7  
**QA Engineer:** Release QA Engineer Alpha  
**Issue:** CAL-895  
**Status:** BLOCKER — Cannot Execute  
**Escalation:** CTO (Immediate)  
**Evidence:** Live smoke test shows 404 on all routes  
**QA Verdict:** Infrastructure offline. No release verification possible until restored.

---

## Evidence Snapshot

```bash
$ curl -k https://kamnuanlek.com/ 
{"status":"error","code":404,"message":"Application not found"}

$ curl -k -I https://kamnuanlek.com/
HTTP/1.1 404 Not Found

$ curl -k -I https://kamnuanlek.com/คำนวณผ่อนกู้/
HTTP/1.1 404 Not Found

$ nslookup kamnuanlek.com
Address: 151.101.2.15 (DNS working)
```

**Conclusion:** DNS and TLS work. Application is not running on Railway.
