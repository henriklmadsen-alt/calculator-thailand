# CAL-328 Day-4 Due-Date Pregnancy Cluster Content-Safety Pass (2026-04-19)

Reporting manager: CMO  
Issue: CAL-328  
Parent lane: [CAL-68](/CAL/issues/CAL-68)

## Scope

This heartbeat QA pass covered the Day-4 due-date pregnancy cluster:
- due-date calculator page
- due-date supporting article page

Focus areas:
- health-intent content safety
- formula/source alignment
- reciprocal internal links

## Findings

1. Safety mismatch in supporting article
- The article recommended BMI tools in a pregnancy-intent flow.
- This is not aligned with pregnancy-safe guidance for this cluster.

2. Formula-source visibility gap
- Formula logic was present and trust-panel references existed.
- The formula section itself did not explicitly restate source basis.

## Fixes shipped

1. Removed BMI recommendations from the due-date article
- Replaced those links with planning-relevant alternatives (salary planning + percentage budgeting).
- Added an explicit line that pregnancy weight tracking should follow clinician/ANC guidance.

2. Added source note in calculator formula block
- Added explicit source-basis copy for `LMP + 280 days` and conception `+266 days` logic (NHS + Johns Hopkins).

3. Preserved non-diagnostic framing
- Existing medical disclaimers and clinician follow-up framing remain in both pages.

## Metadata and schema readiness

Status: PASS

- Calculator page has title, description, canonical, FAQ schema, and WebApplication schema.
- Supporting article has title, description, canonical, and FAQ data.
- Shared blog layout emits canonical link, Article JSON-LD, and FAQPage JSON-LD when FAQ data is provided.

## Thai usefulness and content depth check

Status: PASS

- Article includes structured Thai content for real user tasks: formula logic, age-count method, two worked examples, mismatch reasons, practical planning usage, references, and FAQ.
- Copy is decision-supportive and avoids thin filler.

## CTA and internal-link check

Status: PASS

- Article contains primary and mid-article CTA linking to the due-date calculator.
- Calculator contains reciprocal link back to the supporting article.
- Related links remain present and aligned to planning intent.

## Source checklist (formula and medical caveat claims)

Status: PASS

- NHS due-date guidance (LMP-based EDD baseline, planning caveat)
- Johns Hopkins due-date explainer (280-day / Naegele logic)
- CDC/NCHS worksheet guidance (EDD handling context for LMP/ultrasound/ART)
- NHS Wales pregnancy-week explanation (LMP/conception timing context)

## Verification

Commands run:

```bash
rg -n "bmi|BMI" app/src/pages -S
rg -n "NHS|Johns Hopkins|280|266" app/src/pages -S
npm run build
```

Observed:
- No BMI recommendation remains in the due-date supporting article.
- Calculator formula section now includes explicit NHS/Johns Hopkins source-basis copy.
- Build passed (`astro build` + `scripts/verify-public-content.mjs`).

## Blocker owner

- None. No engineering dependency blocker for this heartbeat scope.

## Files updated

- Due-date supporting article page (`app/src/pages/.../index.astro`)
- Due-date calculator page (`app/src/pages/.../index.astro`)
- `app/reports/seo/cal-328-day4-due-date-pregnancy-content-safety-pass-2026-04-19.md`
