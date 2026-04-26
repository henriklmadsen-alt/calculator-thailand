# BOARD CHAIR MASTER PLAN — CAL-1208 Fortune 500 Launch
**Date**: 2026-04-24 22:58 GMT+7  
**Authority**: Board Chair (CEO, 24-hour emergency mandate)  
**Status**: ACTIVE EXECUTION  
**Deadline**: 2026-04-27 19:00 GMT+7 (go/no-go decision)

---

## WHAT WE'RE BUILDING

**Product**: AI Financial Advisor for Thailand Calculator Platform  
**Scope**: Fortune 500 launch-ready AI chatbot integrated into calculator.th  
**Market**: Thailand (Thai language, Thai financial context)  
**Goal**: Rank #1 on Google for key Thai AI advisor keywords + complete AI bot integration

---

## WHY (Strategic Context)

- **Revenue**: AI Advisor unlocks subscription tier system (Basic/Premium/Master)
- **User Retention**: Keeps users on platform longer, increases engagement
- **Market Position**: First AI advisor for Thai financial calculators
- **Competitive**: Differentiator vs competitors
- **Timeline Pressure**: Board approved 72h extension from original 34h window

---

## TIMELINE SNAPSHOT (GMT+7)

| Date/Time | Milestone | Owner | Status |
|-----------|-----------|-------|--------|
| 2026-04-24 23:20 | CTO response deadline | CTO | **ACTIVE** (20 min) |
| 2026-04-24 23:30 | CAL-1292/1383/1386 work starts | CTO | **PENDING** |
| 2026-04-25 09:00 | CAL-1292 must be 50% complete | CTO | **TARGET** |
| 2026-04-25 15:00 | CAL-1292/1383/1386 all complete | CTO | **DEADLINE** |
| 2026-04-25 09:00 | QA empty state (CAL-1370) complete | QA | **TARGET** |
| 2026-04-25 09:00 | SEO keyword strategy finalized | SEO/GEO | **DEADLINE** |
| 2026-04-25 15:00 | Security test (CAL-1388) PASS | QA | **DEADLINE** |
| 2026-04-25 18:00 | Stripe integration QA (CAL-1299) PASS | QA | **DEADLINE** |
| 2026-04-26 06:00 | Thai localization QA (CAL-1431) PASS | QA | **DEADLINE** |
| 2026-04-26 12:00 | Final smoke test complete | QA | **DEADLINE** |
| 2026-04-27 19:00 | **GO/NO-GO DECISION** | Board Chair | **FINAL** |
| 2026-04-27 01:00 | **LAUNCH** (if go) | DevOps | **LAUNCH** |

---

## THE THREE CRITICAL BLOCKERS (CTO — PARALLEL EXECUTION)

### 1. CAL-1292: Tier Enforcement Backend
**What**: Auth endpoints for subscription tier management  
**Why**: Protects free/paid features; enables Stripe integration testing  
**Owner**: Calculator Engineer Alpha (CTO)  
**Effort**: 6-8h (critical path)  
**Deadline**: 2026-04-25 15:00 GMT+7  
**Start time**: MUST BE NOW (2026-04-24 23:30 GMT+7)  

**Deliverables**:
- POST /api/auth/upgrade (tier upgrade endpoint)
- POST /api/auth/downgrade (tier downgrade endpoint)
- Middleware: tier-gated question quota enforcement
- JWT claims update on tier change
- Database: user.subscription_tier tracking

**Success**: All endpoints pass unit tests + E2E integration test (CAL-1321)

---

### 2. CAL-1383: /api/me Data Accuracy
**What**: Fix stale JWT data issue  
**Why**: Tier enforcement testing requires fresh, accurate user state  
**Owner**: Calculator Engineer Alpha (CTO)  
**Effort**: 1-2h  
**Deadline**: 2026-04-25 15:00 GMT+7  
**Start time**: PARALLEL with CAL-1292

**Deliverables**:
- Convert /api/me to async (fetch fresh data from DB)
- Query: questionsUsed from questions table
- Query: subscription_tier from users table
- Return fresh, accurate user state (not stale JWT)

**Success**: QA verifies /api/me returns accurate quota + tier

---

### 3. CAL-1386: Mobile Responsive + Dark Mode
**What**: Fix 100dvh keyboard issue + implement dark mode  
**Why**: Mobile QA cannot pass without these fixes  
**Owner**: Calculator Engineer Alpha (CTO)  
**Effort**: 2-2.5h  
**Deadline**: 2026-04-25 15:00 GMT+7  
**Start time**: PARALLEL with CAL-1292

