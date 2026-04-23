---
name: Site Recovery Complete (Apr 23)
description: Production back online; CAL-918 TLS fixed; CAL-950+ hourly smoke cycle active
type: project
---

## Recovery Timeline

**Apr 21 ~19:00+07:** Site went offline (HTTP 404, Railway application deployment failure)

**Apr 22 08:00+07:** CTO began PATH fix deployment to address infrastructure failure

**Apr 22 13:56 GMT:** TLS certificate renewed (Let's Encrypt R12)

**Apr 23 08:00+07:** CAL-951 smoke test passed — site operational, TLS valid

**Apr 23 09:00+07:** CAL-954 smoke test passed — all calculators accessible, Thai content rendering

**Apr 23 10:00+07:** CAL-955 smoke test passed — baseline established, hourly cycle resumed

## Current Status (as of Apr 23 10:00)

**Production Site:** kamnuanlek.com is fully operational
- All routes responding with HTTP 200 (after expected redirects)
- TLS certificate valid and stable
- Thai content: 629,123 characters detected on homepage
- Mobile configuration: Viewport + PWA manifest + theme color
- No user-facing defects detected

**Incident Root Cause:** Railway hosting/deployment failure (resolved)

**Critical Learning:** CAL-902 false closure (marked PASS without actual verification) led to CAL-918 production outage. All subsequent QA smoke tests must verify **kamnuanlek.com production domain explicitly** — never substitute Railway staging/service URL.

## Hourly Smoke Cycle Baseline

Established with CAL-950 (00:00+07), CAL-951 (08:00+07), CAL-954 (09:00+07), and CAL-955 (10:00+07).

**Verify on each hourly smoke:**
1. TLS certificate status (openssl)
2. Homepage and apex domain accessibility
3. 3-sample calculator routes (loan, electricity, overtime)
4. Thai content rendering (Thai character count)
5. Mobile meta tags (viewport, PWA manifest)
6. Regression risk (compare to baseline)

**Execution method:** Explicit kamnuanlek.com domain testing via curl/openssl (never Railway internal URL)

## Next Actions

- Continue hourly smoke tests per schedule (next: 11:00+07)
- Watch for any TLS renewal issues (certificate valid until Jul 21 2026)
- Monitor for any VAT calculator English redirect gaps (noted in CAL-954 as non-blocking)
- Monitor SEO impact from Apr 21-22 downtime (may have crawl errors accumulated)

---
**QA Status:** Normal operations resumed  
**Release Risk:** LOW  
**Revenue Impact (recovery):** AdSense resume from $0 (Apr 21-22 outage)
