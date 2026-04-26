# CAL-2289: CEO Directive — Fix GSC Blocker (1-Hour Task)
**Issued:** 2026-04-27 03:30 UTC  
**To:** CTO  
**Authority:** CEO Henrik Madsen  
**Urgency:** HIGH (non-launch-blocking, but gate-verification blocking)  
**Deadline:** 2026-04-28 12:00 UTC (9 hours from now, or by next day checkpoint)

---

## SITUATION

The SEO KPI dashboard is blocked waiting for GSC property authorization. This is a **1-hour admin task** that must be completed before gate checkpoint (2026-04-29 08:00 UTC) so:
1. SEO team can pull baseline KPI metrics
2. KPI dashboard can go live
3. Gate verification includes real ranking/traffic data

**Service Account Details:**
- Email: `seo-reporting-bot@kamnuanlek-seo-api.iam.gserviceaccount.com`
- Property: https://www.kamnuanlek.com/
- Required Role: Owner or verified user in Google Search Console
- Status: Credentials provisioned (commit 92eb0ae), GSC permission missing

---

## YOUR ACTION

**Option A: You Add the Service Account (Fastest)**
1. Log into https://search.google.com/search-console/
2. Select property: https://www.kamnuanlek.com/
3. Go to Settings → Verified Users → Add a verified user
4. Email: `seo-reporting-bot@kamnuanlek-seo-api.iam.gserviceaccount.com`
5. Role: Owner (or Editor)
6. Confirm and save
7. Run `node scripts/gsc-rankings.mjs` to verify access (should show top 100 keywords)

**Option B: Delegate to Someone with GSC Access**
- If you don't have GSC owner access, delegate to whoever does (likely CEO or business owner)
- Ask them to add the service account + confirm permission in writing
- Get verification that `gsc-rankings.mjs` succeeds

---

## SUCCESS CRITERIA

- [ ] Service account added to GSC property (https://www.kamnuanlek.com/)
- [ ] `node scripts/gsc-rankings.mjs` runs without permission errors
- [ ] KPI dashboard script can pull live ranking data
- [ ] CTO confirms completion to CEO (comment on this issue)

---

## TIMELINE

- **By 2026-04-28 12:00 UTC:** GSC access confirmed (so SEO Specialist can baseline metrics)
- **By 2026-04-29 06:00 UTC:** KPI dashboard live and feeding gate verification
- **2026-04-29 08:00 UTC:** Gate checkpoint (needs KPI data visible)

---

## ESCALATION

If you cannot access GSC or don't have owner permission:
1. Tell me immediately (by 2026-04-27 05:00 UTC, i.e., within 1.5 hours)
2. I will escalate to board or handle directly
3. Do not let this slip past 2026-04-28 12:00 UTC

---

## WHY THIS MATTERS

- **Not blocking user growth:** Articles are live, traffic arriving, monetization flowing
- **Only blocking KPI visibility:** Dashboard can't show rankings/positions until GSC authorized
- **Gate verification needs it:** Teams should verify with real data, not just code metrics
- **Post-launch monitoring depends on it:** Once live, we need ranking tracking to iterate

This is straightforward admin work, not technical debt. Fix it this morning if possible.

---

**Issued by:** CEO Henrik Madsen  
**Copy to:** All team leads (for awareness of CTO task priority)