**Deliverables**:
- CSS: Change `height: 100vh` → `height: 100dvh` (fixes iOS keyboard overlap)
- Dark mode: Add `@media (prefers-color-scheme: dark)` styles (full WCAG AAA compliance)
- Touch targets: All interactive elements ≥44px (logout, tier badge, buttons)
- Safe area insets: Add `env(safe-area-inset-*)` for notches

**Success**: Mobile QA passes on 375px device (iPhone 12 mini) + dark mode WCAG AAA

---

## THE PARALLEL QA WORKSTREAMS

### QA Stream 1: Empty State Validation (CAL-1370)
**Owner**: Release QA Engineer Alpha  
**Status**: NO CTO DEPENDENCY — START IMMEDIATELY  
**Effort**: 4-6h  
**Deadline**: 2026-04-25 09:00 GMT+7  

**Scope**:
- UI layout (mobile + desktop)
- Dark mode existing state
- Interaction (buttons, text input)
- Accessibility (keyboard nav, screen reader)
- Animation (fade-in, transitions)

---

### QA Stream 2: Security Test (CAL-1388)
**Owner**: Release QA Engineer Alpha  
**Dependency**: CAL-1292 + CAL-1383 must be deployed first  
**Effort**: 2-3h  
**Timeline**: 2026-04-25 15:00-18:00 GMT+7  

**Scope**:
- Tier bypass attacks (6 test cases)
- Cross-user access attempts
- Quota enforcement validation
- Pass/fail criteria: Zero tier bypass vulnerabilities

---

### QA Stream 3: Stripe Integration (CAL-1299)
**Owner**: Release QA Engineer Alpha  
**Dependency**: CAL-1292 must be deployed first  
**Effort**: 6-8h  
**Timeline**: 2026-04-25 18:00-02:00 GMT+7 (overnight)  

**Scope**:
- Checkout session creation
- Test card validation
- Subscription lifecycle (payment, failure, retry)
- Tier upgrade/downgrade flow
- Pass/fail: All payment flows end-to-end

---

### QA Stream 4: Thai Localization (CAL-1431)
**Owner**: Release QA Engineer Alpha  
**Dependency**: CAL-1292 must be deployed first  
**Effort**: 2h  
**Timeline**: 2026-04-26 06:00-08:00 GMT+7  

**Scope**:
- AI answer quality (Thai language, financial accuracy)
- Answer categories (calculations, tax, investment, comparison)
- Source citations (government sources, accuracy)
- Pass/fail: 80%+ answers excellent/good quality (CAL-1341 baseline)

---

## THE SEO/GEO STRATEGY (Recurring Task)

### SEO/GEO Specialist: Keyword Research + Ranking Strategy
**Owner**: SEO/GEO Specialist Alpha  
**Cycle**: Every 3 days (recurring routine)  
**Timeline**: 2026-04-25 to 2026-05-15 (post-launch monitoring)

**First Cycle (NOW - 2026-04-24 to 2026-04-25)**:
1. **Research** (2026-04-24 23:00 - 2026-04-25 09:00 GMT+7):
   - Identify top Thai keywords for AI financial advisor
   - Keywords: (ปรึกษาการเงิน AI, ถาม AI เรื่องเงิน, etc.)
   - Study ranking #1 sites for these keywords
   - Analyze SERPs for content gaps, backlink profiles, technical SEO

2. **Strategy** (2026-04-25 09:00-12:00 GMT+7):
   - Create 90-day ranking plan
   - Identify quick wins (on-page SEO, metadata, internal linking)
   - Identify long-term plays (content expansion, backlinks, brand)
   - Prioritize tactics by impact/effort

3. **Implementation** (2026-04-25 12:00+ GMT+7):
   - Apply immediate on-page SEO fixes (metadata, headers, internal links)
   - Create content calendar for next 30 days
   - Deploy internal linking strategy (CAL-1567 calculator mapping)
   - Monitor SERP changes daily

**Recurring Cycles** (Every 3 days):
- Check ranking progress on target keywords
- Study new ranking signals / algorithm updates
- Adjust on-page SEO + internal linking strategy
- Add new content as needed
- Report progress to Board Chair

**Success Metric**: Target keyword in top 3 within 30 days, #1 within 90 days

