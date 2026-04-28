# CAL-11 Ad Experiment Config and Rollback Reference

Date: 2026-04-14
Owner: CTO
Related: [CAL-11](/CAL/issues/CAL-11), [CAL-13](/CAL/issues/CAL-13), [CAL-6](/CAL/issues/CAL-6)

## 1) Slot IDs and Template Guardrails

Calculator template (`template_type=calculator`):
- `C1` (variant `a1`): below-result slot only, gated until result area is visible.
- `C2` (variant `a1`): optional post-education slot.
- `A3-Sticky` (variant `a3`): sticky anchor with safety checks (default off).

Article template (`template_type=article`):
- `A-Top` (variant `a2`): inserted after intro paragraph 2.
- `A-Mid` (variant `a2`): inserted after a section break (`H2` + first paragraph).
- `A-End` (variant `a2`): end-of-article slot before disclaimer/related calculators.

Disallowed-zone enforcement:
- No calculator slot before result visibility.
- No article slot before first readable paragraph.
- No article slot between `H2` and its first paragraph.

## 2) Safe Toggle Defaults (Default Off)

Global gate:
- `PUBLIC_AD_EXPERIMENTS_ENABLED=false` (default safe state)

Per-slot flags (all default false):
- `PUBLIC_AD_SLOT_CALCULATOR_C1_ENABLED`
- `PUBLIC_AD_SLOT_CALCULATOR_C2_ENABLED`
- `PUBLIC_AD_SLOT_CALCULATOR_A3_STICKY_ENABLED`
- `PUBLIC_AD_SLOT_ARTICLE_TOP_ENABLED`
- `PUBLIC_AD_SLOT_ARTICLE_MID_ENABLED`
- `PUBLIC_AD_SLOT_ARTICLE_END_ENABLED`

Hard stop:
- `PUBLIC_AD_EXPERIMENTS_FORCE_ROLLBACK=true` disables/removes all experiment slots immediately.

## 3) Event Tags (Required Dimensions)

Emitted events:
- `ad_slot_view`
- `ad_slot_click`

Each event sends:
- `slot_id`
- `template_type`
- `variant_id`

## 4) Hard-Fail Thresholds

Configured thresholds:
- Completion-rate relative drop > 5%.
- Mobile CLS p75 > 0.10.
- LCP p75 regression > 300ms.
- User error/validation abandon increase > 10%.

Reference source: `src/lib/ad-experiments.ts` (`HARD_FAIL_THRESHOLDS`).

## 5) Immediate Rollback Paths (On-Call)

Use one of the following:

1. Set `PUBLIC_AD_EXPERIMENTS_FORCE_ROLLBACK=true` and redeploy.
2. Trigger runtime rollback event:

```js
window.dispatchEvent(new CustomEvent('ct:ad-hard-fail', {
  detail: { reason: 'cls_p75_gt_010' }
}));
```

3. Manual browser kill switch (for emergency triage):

```js
window.__ctDisableAdExperiments('manual_on_call_rollback');
```

Expected outcome:
- All elements with `data-ad-experiment-slot` are removed.
- Disable state is persisted via `localStorage` key `ct:ad-experiments:rollback`.

## 6) Variant Status

- A1: approved with guardrails.
- A2: approved with constraints.
- A3: conditional only; must pass sticky safety checks and is default-off.
