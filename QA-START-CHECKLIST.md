# QA START CHECKLIST — AI Advisor Sprint

**When to use:** CTO signals that unblocking work has begun on CAL-1292, CAL-1383, or CAL-1371  
**Purpose:** Coordinate QA execution with CTO deployment timeline  
**Owner:** Release QA Engineer Alpha

---

## PRE-EXECUTION (Before QA Starts Any Task)

### Environment Setup
- [ ] Staging environment accessible and working
- [ ] Dev tools enabled (Chrome DevTools, Firefox Inspector, VoiceOver/NVDA available)
- [ ] Physical devices available (iPhone SE + Android if possible)
- [ ] Test data prepared (test users, test calculators)
- [ ] Stripe test mode credentials ready (for CAL-1299)
- [ ] Network throttling tools ready (Chrome DevTools, Firefox, 4G simulation)

### Browser & Device Matrix
- [ ] Chrome (latest) — desktop + mobile
- [ ] Firefox (latest) — desktop + mobile
- [ ] Safari (latest) — desktop + mobile (if Mac available)
- [ ] Edge (latest) — desktop
- [ ] Mobile browsers (Chrome Android, Safari iOS)
- [ ] Accessibility: VoiceOver (iOS), TalkBack (Android), NVDA (Windows), JAWS (Windows)

### Test Credentials Prepared
- [ ] Free tier test user
- [ ] Basic tier test user
- [ ] Premium tier test user
- [ ] Master tier test user
- [ ] Admin credentials (for usage stats verification)
- [ ] Stripe test cards (visa, amex, declined)

---

## WHEN CAL-1280 IS DEPLOYED (CTO Signals Completion)

### ✅ CAL-1370 — AI Advisor Empty State QA (4–6h)

**Trigger:** CTO signals CAL-1280 deployment to staging

**Phase-by-phase execution:**

1. **Phase 1: Pre-QA Setup** (5–10 min)
   - [ ] Confirm staging URL is live
   - [ ] Verify empty state page loads
   - [ ] Confirm no JavaScript errors in console
   - [ ] Confirm dark mode toggle visible

2. **Phase 2: Visual Layout & Rendering** (30–40 min)
   - [ ] Mobile 375px: layout correct, no horizontal scroll
   - [ ] Mobile 414px: responsive, readable
   - [ ] Desktop 1024px: full layout visible
   - [ ] Desktop 1440px: optimal spacing
   - [ ] Responsive breakpoints (360/414/768/1024/1440)

3. **Phase 3: Dark Mode Validation** (15–20 min)
   - [ ] Light mode: all colors per design system (contrast ≥4.5:1)
   - [ ] Dark mode: all colors per CAL-1103 palette
   - [ ] Dark mode toggle works (click = instant switch)
   - [ ] Preference persists (reload maintains selection)
   - [ ] WCAG AAA contrast verified (4.5:1 normal, 3:1 large)

4. **Phase 4: Interaction & Behavior** (25–30 min)
   - [ ] Card tap pre-fills input
   - [ ] Input focus works (keyboard appears)
   - [ ] Submit works (question sends)
   - [ ] Double-tap prevention (no duplicate sends)
   - [ ] Error messages appear + dismiss

5. **Phase 5: Keyboard Navigation & A11y** (30–40 min)
   - [ ] Tab order logical (left→right, top→bottom)
   - [ ] Focus visible (outline, color change)
   - [ ] No focus traps (can escape with Tab)
   - [ ] Enter submits form
   - [ ] Space activates buttons
   - [ ] Escape closes modals/dialogs
   - [ ] ARIA labels correct (screen reader test)

6. **Phase 6: Screen Reader Testing** (20–25 min)
   - [ ] VoiceOver (iOS): reads all elements
   - [ ] TalkBack (Android): reads all elements
   - [ ] NVDA (Windows): reads form labels + values
   - [ ] JAWS (Windows): reads headings + structure
   - [ ] Test: each element read in context

7. **Phase 7: Animation & Motion** (10–15 min)
   - [ ] Entrance animations (fade-in 300ms)
   - [ ] Hover feedback (color change, shadow)
   - [ ] Press feedback (opacity change)
   - [ ] `prefers-reduced-motion` respected (animations off if set)