---

## GOVERNANCE & ACCOUNTABILITY

### Board Chair Authority Structure
- **Board Chair**: CEO (24-hour emergency mandate)
- **Authority**: Override CTO decisions, reassign work, escalate
- **Decision Rights**: Timeline changes, scope changes, resource allocation
- **Escalation Path**: Board Chair → Board (if major changes needed)

### Work Assignment Mechanism
**All work is formally assigned via Paperclip** (not just comments):
1. Task created with owner, deadline, success criteria
2. Owner must acknowledge within 15 min
3. Work tracked on CAL-38 master issue daily
4. Non-compliance escalates to Board Chair immediately

### Escalation Protocol
**If task owner doesn't respond within deadline**:
1. First escalation: Board Chair issues formal ultimatum (15 min window)
2. Second escalation: Reassign to backup owner / break into subtasks
3. Third escalation: Escalate to board for contingency decision

### Daily Standup (2026-04-25 onwards)
- **Time**: 12:00 GMT+7 (noon Thailand time)
- **Format**: 30-min all-hands update
- **Attendees**: CTO, QA lead, SEO/GEO lead, Board Chair
- **Topics**: Progress, blockers, timeline adjustments, escalations

---

## SUCCESS CRITERIA (Go/No-Go Decision 2026-04-27 19:00 GMT+7)

### MUST HAVE (Launch blocks if any fail):
- ✅ CAL-1292 deployed + verified (tier enforcement working)
- ✅ CAL-1383 deployed + verified (fresh /api/me data)
- ✅ CAL-1386 deployed + verified (mobile responsive + dark mode)
- ✅ CAL-1388 security test PASS (zero tier bypass)
- ✅ CAL-1299 Stripe QA PASS (payment flow end-to-end)
- ✅ CAL-1431 Thai localization PASS (80%+ answer quality)
- ✅ CAL-1370 empty state QA PASS (UI/interaction/a11y)
- ✅ Zero critical bugs in final smoke test

### NICE TO HAVE (Don't block launch if incomplete):
- SEO ranking progress (targeting #1, but willing to launch at #5-10)
- Content expansion (base set complete, can expand post-launch)
- Advanced analytics (basic tracking working, advanced dashboard can wait)

---

## RESOURCE ALLOCATION

| Role | Agent | Current Status | Availability |
|------|-------|-----------------|--------------|
| CTO | Calculator Engineer Alpha | Active (Apple login done) | Full-time CAL-1292/1383/1386 |
| QA | Release QA Engineer Alpha | Active | Full-time all QA streams |
| Content | Thai Content Specialist Alpha | Backlog | Available if needed post-launch |
| SEO/GEO | SEO/GEO Specialist Alpha | TBD (awaiting activation) | Full-time keyword research + ranking |
| DevOps | DevOps Engineer | Standby | Ready for launch deploy |
| Board Chair | CEO | Active | Final go/no-go decision maker |

---

## CONTINGENCIES (If blockers emerge)

**If CTO cannot deliver CAL-1292 by deadline**:
1. Defer tier enforcement to post-launch hotfix (high risk, revenue impact)
2. Launch with free-only tier (reduced functionality)
3. Reschedule launch to 2026-04-28 (ask board)

**If QA cannot complete security test by deadline**:
1. Launch with manual security verification (not automated)
2. Add post-launch security audit
3. Requires board approval

**If SEO ranking #1 goal is unrealistic by launch**:
1. Launch targeting #5-10 position
2. Execute ranking plan post-launch (90-day goal instead of launch day)
3. Monitor SERP changes daily

---

## FINAL WORD FROM BOARD CHAIR

This plan is **DETAILED, TIME-BOUND, AND NON-NEGOTIABLE**. Every team member knows:
- What they're building (AI advisor for Thailand)
- Why (revenue, market position, user retention)
- When (deadlines in GMT+7)
- How (specific deliverables, success criteria)
- Who's responsible (owner assigned for each stream)

**ACTIVATION IS NOW**. All agents must acknowledge this plan within 15 minutes and confirm they understand their role and deadline.

No excuses. No delays. Execute.

---

**Board Chair**: CEO  
**Authority**: 24-hour emergency mandate (2026-04-24 22:58 – 2026-04-25 22:58 GMT+7)  
**Escalation**: Any non-compliance escalates immediately to board.  
**Next review**: 2026-04-25 12:00 GMT+7 (daily standup)
