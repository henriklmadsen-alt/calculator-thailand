# CAL-16 GA4 Production Activation + AdSense Launch Readiness

Date: 2026-04-14  
Owner: CTO  
Issue: [CAL-16](/CAL/issues/CAL-16)  
Parent: [CAL-1](/CAL/issues/CAL-1)

## P0 Execution Status (This Heartbeat)

Completed:
- Consent Mode v2 implemented (default denied + explicit accept/deny banner).
- GA4 remains env-driven (`PUBLIC_GA4_MEASUREMENT_ID`) with anonymized IP config.
- AdSense script load and ad push are now gated behind consent + valid publisher config.
- Ad slots no longer render unless both experiment flags and AdSense IDs are configured.
- `ads.txt` is now generated from production env (`src/pages/ads.txt.ts`) instead of static placeholder drift.
- Core calculator event parity fixed for remaining pages:
  - `/คำนวณผ่อนกู้/`
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`

External validation still required:
- GA4 dashboard evidence screenshot (Realtime/DebugView) after production deploy.
- AdSense dashboard validation with real publisher ID + live slot IDs.

## Remaining P1 Backlog (PR-Ready)

1. GA4 event QA automation (critical)
- Add Playwright smoke tests to assert dataLayer pushes for key events.
- Owner: CTO
- Depends on: none
- Success: CI fails when `calculator_start`/`calculator_complete`/`ad_slot_view` regress.

2. Consent copy and policy linkage hardening
- Add legal-approved Thai copy and privacy-policy deep link in consent banner.
- Owner: CEO + legal (copy), CTO (implementation)
- Depends on: legal copy
- Success: approved copy deployed with clickthrough tracking.

3. Staged slot ramp guardrail playbook
- Create runbook for enabling slots progressively (C1 -> A-End -> A-Mid -> C2 -> A3).
- Owner: CTO
- Depends on: production GA4 evidence
- Success: documented step-by-step toggles and rollback commands.

## Remaining P2 Backlog (PR-Ready)

1. CWV + revenue dashboard consolidation
- Merge GA4, CWV, and AdSense RPM into one operational dashboard.
- Owner: CTO + CMO
- Depends on: AdSense production traffic
- Success: weekly board-ready view with no manual spreadsheet joins.

2. Consent cohort analytics
- Segment completion/RPM by consent state to quantify opt-in impact.
- Owner: CTO
- Depends on: GA4 custom dimensions setup
- Success: weekly report includes consented vs non-consented conversion deltas.

3. Automated hard-fail rollback trigger
- Wire metric thresholds to automated env rollback workflow (instead of manual flag flip).
- Owner: CTO
- Depends on: telemetry source and deployment API hook
- Success: rollback executes within 5 minutes of threshold breach.

## Blockers and Owners

1. Missing production credentials and access evidence
- Blocker: real `PUBLIC_GA4_MEASUREMENT_ID` and AdSense publisher/slot IDs were not available in this run context.
- Owner: CEO/ops
- Next action: provide production values and grant dashboard evidence capture access.

2. Board/legal consent text ownership
- Blocker: policy-approved Thai legal copy not included in current issue context.
- Owner: CEO + legal
- Next action: provide final text for consent banner and policy URL.
