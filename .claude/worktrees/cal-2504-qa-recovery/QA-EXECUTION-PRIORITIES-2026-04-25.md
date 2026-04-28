# QA Execution Priorities — AI Advisor Sprint

**Date:** 2026-04-25 06:45 UTC  
**Release deadline:** 2026-04-26 18:00 UTC (36 hours)  
**Release QA Engineer:** Release QA Engineer Alpha

---

## IMMEDIATE PRIORITY (Next 4–6 Hours)

### 1. CAL-1370 — AI Advisor Empty State QA ⏩ START NOW

**Status:** Specification ready; awaiting CAL-1280 CTO implementation  
**Timeline:** 4–6 hours total execution  
**Depends on:** CAL-1280 (empty state implementation) from CTO  
**Blocks:** Nothing (execute in parallel to CTO work on P0 blockers)

**What to do:**
- Monitor CTO completion of CAL-1280 implementation
- Once CTO deploys CAL-1280 (to staging), immediately start CAL-1370 QA execution
- 14-phase plan (per memory): layout → dark mode → interaction → a11y → animation → cross-browser → performance → devices → edge cases → regression → sign-off

**Success criteria:**
- 100% P0 pass (zero critical issues)
- ≥95% P1 pass (minor issues documented)
- Zero regressions vs existing features
- WCAG AAA verified (dark mode + light mode)
- Mobile 375px verified
- Touch targets ≥44px
- Keyboard navigation complete
- Thai copy verified

**Defect logging:**
- P0/P1/P2 classification
- Reproducibility verified
- Severity + release impact documented

---

## BLOCKED PRIORITIES (Waiting for CTO Unblocks)

### 2. CAL-1388 — Security Test (Tier Enforcement Bypass)

**Blocker:** CAL-1292 (auth endpoints) + CAL-1383 (data accuracy)  
**Timeline:** 2–3 hours execution (ready to start once unblocked)  
**Test scope:** 6 bypass attack scenarios + cross-user access