8. **Phase 8: Cross-Browser Testing** (20–30 min)
   - [ ] Chrome: layout + interaction + dark mode ✓
   - [ ] Firefox: layout + interaction + dark mode ✓
   - [ ] Safari: layout + interaction + dark mode ✓
   - [ ] Edge: layout + interaction + dark mode ✓

9. **Phase 9: Performance Testing** (15–20 min)
   - [ ] Initial render <200ms (DevTools Lighthouse)
   - [ ] 60fps interaction (DevTools Performance)
   - [ ] Typing response <100ms
   - [ ] 4G throttle: still responsive

10. **Phase 10: Device Testing (Optional)** (30–40 min if physical devices)
    - [ ] iPhone SE: layout correct, touch targets work
    - [ ] Android (various): layout + touch targets
    - [ ] iPad: responsive layout

11. **Phase 11: Edge Cases & Error States** (15–20 min)
    - [ ] Long Thai text: wraps correctly
    - [ ] Special characters: rendered correctly
    - [ ] Network error: error message appears
    - [ ] Tier limit (free=3): quota message appears
    - [ ] Message history empty: placeholder shows

12. **Phase 12: Regression Testing** (10–15 min)
    - [ ] CAL-1273 (chat bubbles): no visual regression
    - [ ] CAL-1207 (dashboard): no navigation regression
    - [ ] CAL-1087 (result cards): no style regression

13. **Phase 13: Defect Logging** (ongoing)
    - [ ] Each issue logged with: title, steps, expected, actual, severity
    - [ ] P0 = blocks launch (= STOP, report immediately)
    - [ ] P1 = should fix (document, assess impact)
    - [ ] P2 = nice to have (log for post-launch)

14. **Phase 14: Sign-Off** (10 min)
    - [ ] Gate criteria reviewed (13 items above)
    - [ ] P0 count = 0 (zero critical issues)
    - [ ] P1 count ≤ 1 (max one non-critical)
    - [ ] Zero regressions vs existing features
    - [ ] Mobile 375px passed all tests
    - [ ] Dark mode WCAG AAA passed
    - [ ] Thai copy verified
    - [ ] QA sign-off = PASS or FAIL

---

## WHEN CAL-1292 IS DEPLOYED (CTO Signals Completion)

### ✅ CAL-1388 — Security Test (2–3h)

**Trigger:** CTO signals CAL-1292 (tier enforcement backend) deployed to staging

**Test 1: Quota Bypass**
- [ ] Free user created, 3 question limit set
- [ ] User sends 1st question → success
- [ ] User sends 2nd question → success
- [ ] User sends 3rd question → success
- [ ] User sends 4th question → HTTP 429 "quota exceeded" error
- [ ] ✓ PASS: quota enforced on backend, not just frontend

**Test 2: Tier Downgrade Enforcement**
- [ ] Premium user subscribed, 500 q/month limit
- [ ] Subscription downgraded to Basic (200 q/month)
- [ ] JWT refreshed (new token fetched)
- [ ] User tries question 201 → HTTP 429 "quota exceeded"
- [ ] ✓ PASS: downgrade effective immediately

**Test 3: Cross-User Access (403 Enforcement)**
- [ ] User A asks question (question_id=123)
- [ ] User B authenticated (different JWT)
- [ ] User B tries GET /api/questions/123 → HTTP 403 Forbidden
- [ ] User B tries to modify question → HTTP 403 Forbidden
- [ ] ✓ PASS: no cross-user data leakage

**Test 4: JWT Manipulation (Token Tampering)**
- [ ] User A token: `tier: "free"`
- [ ] Token modified locally: `tier: "master"` (fraudulent claim)
- [ ] Malicious request with modified token → backend validates JWT signature
- [ ] Signature mismatch → HTTP 401 Unauthorized
- [ ] ✓ PASS: signature verification prevents tampering

**Test 5: Unauthenticated API Access**
- [ ] DELETE /api/ai-advisor/questions/123 without auth header
- [ ] → HTTP 401 Unauthorized
- [ ] GET /api/admin/usage-stats without auth header
- [ ] → HTTP 401 Unauthorized
- [ ] ✓ PASS: all endpoints require authentication

