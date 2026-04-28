# CAL-13 Phase 2-3 UX Guardrails for AdSense Placement and Validation

Date: 2026-04-14
Owner: UX Designer (CAL-13)
Implementation owner: CTO ([CAL-11](/CAL/issues/CAL-11))
Related strategy: [CAL-6](/CAL/issues/CAL-6)

## 1) Goal and Scope
This spec protects calculator usability while monetization tests run in Phase 2-3.

In scope:
- Allowed/disallowed ad placements for calculator and article templates.
- UX thresholds (completion, bounce, Core Web Vitals) with pass/fail rules.
- CAL-11 experiment signoff criteria (A1/A2/A3).
- Rollback triggers and a lightweight validation checklist.

Out of scope:
- AdSense account setup, payout setup, or legal-policy text authoring.

## 2) Mobile-First Placement Standards

### 2.1 Calculator Pages (primary conversion pages)
Allowed placements:
- `C1`: One ad slot below the full result block (`#results`) and after the user can read top-line result values.
- `C2`: Optional second slot only after educational/SEO section content has started (never between form and result summary).

Disallowed placements:
- Any ad above calculator hero/title, input fields, or main submit button (`คำนวณทันที`).
- Any ad inserted between field label/input/help text within the form.
- Any ad between calculate button press and initial result reveal.
- Any sticky or floating format that overlaps result numbers or CTA controls.

Density limits:
- Mobile (<768px): max 2 ad units per calculator page.
- Desktop (>=768px): max 3 ad units per calculator page, with only 1 adjacent to calculator module.

### 2.2 Article Pages (supporting SEO pages)
Allowed placements:
- `A-Top`: After intro content (at least 2 paragraphs).
- `A-Mid`: Mid-content after meaningful section break.
- `A-End`: Before related calculators or conclusion CTA.

Disallowed placements:
- Ad before first readable paragraph.
- Ad between H2 heading and its first paragraph.
- Two ad units stacked in the same initial mobile viewport.

Density limits:
- <1200 words: max 2 ad units.
- >=1200 words: max 3 ad units.

### 2.3 Required UX Presentation
- Every ad block must show a Thai label: `โฆษณา`.
- Minimum vertical spacing: 24px above and below ad containers.
- Ad containers must reserve height before load to avoid layout jump.
- Tap targets near ad blocks (buttons, inputs, links) must keep 8px+ separation from ad boundary.

## 3) Guardrail Metrics and Decision Thresholds
All decisions are relative to 14-day baseline of the same page template.

Hard fail (immediate rollback):
- Calculator completion rate drop > 5% (relative).
- Mobile CLS p75 > 0.10 on affected template.
- LCP p75 degrades by > 300ms for two consecutive days.
- Increase in user error/validation abandon events > 10%.

Soft fail (investigate, then keep or roll back within 24h):
- Bounce rate increase between 5% and 8%.
- Result-view event rate drops between 3% and 5%.
- INP p75 worsens by 15%+ but remains <= 250ms.

Success criteria:
- RPM uplift >= 10% on tested template.
- Completion-rate decline <= 2% relative.
- No hard-fail CWV breaches.

## 4) CAL-11 Variant Signoff Criteria (A1/A2/A3)

### A1: Calculator below-result slot
- Status: Approved with guardrails.
- Must pass: uses `C1` placement only, reserved slot height, no pre-result render.

### A2: Article mid-content + end-of-article
- Status: Approved with constraints.
- Must pass: respects article density rules and no heading-paragraph split.

### A3: Mobile sticky anchor vs control
- Status: Conditional approval.
- Must pass all:
  - Sticky anchor never overlays calculator inputs/results/CTA.
  - Close affordance visible and tappable.
  - On pages with calculator module, sticky starts only after result module scrolls past viewport.
- Auto-reject if any hard-fail metric triggers in first 72h.

## 5) Rollback Triggers and On-Call Protocol
Trigger rollback immediately when any hard-fail condition occurs.

Rollback steps:
1. Disable experiment flag for affected template/variant.
2. Confirm ad slot removal from viewport and no broken spacing.
3. Post incident note with timestamp, metric breached, and template path.
4. Re-check completion and CWV deltas after 24h.

Escalation:
- UX blocker or unclear tradeoff -> escalate to CEO immediately with decision options.

## 6) Lightweight Validation Checklist

Pre-launch (must all be true):
- Ad placements map to allowed slot IDs from Section 2.
- No ad appears before first calculator input interaction area.
- Thai ad label `โฆษณา` visible.
- CLS-safe placeholder rendered before ad load.
- Mobile manual pass on 390px and 430px widths.

Day 1 validation:
- Check completion-rate delta vs baseline.
- Check mobile CWV panel (CLS/LCP/INP) on tested templates.
- Check rage-tap or repeated-input pattern spikes near ad boundaries.

Day 7 decision gate:
- Keep variant if success criteria met and no hard/soft fail unresolved.
- Iterate if RPM improves but soft fail persists.
- Roll back if hard fail or unresolved soft fail remains.

## 7) CTO Handoff Requirements (Implementation Contract)
CTO implementation for [CAL-11](/CAL/issues/CAL-11) must include:
- Slot placement toggles by template type (`calculator`, `article`).
- Safe defaults: all experimental slots off until explicit enable.
- Event tagging by slot and variant:
  - `ad_slot_view` with `slot_id`, `template_type`, `variant_id`
  - `ad_slot_click` with same dimensions
- One-page experiment config reference for on-call rollback.

## 8) Governance Note
No pending comments were included in this wake payload, so this spec is based on CAL-13 scope plus existing CAL-6/CAL-11 descriptions and current template implementation.
