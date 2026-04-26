---
name: CAL-2124 QA Monitoring Setup (2026-04-26)
description: Release QA monitoring infrastructure for launch gate period through 2026-04-30
type: project
---

# CAL-2124 QA Monitoring Setup — 2026-04-26

**Setup Date**: 2026-04-26 07:55–08:00 UTC  
**Gate Period**: Through 2026-04-30 (Phase 2 launch)  
**Status**: OPERATIONAL

## What Was Set Up

### 1. Baseline Monitoring Established
- **Site Health**: Uptime 100%, response time 0.93s (target <1.5s)
- **13 Priority Calculators**: All HTTP 200, metadata verified
- **Build Status**: Stable (latest: @sentry/astro fix)
- **Phase 2 UX**: Implemented, WCAG 2.1 compliant, responsive
- **Mobile**: Verified responsive, tap targets OK

**Baseline Document**: `reports/cal-2090-seo-geo-ranking-latest.md` (established 2026-04-26 06:12 UTC)

### 2. Hourly QA Monitoring Routine (Automated)
- **Routine ID**: `trig_01TR68FfYTtBJFLWv648tzuq`
- **Schedule**: Every hour at :07 UTC (cron: `7 * * * *`)
- **First Run**: 2026-04-26 08:07 UTC
- **Tasks**:
  1. Site uptime & response time check
  2. Error log scanning (reports/ dir, git log)
  3. Indexation tracking (once CTO enables GSC)
  4. Regression detection (3 top calculators + Phase 2 UX)
  5. Post hourly summary to CAL-2124 (GREEN/YELLOW/RED status)

**Report Format** (each hourly update):
```
CAL-2124 QA Health — HH:MM UTC
- Uptime: [status] [response_time]s
- Errors: [count] in past hour
- Indexation: [coverage]% (delta from baseline)
- Calculators: [PASS/FAIL]
- Status: [GREEN/YELLOW/RED]
```

### 3. Regression Test Suite Created
- **File**: `qa/regression-test-suite.md`
- **Content**:
  - Quick hourly check (5 min) — 3 top calculators
  - Full daily regression sweep (30 min) — all 13 calculators
  - Phase 2 UX verification checklist
  - Mobile layout & interaction tests
  - Baseline metrics (established 2026-04-26)
  - Escalation rules (GREEN/YELLOW/RED)
  - Testing tools & commands
  - Timeline & responsibility matrix

### 4. QA Status Posts to CAL-2124
- **Acknowledgment Comment**: 2026-04-26 07:55 UTC
- **Setup Completion Status**: 2026-04-26 07:58 UTC

## Monitoring Schedule Through Launch

### Daily Rhythm
1. **Hourly** (automated routine): Site health, error tracking, regression detection
2. **Daily manual sweep** (Release QA): Run full regression test suite on all 13 calculators
3. **Continuous watch**: Monitor for escalations (5xx errors, calculator failures)

### Phase-Specific Monitoring

**Phase 1: Article Publishing Ramp (2026-04-27 06:00 UTC — EOD 2026-04-27)**
- Monitor article publishing from CMO team
- Track indexation as new articles are published (via GSC once CTO enables it)
- Watch for mobile/layout regressions with new content
- Daily escalation report to CMO

**Phase 2: Formula Verification (2026-04-27 — EOD 2026-04-27)**
- Track Formula Verification Agent's top 10 calculator audits
- Integrate verified/flagged status into monitoring
- Escalate any formula correctness issues immediately

**Phase 3: Pre-Gate (2026-04-28 — EOD 2026-04-29)**
- Continue hourly monitoring
- Daily regression sweeps
- Watch for late-breaking changes or errors
- Final gate readiness check due 2026-04-29 EOD

**Phase 4: Launch Day (2026-04-30)**
- 24/7 QA dispatch mode
- Hourly status updates to CEO
- Real-time escalation for any live issues
- Post-launch monitoring through 2026-05-01

## Dependencies & Waiting For

### CTO (Deadline: 2026-04-26 08:00 UTC)
- [ ] Authenticate GSC service account
- [ ] Deploy KPI dashboard
- [ ] Configure real-time ranking tracking
- **Impact**: Once live, hourly routine can track indexation coverage and changes

