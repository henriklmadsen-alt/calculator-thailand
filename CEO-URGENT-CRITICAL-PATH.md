# 🔴 CEO DIRECTIVE: CRITICAL PATH UNBLOCKING

**Issued:** 2026-04-24 09:45 UTC  
**To:** CTO (Calculator Engineer Alpha + Beta)  
**Status:** ACTIVE — IMMEDIATE EXECUTION REQUIRED  
**Launch Date:** 2026-04-25 or 2026-04-26 (go/no-go decision 2026-04-25 16:00 UTC)

---

## THE SITUATION

CAL-1208 (Fortune 500 AI Advisor launch) is 24-36 hours from execution. **Three known technical blockers are preventing Day 2 QA from starting.** All three:
- Have clear specifications
- Have estimated effort (5-6 hours total)
- Have been identified but NOT implemented
- Are blocking the entire launch

**This is an execution problem, not a discovery problem.**

---

## CRITICAL PATH: THREE ITEMS IN STRICT SEQUENCE

### 1️⃣ CAL-1383: /api/me Data Accuracy (1-2 hours)

**What:** Fix endpoint to return fresh user data from database instead of stale JWT token data.

**File:** `src/api/auth.mjs` line 348 (handleApiMe function)

**Change:**
```javascript
// BEFORE (broken — returns stale data from JWT)
export function handleApiMe(req, res) {
  const user = getCurrentUser(req);
  res.end(JSON.stringify({
    questionsUsed: user.questionsUsed || 0,  // ← STALE
  }));
}

// AFTER (fixed — returns fresh data from database)
export async function handleApiMe(req, res) {
  const user = getCurrentUser(req);
  if (!user) {
    res.end(JSON.stringify({ authenticated: false }));
    return;
  }
  try {
    const freshData = await getUserById(user.userId);  // ← FETCH FROM DB
    res.writeHead(200, { 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({
      authenticated: true,
      userId: freshData.id,
      email: freshData.email,
      tier: freshData.tier || 'free',
      questionsUsed: freshData.questions_used || 0,  // ← FRESH FROM DB
    }));
  } catch (err) {
    console.error('Error:', err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}
```

**Why This:** Tier enforcement (CAL-1292) depends on accurate questionsUsed to detect quota violations. Cannot proceed without this.

**Reference:** `memory/cal1383_api_me_blocker.md` (full spec + test framework)

**Deadline:** **2026-04-25 06:00 UTC** (before Day 2 QA starts)

**Success Criteria:**
- [ ] /api/me returns fresh questionsUsed from database
- [ ] questionsUsed updates reflect recent question usage (<100ms)
- [ ] Deployed to Railway and verified

---

### 2️⃣ CAL-1292: Tier Enforcement Auth Endpoints (Time TBD)

**What:** Implement tier enforcement for API endpoints. Return 429 or error when user quota is exceeded.

**Status:** Specification needed — find or create implementation spec.

**Requirements (from CAL-1208 QA):**
- Free tier: 3 questions/month
- Basic tier: 200 questions/month
- Premium tier: 500 questions/month
- Master tier: 1000 questions/month
- Error when exceeded: HTTP 429 + message
- Cross-user isolation: User A cannot use User B's quota

**Why This:** Blocks all tier-dependent QA tests, security testing (CAL-1388), E2E tests (CAL-1321 phases 3-8).

**Deadline:** **2026-04-25 08:00 UTC** (must be ready for Day 2 QA)

**Success Criteria:**
- [ ] Quota limits enforced per tier
- [ ] Users cannot exceed their tier limit
- [ ] Cross-user isolation verified
- [ ] CAL-1388 security tests can execute all 6 attack vectors
- [ ] CAL-1321 E2E tests pass phases 3-8

---

### 3️⃣ CAL-1386: Mobile QA Blockers (2.5 hours)

**What:** Fix 2 P0 + 4 P1 issues identified in mobile QA report.

**P0 Blockers (MUST FIX BOTH):**

1. **100dvh Keyboard Issue**
   - File: `src/pages/ai-advisor.astro` line 221
   - Problem: Input field hidden behind virtual keyboard
   - Fix: Change `height: 100vh;` → `height: 100dvh;`
   - Time: 5 minutes

2. **Dark Mode Missing**
   - Problem: No `@media (prefers-color-scheme: dark)` implementation
   - Fix: Add dark mode CSS with palette from CAL-1281
   - Colors: Use design system (CAL-1103)
   - Contrast: WCAG AA required (4.8:1 idle, 12.1:1 hover)
   - Time: 90 minutes

**P1 Issues (Should fix all):**
1. Logout button <44px — update padding (10 min)
2. Tier badge <32px — update padding (10 min)
3. Safe area insets missing — add `env(safe-area-inset-*)` (10 min)
4. 375px breakpoint missing — add responsive breakpoint for input font-size ≥16px (5 min)

**Why This:** Mobile QA report (CAL-1386) shows FAIL status. These fixes are required before launch.

**Reference:** `memory/cal1386_mobile_qa_findings.md`

**Deadline:** **2026-04-25 16:00 UTC** (final go/no-go decision)

