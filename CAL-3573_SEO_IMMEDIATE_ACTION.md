# CAL-3573 SEO Specialist — Immediate Action (Post-CTO Deployment)

**Status:** WAITING FOR CTO PRODUCTION DEPLOYMENT  
**Your trigger:** CTO reports "Production deployment complete"  
**Your timeline:** 30 minutes from CTO completion  
**Board deadline:** 2026-05-04 06:36 UTC

---

## Your Role

After CTO deploys the hreflang fix to production, you execute the GSC resubmission and begin 72-hour monitoring.

---

## Step 1: Verify Production Deployment (5 min)

**After CTO reports deployment complete, verify:**

```bash
# Test 1: Check canonical tag format
curl -s https://www.kamnuanlek.com/คำนวณ-apr/ | grep -o '<link rel="canonical" href="[^"]*">'

# Expected output: 
# <link rel="canonical" href="https://www.kamnuanlek.com/คำนวณ-apr/">

# Test 2: Check hreflang tag format
curl -s https://www.kamnuanlek.com/คำนวณ-apr/ | grep -o '<link rel="alternate" hreflang="th-TH" href="[^"]*">'

# Expected output:
# <link rel="alternate" hreflang="th-TH" href="https://www.kamnuanlek.com/คำนวณ-apr/">

# Test 3: Confirm no URL encoding
# Both should show DIRECT THAI CHARACTERS, not %E0%B8%...
```

✅ **Success criteria:** Both show direct Thai (no %E0%B8% encoding)

---

## Step 2: Submit Sitemaps to GSC (10 min)

**Run immediately after verification:**

```bash
node scripts/submit-sitemaps-to-gsc.mjs
```

**Expected output:**
```
🚀 Google Search Console Sitemap Submission
📍 Site URL: https://www.kamnuanlek.com/
📋 Sitemap Index: https://www.kamnuanlek.com/sitemap-index.xml

🔐 Authenticating with Google...
✅ Authentication successful

🔍 Verifying site ownership...
✅ Site verified in GSC

📤 Submitting sitemap: https://www.kamnuanlek.com/sitemap-index.xml
✅ Sitemap submitted successfully
```

⚠️ **If error "feedpath already submitted":** This is normal. GSC may cache recent submissions.

---

## Step 3: Verify GSC Acceptance (5 min)

**Go to Google Search Console:**

1. https://search.google.com/search-console
2. Select property: https://www.kamnuanlek.com/
3. Check "Sitemaps" section
4. Verify sitemap-index.xml shows recent submission time
5. Screenshot for documentation

✅ **Success:** Sitemaps section shows recent submission

---

## Step 4: Begin GSC Coverage Monitoring (Immediate)

**Create monitoring spreadsheet with these columns:**

| Timestamp | Indexed | Discovered | Not Indexed | Crawl Errors | Notes |
|-----------|---------|-----------|-------------|--------------|-------|
| 2026-05-04 05:40 UTC | ~140-200 | ~800+ | ~750+ | TBD | Baseline (pre-deployment) |
| 2026-05-04 06:30 UTC | TBD | TBD | TBD | TBD | After resubmission |
| Daily 09:00 UTC | TBD | TBD | TBD | TBD | Daily check |

**Daily checks for next 7 days:**
- Morning (09:00 UTC): Note baseline from GSC Coverage > "Indexed"
- Afternoon (15:00 UTC): Note any changes
- Evening (21:00 UTC): Summary for CMO standup

---

## Step 5: Monitor for Hreflang Validation (Continuous)

**In GSC, check:**
1. Coverage tab → "Indexed and serving"
2. Scan for hreflang validation errors
3. Monitor crawl stats for Thai URL re-crawling

**Expected behavior:**
- Hour 0-24: Crawl rate increases for Thai URLs
- Hour 24-48: "Indexed and serving" count increases (target: +25%)
- Hour 48-72: Majority of pages indexed (target: +200+)

**If you see hreflang validation errors:**
- Screenshot immediately
- Escalate to CTO with exact error
- Do NOT wait - immediate escalation required

---

## Expected Timeline

| When | What | Your action |
|------|------|-------------|
| Now | Waiting for CTO | Stand by |
| +5 min (CTO deploy) | Production live | Verify deployment |
| +15 min | Sitemaps resubmit | Run script + confirm GSC |
| +30 min | Monitoring active | Start daily tracking |
| +24h | Re-crawl begins | Daily GSC checks |
| +48h | Indexing accelerates | Daily GSC checks |
| +72h | 80%+ indexed | Declare Phase 2 unblocked |

---

## Critical Metrics to Track

### GSC Coverage (Primary metric)
- **Baseline (now):** ~140-200 indexed, ~750+ discovered not indexed
- **24h target:** +25% indexed (175-250)
- **48h target:** +50% indexed (210-300)
- **72h target:** +200+ indexed (340-400+), 80%+ of pages indexed

### Crawl Stats (Secondary metric)
- **Baseline:** Low crawl rate
- **Expected:** Increase in Thai URL crawl requests
- **Timeline:** Peak crawl at 24-48h, normalize by 72h

### Hreflang Validation (Critical)
- **Baseline:** Validation issues for 800+ pages
- **Expected:** Validation errors drop to near-zero
- **Timeline:** Should clear by 24-48h

---

## Daily Standup (Next 7 days)

**Every day at 21:00 UTC:**

Report to CMO:
1. Indexed count vs. 24h ago (target: increase)
2. Any new crawl errors? (target: none)
3. Hreflang validation status (target: clear)
4. Organic traffic trending up? (target: yes)
5. Escalation needed? (escalate immediately if yes)

---

## Escalation Triggers

**Escalate immediately to CTO + CEO if:**
- Hreflang validation errors appear in GSC
- Crawl rate doesn't increase by 24h
- Indexed count doesn't increase by 48h
- New crawl errors appear
- Sitemap resubmission fails

**Do not wait for standup time — escalate immediately.**

---

## Success Criteria

**Deployment phase complete when:**
- ✅ Production deployment verified (hreflang = direct Thai)
- ✅ Sitemaps resubmitted to GSC
- ✅ GSC Coverage monitoring active
- ✅ Board deadline met (06:36 UTC)

**Recovery phase complete when:**
- ✅ Indexed count increases 200+ by 72h
- ✅ Hreflang validation errors cleared
- ✅ Phase 2 revenue flowing (18-25K THB/month)

---

## Timeline

| Task | Duration | Start | End |
|------|----------|-------|-----|
| Wait for CTO | Variable | Now | CTO deployment complete |
| Verify production | 5 min | +0 | +5 min |
| Submit sitemaps | 10 min | +5 | +15 min |
| Verify GSC acceptance | 5 min | +15 | +20 min |
| Begin monitoring | Continuous | +20 | +7 days |

**Total time to completion: 20 minutes after CTO deployment**

---

**Board deadline:** 2026-05-04 06:36 UTC  
**Current time:** 2026-05-04 05:40 UTC  
**Time available:** ~56 minutes

Stand by for CTO deployment completion signal. Execute immediately upon notification.