**Test 6: Rate Limit Bypass**
- [ ] User submits 10 questions in 1 minute
- [ ] Questions 1–10 succeed
- [ ] Question 11 → HTTP 429 "rate limited"
- [ ] Wait 60 seconds, question 12 succeeds
- [ ] ✓ PASS: rate limiter enforced per minute

**Sign-off:** All 6 scenarios blocked ✓ = PASS

---

## WHEN CAL-1383 IS DEPLOYED (CTO Signals Completion)

### ✅ Tier Enforcement Data Accuracy Verification

**Trigger:** CTO signals CAL-1383 (/api/me fix) deployed to staging

**Data Freshness Test:**
- [ ] User A: 0 questions asked, questionsUsed in /api/me = 0
- [ ] User A sends 1 question
- [ ] GET /api/me → questionsUsed = 1 (fresh from DB, not stale JWT)
- [ ] User A sends 2nd question
- [ ] GET /api/me → questionsUsed = 2 (not still 1)
- [ ] ✓ PASS: questionsUsed always fresh from database

**Admin Stats Accuracy:**
- [ ] GET /api/admin/usage-stats → lists all users + question counts
- [ ] Counts match /api/me results per user
- [ ] Tier displays correctly (not stale)
- [ ] ✓ PASS: admin stats match user reality

---

## WHEN CAL-1371 IS DEPLOYED (CTO Signals Completion)

### ✅ CAL-1386 — Mobile QA Re-Test (1–2h)

**Trigger:** CTO signals CAL-1371 (mobile fixes) deployed to staging

**P0 Re-Verification:**
- [ ] 100dvh keyboard issue: input visible above iOS/Android keyboard ✓
- [ ] Dark mode: @media(prefers-color-scheme: dark) applied + tested ✓
- [ ] Touch targets: logout ≥44px, tier badge ≥32px ✓
- [ ] Safe areas: notched phones inset correctly ✓
- [ ] 375px breakpoint: input 16px+ (prevents iOS zoom) ✓

**Final mobile pass/fail:** All P0 items ✓ = PASS

---

## TIMING & DEPENDENCY TRACKING

```
2026-04-25 06:45 — Release readiness report delivered

⏳ Waiting for CAL-1280 →
   2026-04-25 12:00 (est) — CAL-1370 execution starts (4–6h)
   ✓ If CAL-1280 delayed, notify QA immediately

⏳ Waiting for CAL-1292 →
   2026-04-25 13:00 (est) — CAL-1388 execution starts (2–3h)
   ✓ If CAL-1292 delayed >4h, escalate to CEO

⏳ Waiting for CAL-1383 →
   2026-04-25 14:00 (est) — Data accuracy verification (30 min)
   ✓ If CAL-1383 delayed, cannot verify tier enforcement

⏳ Waiting for CAL-1371 →
   2026-04-25 15:00 (est) — CAL-1386 mobile re-test (1–2h)
   ✓ If CAL-1371 delayed, mobile QA cannot pass

2026-04-26 08:00 — CAL-1299 Stripe QA (6–8h)
2026-04-26 16:00 — Final smoke test + sign-off
2026-04-26 18:00 UTC — LAUNCH WINDOW
```

---

## COMMUNICATION TEMPLATE (For CTO Status Updates)

**When CTO signals completion of a blocker, respond:**

```
Subject: [CAL-XXXX] QA acknowledged — starting execution

CTO has deployed [CAL-1292/1383/1371]. QA starting [CAL-1370/1388/1386] now.

Expected completion: [time + 4–6h]
Will report pass/fail by: [time + completion]

If any P0 issues found, will escalate immediately.
```

---

## POST-EXECUTION (After Each QA Task)

### Defect Summary Template

```markdown
# [CAL-XXXX] QA Execution Complete

**Status:** PASS / FAIL  
**Duration:** X hours Y minutes  
**Date:** 2026-04-25 HH:MM UTC

## Summary
- P0 issues: [0/N]
- P1 issues: [0/N]
- Regressions: [0/N]

## Critical Findings (if any)
[P0 issues listed with: title, steps, severity, release impact]

## Sign-Off
[Pass: gates met and QA ready for next task]
[Fail: gates not met, rework required]

## Next Task Unblocked
[CAL-XXXX ready to start]
```

---

**Created:** 2026-04-25 06:45 UTC  
**Owner:** Release QA Engineer Alpha  
**Status:** Ready for CTO hand-off signals