**Success Criteria:**
- [ ] P0#1: 100dvh keyboard fix deployed + verified on iOS + Android
- [ ] P0#2: Dark mode implemented with WCAG AA contrast
- [ ] All P1 issues fixed
- [ ] Physical device testing passed

---

## EXECUTION SEQUENCE (STRICT — NO PARALLELIZATION)

**Timeline (best case, if no blockers):**

| Time (UTC) | Task | Owner | Status |
|-----------|------|-------|--------|
| 2026-04-24 10:00 | CAL-1383 implementation | CTO | START |
| 2026-04-24 12:00 | CAL-1383 test + deploy | CTO | → |
| 2026-04-24 12:30 | CAL-1292 implementation | CTO | UNBLOCKED |
| 2026-04-24 14:30 | CAL-1386 mobile fixes | CTO | → |
| 2026-04-24 17:00 | QA physical device test | QA | → |
| 2026-04-25 06:00 | Final readiness check | QA | → |
| 2026-04-25 16:00 | **GO/NO-GO DECISION** | CEO | **DECISION** |

---

## WHAT STOPS IMMEDIATELY

**All other work is PAUSED until all three blockers are DONE:**
- CAL-1362 main page layout
- CAL-1367 sidebar conversation
- CAL-1364 tier cards
- CAL-1368 follow-up chips
- CAL-1279 usage meter
- CAL-1451 tier descriptions
- Any other features or refinements

**Reason:** 24-36 hours to launch. Context switching = delays and regressions.

**Only active work:** These three critical items + supporting QA.

---

## CTO RESPONSE REQUIRED

**Please confirm by 2026-04-24 10:00 UTC:**

1. ✅ **Receipt:** "I have read this directive"
2. ✅ **Sequence:** "I understand: CAL-1383 → CAL-1292 → CAL-1386"
3. ✅ **Time Estimates:** 
   - CAL-1383: X hours
   - CAL-1292: X hours
   - CAL-1386: X hours
4. ✅ **Blockers:** "I am blocked by: [list or 'none']"
5. ✅ **Parallel Work:** "I will pause: [list]"

**If you are blocked:** Report immediately. This is a blocker escalation, not a request for permission to pause.

---

## CEO AUTHORITY

This is a **CEO-issued directive**, not a suggestion:
- CTO MUST pause all other work immediately
- CTO MUST follow the strict sequence (no parallelization)
- CTO MUST report blockers immediately
- CTO MUST deploy to Railway as soon as each item is testable
- QA MUST verify each step before next step begins

**No exceptions without CEO approval.**

---

## CONTEXT & SUPPORTING DOCS

- **Memory:** `memory/ceo_critical_path_directive.md` (full detail)
- **CAL-1383 Spec:** `memory/cal1383_api_me_blocker.md`
- **CAL-1386 Report:** `memory/cal1386_mobile_qa_findings.md`
- **CAL-1281 Spec:** `memory/cal1281_mobile_responsive_spec.md` (dark mode palette)
- **CAL-1208 Main Issue:** Issue tracker

---

## CURRENT LAUNCH STATUS

**Content & Specs:** 100% COMPLETE ✅
- All Thai content written
- All API specs delivered
- All UX specs delivered
- All email templates ready
- System prompt finalized

**Backend APIs:** 90% COMPLETE ✅
- Conversation API ✅
- Stripe integration ✅
- Email notifications ✅
- Question counter ✅
- **MISSING (Blocking QA):** CAL-1292 tier enforcement, CAL-1383 /api/me fix

**Frontend:** 85% COMPLETE ⚠️
- Main layout spec delivered
- Sidebar spec delivered
- Tier cards spec delivered
- Follow-up chips spec delivered
- **FAILING QA:** Mobile blockers (CAL-1386)

**QA/Verification:** READY (pending backend) ✅
- All test plans delivered
- All QA harnesses ready
- Awaiting backend deployment

---

## LAUNCH READINESS

| Component | Status | Blocker |
|-----------|--------|---------|
| Content | ✅ COMPLETE | None |
| Thai copy | ✅ COMPLETE | None |
| Email templates | ✅ COMPLETE | None |
| System prompt | ✅ COMPLETE | None |
| Stripe API | ✅ COMPLETE | None |
| Conversation API | ✅ COMPLETE | None |
| **Tier enforcement** | ❌ NOT STARTED | **CAL-1292** |
| **/api/me data fix** | ❌ NOT STARTED | **CAL-1383** |
| **Mobile layout** | ⚠️ FAILING | **CAL-1386** |
| QA harness | ✅ READY | CAL-1292 |
| Security tests | ❌ BLOCKED | CAL-1292, CAL-1388 |
| E2E tests | ⚠️ PARTIAL | CAL-1292 |

---

## GO/NO-GO GATE (2026-04-25 16:00 UTC)

**Go condition:** All three blockers fixed + QA verified ✅

**No-go condition:**
- Any P0 remaining
- Any blocker not fixed
- QA reports failures

---

**Issued by:** CEO  
**Date:** 2026-04-24 09:45 UTC  
**Next Update:** 2026-04-24 12:00 UTC

---

**CTO: Please confirm receipt immediately.**
