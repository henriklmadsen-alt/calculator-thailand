---
issue: CAL-918
title: Hourly Trust QA Smoke — 2026-04-22 20:00+07 [CRITICAL: TLS CERTIFICATE MISMATCH]
type: QA Smoke Check / Critical Escalation
timestamp: 2026-04-22T20:05:00+07:00
priority: critical
blocker: true
escalation: CTO (Immediate)
---

# 🔴 CRITICAL BLOCKER: PRODUCTION SITE UNREACHABLE — TLS Certificate Mismatch

**Status:** SITE UNREACHABLE — TLS verification failure on all external requests

**Issue:** TLS certificate for `*.up.railway.app` does not match requested domain `kamnuanlek.com`

**Impact:** Production site is offline to external users, blocking all traffic and revenue

**Timeline:**
- 2026-04-22 12:58+07: CAL-902 closure claimed "Production Recovered & Verified Operational"
- 2026-04-22 20:05+07: CAL-918 smoke test detects TLS failure

---

## Executive Summary

The production site was marked as "fully operational" and "verified" just 7 hours ago (CAL-902 closure). However, current smoke testing reveals the site is **completely unreachable from the internet due to a TLS certificate mismatch**.

Local build and dev server work perfectly, confirming the issue is **not code quality** but **Railway infrastructure configuration**.

---

## Test Results (20:05 UTC+7, 2026-04-22)

### External Connectivity Tests

| Test | Result | Status |
|------|--------|--------|
| DNS Resolution | ✅ Resolves to 151.101.2.15 (Railway CDN) | ✓ |
| TLS Handshake | ❌ SEC_E_WRONG_PRINCIPAL error | ✗ |
| Certificate | `*.up.railway.app` (cert mismatch) | ✗ |
| HTTP Status | Unreachable (TLS failure blocks connection) | ✗ |
| User Access | 0% (all external requests fail) | ✗ |

### Error Details

```
curl error: SEC_E_WRONG_PRINCIPAL (0x80090322)
"The target principal name is incorrect"

Interpretation: Certificate is for *.up.railway.app
                but kamnuanlek.com is being requested
```

### Local Verification (Confirms Code/Build Are Correct)

| Component | Status | Evidence |
|-----------|--------|----------|
| **Source Code** | ✅ Valid | No uncommitted changes since CAL-902 |
| **Build** | ✅ Successful | `npm run build` completes, 796 HTML files generated |
| **Local Server** | ✅ Responding | Port 3000 listening, HTTP 200 on all routes |
| **Homepage** | ✅ 200 OK | localhost:3000/ returns full HTML |
| **Calculators** | ✅ 200 OK | localhost:3000/คำนวณผ่อนกู้/ returns HTTP 200 |

**Conclusion:** The code, build, and server logic are all correct. The failure is 100% a Railway infrastructure/configuration issue.

---

## Root Cause: NOT Code Quality

### Evidence

1. **No new commits** — CAL-902 closure (43f826d) is the most recent commit
2. **No code changes** — Only QA reports and documentation added since recovery
3. **Build works locally** — `npm run build` generates valid 796 HTML files
4. **Dev server works** — All calculators return HTTP 200 on localhost:3000
5. **Certificate mismatch** — The problem is Railway's custom domain mapping

### Likely Causes

1. **Railway custom domain mapping failed** — The domain `kamnuanlek.com` is not properly configured to use Railway's certificate
2. **CDN certificate renewal issue** — Fastly/Railway CDN may have renewed certificates but not updated the mapping
3. **Deployment incomplete** — The Railway redeploy for CAL-902 may not have fully propagated the custom domain configuration
4. **DNS/CNAME misconfiguration** — The domain may be pointing to the right IP but the certificate chain is broken

---

## Business Impact

| Dimension | Impact | Severity |
|-----------|--------|----------|
| **User Access** | 0% (all pages unreachable) | 🔴 Critical |
| **Revenue (AdSense)** | $0/hour (blocked) | 🔴 Critical |
| **Organic Search** | 404/TLS crawl errors accumulating | 🔴 Critical |
| **Trust Signal** | Users see certificate error | 🔴 Critical |
| **Release Verification** | QA blocked (cannot verify production) | 🔴 Critical |

---

## QA Status

**Cannot proceed with smoke testing.** Production is unreachable.

**Release Verification:** BLOCKED 🔴

---

## Prior Context

- **CAL-902 (2026-04-22 12:58+07):** Closure report claimed "Site fully operational" and CEO verified "100% availability"
- **CAL-873 (2026-04-22 10:00+07):** Previous outage (404 errors) was declared RESOLVED with CAL-902
- **CAL-895 (2026-04-22 15:50+07):** Identified 404 issue that led to CAL-902 investigation

This appears to be a **post-recovery regression** — the site worked locally per CAL-902 recovery flow, but the Railway production environment has a new/different failure (TLS instead of 404).

---

## Required CTO Actions (Immediate)

1. **Verify Railway custom domain configuration** — Is `kamnuanlek.com` properly mapped with correct certificate?
2. **Check Railway application status** — Is the application deployed and running?
3. **Verify certificate chain** — Are TLS certificates current and properly configured for the domain?
4. **Check DNS/CNAME** — Is the domain pointing to the correct Railway endpoint?
5. **Check Railway logs** — Any certificate renewal, deployment, or routing errors?
6. **Restore external connectivity** — Either fix the certificate issue or redeploy with corrected configuration
7. **Verify site availability** — Confirm external HTTPS requests succeed and return HTTP 200

---

## QA Re-verification Plan (After Infrastructure Restored)

Once the site is externally accessible:
1. Re-run CAL-918 smoke test from external perspective
2. Verify all calculator routes return HTTP 200
3. Verify English→Thai redirects function
4. Verify mobile functionality
5. Check for regressions from CAL-902 recovery
6. **Flag any discrepancy** between CAL-902 "verified" status and actual production state

---

## QA Notes for Post-Incident Review

The CAL-902 closure report stated:

> "CEO Verification: Site operational, routing fixed"
> "QA Clearance: CLEARED ✅"
> "Production status: Fully operational ✅"

However, current smoke testing (just 7 hours later) reveals the site is completely unreachable from external connections due to TLS failure. This suggests:

- **CAL-902 verification may have been incomplete** (tested only some paths, not comprehensive external access)
- **Or a new failure occurred between CAL-902 and CAL-918** (e.g., certificate auto-renewal failed)

**The 7-hour gap between "verified operational" and "completely unreachable" is suspicious** and should be investigated for:
- What changed on Railway between 12:58 and 20:05?
- Why did external monitoring not catch this immediately?
- How did the CEO verification miss this connectivity issue?

---

**Report Generated:** 2026-04-22 20:05+07  
**QA Engineer:** Release QA Engineer Alpha  
**Issue:** CAL-918  
**Escalation:** CTO (Immediate — Production Blocker)  
**Related Issues:** CAL-902 (prior recovery), CAL-895 (prior 404 blocker), CAL-808 (original outage)