**To execute once unblocked:**
- Test 1: Quota bypass (free user tries to exceed 3 questions/month)
- Test 2: Tier downgrade (premium user downgraded to basic, quota enforced)
- Test 3: Cross-user question access (user A tries to see user B's questions)
- Test 4: JWT manipulation (tamper with tier claim in token)
- Test 5: Direct API abuse (hit /api/ai-advisor without auth)
- Test 6: Rate limit bypass (exceed 10 q/min limit)

---

### 3. CAL-1299 — Stripe Checkout QA

**Blocker:** CAL-1292 (tier enforcement backend)  
**Timeline:** 6–8 hours execution (40 test cases ready)  
**Test scope:** API validation + UI + checkout flow + errors + cross-device + security

**Ready to execute once CAL-1292 deployed:**
- Checkout session creation
- Tier card display + selection
- Test card processing (Stripe test mode)
- Webhook handling + tier update on DB
- Error scenarios (declined card, timeout, etc.)
- Mobile checkout flow (375px)
- Security (no sensitive data in logs, SSL/TLS)
- Performance (<3s checkout load)

---

### 4. CAL-1294 — SSE Streaming QA

**Blocker:** CAL-1292 (tier enforcement)  
**Timeline:** 4–6 hours execution (23 test cases ready)  
**Test scope:** Real-time response streaming, error handling, mobile, a11y, performance

**Ready to execute once CAL-1292 deployed:**
- Happy path: AI advisor response streams in real-time
- Stream terminates correctly on completion
- Error handling (API failure, timeout, rate limit)
- Mobile streaming (network throttle, interruption)
- Keyboard + a11y during streaming
- Cross-browser (Chrome, Firefox, Safari, Edge)
- Performance (no memory leaks, <100ms latency)

---

### 5. CAL-1300 — Conversation History API QA

**Blocker:** API implementation (not yet deployed)  
**Timeline:** 4–6 hours execution (47 test cases ready)  
**Test scope:** CRUD operations + pagination + access control + title auto-generation

**Ready to execute once API implemented:**
- GET /conversations (list all user conversations)
- POST /conversations (create new conversation)
- GET /conversations/:id (fetch single conversation)
- PATCH /conversations/:id (rename conversation)
- DELETE /conversations/:id (delete conversation)
- Search conversations (by title/content)
- Pagination (limit, offset, cursor)
- Access control (403 on cross-user access)
- Title auto-generation (first 50 chars of first question)

---

## REGRESSION TESTING (Ongoing)

### CAL-1418 — Post-Deploy Smoke Test

**Status:** Ready to execute anytime  
**Timeline:** 15–20 minutes  
**Requires:** Staging or production deployment  

**Scope:**
- 9 phases (routes, mobile, SEO, a11y, JS, ads, browser, content, metadata)
- Prevents regressions from CAL-774, CAL-1244, CAL-1162
- Must pass before production release

**Execute before each Railway deployment:**
```bash
./scripts/cal-1418-post-deploy-smoke-test.sh --env=staging
./scripts/cal-1418-post-deploy-smoke-test.sh --env=production
```

---

## THAI QUALITY VERIFICATION (Post-CTO Unblock)

### CAL-1341 / CAL-1431 — Thai Localization QA Refresh

**Status:** Findings complete (2200+ lines delivered)  
**Blocker:** CAL-1292 (live API testing)  
**Timeline:** 2–3 hours refresh execution (once live API available)

**Refresh scope (once deployed):**
- Re-test 8 curated Thai samples on live API
- System prompt improvements implemented (Priority 1–4)
- Critical blocker fixes verified (machine translation, USD thinking, fragmented Thai)
- Thai copy quality (tone, clarity, accuracy)
- Answer examples from Thai financial context

**Success criteria:**
- Reduce "needs work" + "red flag" from 50% to <10%
- Increase "excellent" + "good" to >90%
- Zero machine translation markers
- Thai tone consistent and natural

---

## TIMING ANALYSIS

### Best-Case Scenario (Parallel Unblocking)
```
2026-04-25 06:45 — Release readiness report delivered
2026-04-25 08:00 — CAL-1370 starts (pending CAL-1280 completion)
2026-04-25 13:00 — CAL-1392/1383/1371 deployed (CTO finished blockers)
2026-04-25 13:30 — CAL-1386 mobile QA re-test (1–2h)
2026-04-25 15:00 — CAL-1388 security test (2–3h)
2026-04-25 18:00 — CAL-1370 complete (if started at 08:00)
2026-04-26 08:00 — CAL-1299 Stripe QA (6–8h)
2026-04-26 16:00 — Final smoke test (1h)
2026-04-26 17:00 — QA sign-off ready
2026-04-26 18:00 — LAUNCH WINDOW
```

**Result:** Launch can proceed 2026-04-26 18:00 UTC ✓

### Worst-Case Scenario (Sequential Unblocking)
```
2026-04-25 06:45 — Release readiness report delivered
2026-04-25 12:00 — Only CAL-1292 deployed (6h serial)
2026-04-25 13:00 — CAL-1299 starts (cannot start earlier)
2026-04-25 19:00 — CAL-1299 complete (6h)
2026-04-26 09:00 — CAL-1383 + CAL-1371 deploy (6h)
2026-04-26 11:00 — CAL-1388 security test (2–3h)
2026-04-26 15:00 — CAL-1386 mobile re-test (1–2h)
2026-04-26 17:00 — Final smoke test (1h)
2026-04-26 18:00 — QA CANNOT SIGN OFF (1h short)
```

**Result:** Launch misses deadline ✗

**Recommendation:** CTO must do parallel unblocking to make 2026-04-26 18:00 UTC launch.

---

## QA Communication Checklist

### To CTO (Immediate)
- [ ] Confirm receipt of release readiness report
- [ ] Confirm unblocking sequence (parallel vs sequential)
- [ ] Confirm CAL-1280 deployment timeline
- [ ] Confirm CAL-1292 start time (critical path blocker)
- [ ] Update QA on blockers/timeline hourly

### To CEO (If Needed)
- [ ] If CAL-1292 not started by 2026-04-25 08:00 UTC → launch at risk
- [ ] If all blockers unblocked by 2026-04-25 13:00 UTC → launch can proceed
- [ ] If any P0 blocker still open by 2026-04-26 16:00 UTC → launch delayed

### Internal QA (Team Coordination)
- [ ] CAL-1370 execution readiness (monitor CTO CAL-1280 progress)
- [ ] CAL-1388 test plan ready (blocked, waiting for unblock signal)
- [ ] CAL-1299 test plan ready (blocked, waiting for unblock signal)
- [ ] CAL-1294 test plan ready (blocked, waiting for unblock signal)
- [ ] CAL-1418 smoke test checklist ready (run before each deploy)

---

## Sign-Off Criteria (Gate CAL-1208)

**CANNOT SHIP unless all of these pass:**

1. ✅ CAL-1370 (empty state QA) — P0=0, P1≤1, 0 regressions
2. ✅ CAL-1386 (mobile QA re-test) — 100% P0 pass, 375px verified
3. ✅ CAL-1388 (security test) — All 6 bypass scenarios blocked
4. ✅ CAL-1299 (Stripe QA) — Checkout + webhook + tier update verified
5. ✅ CAL-1294 (SSE QA) — Streaming works, errors handled
6. ✅ CAL-1300 (API QA) — Access control enforced, no cross-user leaks
7. ✅ CAL-1418 (smoke test) — 9 phases pass, no regressions
8. ✅ CAL-1431 (Thai QA refresh) — Thai quality >90% acceptable
9. ✅ Zero P0 issues across all QA tasks
10. ✅ Mobile 375px verified and working
11. ✅ Dark mode WCAG AAA verified
12. ✅ Thai content natural and accurate
13. ✅ Performance acceptable (<200ms render, 60fps interaction)

**If any sign-off criteria fail:** DO NOT SHIP. Rework + re-test.

---

**Created by:** Release QA Engineer Alpha  
**Status:** Ready for execution once CTO unblocks  
**Last updated:** 2026-04-25 06:45 UTC
