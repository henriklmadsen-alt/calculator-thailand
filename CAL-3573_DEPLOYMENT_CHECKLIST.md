# CAL-3573 Production Deployment Checklist

**Board Directive:** Complete by 2026-05-04 06:36 UTC (1-hour SLA)  
**Issue:** Phase 2 unblocking requires production deployment of GSC indexing fix

---

## Pre-Deployment (CTO)

- [ ] **0-5 min:** Review commits 92b1a142 + d6439a71
- [ ] **5-10 min:** Verify staging environment has fix applied
- [ ] **10-15 min:** Run build in staging: `npm run build`
- [ ] **Validation:** 947 pages built, no errors

## Deployment (CTO/DevOps)

- [ ] **15-25 min:** Deploy to production (standard rollout)
- [ ] **25-30 min:** Verify pages serve at https://www.kamnuanlek.com/คำนวณ-apr/ 
- [ ] **30 min:** Smoke test 3 calculator pages for hreflang correctness

### Smoke Test URLs (CTO)
```bash
curl -s https://www.kamnuanlek.com/คำนวณ-apr/ | grep -o '<link rel="canonical" href="[^"]*">'
curl -s https://www.kamnuanlek.com/คำนวณ-apr/ | grep -o '<link rel="alternate" hreflang="th-TH" href="[^"]*">'
# Both should show DIRECT THAI UNICODE, not URL-encoded
```

Expected result:
```html
<link rel="canonical" href="https://www.kamnuanlek.com/คำนวณ-apr/">
<link rel="alternate" hreflang="th-TH" href="https://www.kamnuanlek.com/คำนวณ-apr/">
```

## Post-Deployment (SEO Specialist)

- [ ] **30-35 min:** Confirm production deployment successful
- [ ] **35-40 min:** Run: `node scripts/submit-sitemaps-to-gsc.mjs`
- [ ] **40-45 min:** Verify GSC accepts sitemap resubmission
- [ ] **45-50 min:** Screenshot GSC sitemap submission status

## Monitoring (SEO Specialist + CMO)

- [ ] **50-60 min:** Set up GSC Coverage monitoring
  - [ ] Create daily tracking sheet for "Indexed count" (should increase by 200+)
  - [ ] Flag any new crawl errors
  - [ ] Monitor hreflang validation status
- [ ] **Next 24h:** Check GSC Coverage hourly (watch for re-crawl activity)
- [ ] **24-72h:** Daily reports on indexing progress

## Escalation (CMO)

- [ ] **50-60 min:** Notify CEO of deployment status
- [ ] **At 60 min:** Provide final status update to board
- [ ] **Post-deployment:** Monitor for issues and escalate immediately if needed

---

## Success Criteria

**Deployment successful when:**
- ✅ Production pages serve with corrected hreflang (direct Thai Unicode)
- ✅ Sitemaps resubmitted to GSC
- ✅ GSC monitoring dashboard active
- ✅ Board notified of successful completion

**If deployment fails:**
- [ ] Escalate immediately to CEO
- [ ] Document exact error
- [ ] Prepare rollback plan

---

## Post-Deployment Timeline

| When | What | Owner |
|------|------|-------|
| Now | Deploy + sitemap resubmit | CTO + SEO |
| 2h | Board briefed on execution | CMO |
| 24h | GSC begins re-crawl | Google (automatic) |
| 48h | Re-indexing accelerates | Google (automatic) |
| 72h | Full recovery expected | (monitoring) |

---

**Board Deadline:** 2026-05-04 06:36 UTC  
**Current Time:** 2026-05-04 05:36 UTC  
**Time Remaining:** 1 hour  

Execute NOW.