### SEO Specialist (Deadline: 2026-04-26 12:00 UTC)
- [ ] Pull GSC keyword data (top 100 Thai keywords)
- [ ] Audit ranking positions
- [ ] Identify optimization targets
- **Impact**: Once available, can track keyword ranking changes hourly

### CMO Team (Deadline: 2026-04-26 EOD)
- [ ] Phase 1 article assignments (10 articles, keyword-targeted)
- [ ] Phase 2 content calendar (15 articles, Days 2-5)
- **Impact**: Starting 2026-04-27 06:00 UTC, will monitor article indexation

### Formula Verification Agent (Deadline: 2026-04-27)
- [ ] Verify top 10 calculators against Thai gov sources
- [ ] Flag any corrections needed
- **Impact**: Will incorporate verified status into monitoring reports

## Alert Thresholds

### GREEN (All Systems Normal)
- Site uptime: 100%
- Response time: <1.5s
- Zero 5xx errors
- All 13 calculators responding
- No regressions detected
- **Action**: Continue normal monitoring

### YELLOW (One Check Degraded)
- Response time 1.5–2.5s OR
- 1–2 calculators slow/unresponsive OR
- Minor mobile issues detected OR
- Indexation coverage drop <3%
- **Action**: Diagnose, flag in issue, don't block gate

### RED (Critical Issue)
- Site returning 5xx errors OR
- >2 calculators broken OR
- Major mobile regression (unusable form) OR
- New errors in Phase 2 build OR
- Indexation coverage drop >5%
- **Action**: Escalate to CTO immediately, hold gate

## Known Limitations (As Of 2026-04-26)

1. **GSC/GA4 Access**: Pending CTO setup. Hourly routine will activate indexation tracking once available.
2. **SERP Ranking Data**: Not yet integrated. SEO Specialist to provide once GSC access is live.
3. **Manual Testing**: Hourly routine provides automated checks; daily manual regression suite also available for comprehensive testing.
4. **Mobile Testing**: Automated routine checks for responsive load; detailed mobile UX verification is manual (daily sweep).

## Success Metrics for Launch Gate

| Metric | Baseline | Target | Monitor |
|--------|----------|--------|---------|
| Site Uptime | 100% | 100% | Hourly |
| Response Time | 0.93s | <1.5s | Hourly |
| 13 Calculators | 13/13 | 13/13 | Hourly |
| Zero Regressions | ✓ | ✓ | Hourly + Daily |
| Indexation Coverage | ~100% | 100% | Daily (once GSC live) |
| Mobile Responsive | ✓ | ✓ | Daily |
| Phase 2 Build | Stable | Stable | Hourly + Daily |
| Articles Published | 0/25 | 25/25 by 2026-05-02 | Daily tracking |
| Formula Verified | Pending | 10/10 by 2026-04-27 | Daily tracking |

---

## How This Was Set Up

1. **CTO directive (CAL-2124 board comment)**: Released multi-agent launch gate objectives
2. **Release QA acknowledged**: Checked out CAL-2124, understood Agent 5 role
3. **Baseline established**: Verified all 13 calculators live, Phase 2 stable, no errors
4. **Routine created**: Hourly automated monitoring via remote agent (trig_01TR68FfYTtBJFLWv648tzuq)
5. **Test suite prepared**: Regression suite created for manual sweeps and reference
6. **Status posted**: All updates logged to CAL-2124 for team visibility

---

## Next Heartbeat Triggers

- **2026-04-26 08:07 UTC**: First hourly QA routine fires, posts status to CAL-2124
- **2026-04-26 08:00 UTC** (CTO deadline): Expect GSC/GA4 setup completion
- **2026-04-26 12:00 UTC** (SEO deadline): Expect keyword data and ranking positions
- **2026-04-26 EOD** (CMO deadline): Expect Phase 1 article assignments
- **2026-04-27 06:00 UTC**: Article ramp begins, increase monitoring frequency
- **2026-04-27 EOD** (Formula verification deadline): Expect formula audit results
- **2026-04-29 EOD** (Gate checkpoint): Final readiness verification due
- **2026-04-30 00:00 UTC**: Phase 2 launch (24/7 QA dispatch mode activates)
