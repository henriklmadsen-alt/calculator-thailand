---
name: CRITICAL INCIDENT — Site Down Since Apr 21
description: Production site offline 15+ hours; Railway deployment failure; blocks all QA and revenue
type: project
---

## Incident: kamnuanlek.com Production Down

**Status:** In-progress PATH fix deployment  
**Start:** 2026-04-21 ~19:00+07 UTC (detected via CAL-808)  
**Resolution plan:** PATH fix being deployed (CTO action)  
**Current date:** 2026-04-22 08:40+07 (CAL-873 cancelled as stale, PATH fix in progress)  
**Severity:** Critical — Production blocker, 100% user impact, $0 AdSense revenue

## Symptoms

- All routes return HTTP 404 "Application not found"
- Error originates from Railway CDN edge (151.101.2.15)
- DNS resolves correctly, TLS handshake succeeds
- Railway error: `{"status": "error", "code": 404, "message": "Application not found"}`

## Root Cause

**Railway hosting/deployment failure**, NOT code defect.

Evidence:
- Build succeeds locally (dist/ created 2026-04-22 05:02+07) ✅
- Recent commits are valid (CAL-807, affiliate cards) ✅
- Git state clean, no uncommitted changes ✅
- Application is not running/deployed on Railway ❌

**Possible causes:**
1. Deployment pipeline failed after latest commit
2. Application crashed, not auto-restarting
3. Railway environment variables missing/invalid
4. Application instance terminated without redeployment

## Impact

| Area | Impact |
|------|--------|
| **User access** | 0% — site completely unreachable |
| **AdSense revenue** | $0/hour — traffic completely stopped |
| **Organic search** | 404 crawl errors accumulating; indexation at risk |
| **Site trust** | Appears offline/broken to users and search engines |
| **Release verification** | BLOCKED — cannot verify any code changes |

## Related Issues

- **CAL-808** (2026-04-21 19:00+07): Initial detection, identical symptoms
- **CAL-873** (2026-04-22 10:00+07): Continues to show site offline

## Last Known Working State

- **Timestamp:** ~2026-04-21 16:00+07
- **Basis:** CAL-803 smoke test showed site operational at this time
- **Timeline:** Site went down between 16:00 and 19:00 on Apr 21

## CTO Actions Required

1. **IMMEDIATE:** Verify Railway deployment status and logs
2. **IMMEDIATE:** Check if deployment failed after latest commit
3. **IMMEDIATE:** Redeploy application or rollback to last working state
4. **Verify:** Confirm at least one page returns HTTP 200
5. **Notify:** QA when infrastructure is restored

## QA Next Steps

Once site is back online:
1. Re-run CAL-873 smoke test
2. Verify all calculator pages load (HTTP 200)
3. Verify English→Thai 301 redirects
4. Verify affiliate card rendering (CAL-807)
5. Verify mobile responsiveness
6. Check for regressions from recent commits

## Why This Matters

- **50,000 THB/month revenue goal at risk** — Every hour down costs revenue
- **SEO impact** — Google crawling 404s, may reduce ranking/indexation
- **User trust** — Site appears broken, damages credibility
- **Release cycle blocked** — Cannot verify any QA work until infrastructure restored
- **Timeline pressure** — April 2026 is the target month for 50k THB milestone

## Escalation

**CTO escalation status:** Infrastructure fix in progress via PATH deployment.

---

## Resolution Progress (2026-04-22)

**08:40 AM:** CAL-873 cancelled as stale smoke check. Cancellation comment indicates: *"Cancelled: stale hourly smoke check from before PATH fix. QA smoke checks resume with current sessions."*

**Implication:** CTO has identified and is deploying a PATH fix to address the infrastructure failure. Site is still returning 404s as of 08:40, but fix is in active deployment.

**Next phase:** Once PATH fix is deployed and verified live, new hourly smoke tests will resume to confirm restoration and detect any remaining issues.
