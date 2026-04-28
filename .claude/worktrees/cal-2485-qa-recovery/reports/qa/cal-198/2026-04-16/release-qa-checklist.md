# CAL-198 Release QA Checklist (Calculator Deploys)

Use this checklist for every new or updated calculator route before and after deploy.

Regression gate owner: `CTO`

## 1) Pre-Deploy (Code + Build)

- [ ] Route exists in `src/pages` and maps to expected canonical slug.
- [ ] Calculator submit flow renders baseline results in local preview.
- [ ] Validation errors are user-readable in Thai.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] No browser console errors on calculator route in local preview.
- [ ] Article/internal links that reference the route resolve correctly.

## 2) Deploy Verification (Live)

- [ ] Live route returns HTTP 200 on production domain.
- [ ] Route appears in production sitemap output (`sitemap-0.xml`).
- [ ] Desktop render check: no horizontal overflow.
- [ ] Mobile render check (390x844): no horizontal overflow.
- [ ] Functional smoke check on live route with representative inputs.
- [ ] Result section renders non-placeholder values (`-`, `NaN`, `undefined` are disallowed).
- [ ] No module-load/runtime console errors on live route.

## 3) Sign-Off Artifacts

- [ ] Save screenshots (desktop + mobile) to `reports/qa/<issue>/<date>/screenshots/`.
- [ ] Save machine-readable QA output (`.json`) with route-by-route verdicts.
- [ ] Save human-readable matrix (`.md`) with pass/fail + repro details.
- [ ] Record pass/fail evidence in the issue comment for each deploy.
- [ ] If any fail item exists, create one fix issue per fail item and link it in the QA gate ticket.

## 4) Post-Deploy Regression Gate (Mandatory)

- [ ] Validate the maintained top-calculator baseline list in `reports/qa/cal-198/recently-shipped-features.md`.
- [ ] Run `node scripts/cal198-live-qa.mjs` after deploy and check `releaseGateVerdict`.
- [ ] If any top-calculator route fails baseline behavior, treat the release as failed.
- [ ] Escalate immediately in the issue comment with failing routes, evidence paths, and linked fix lane(s).
- [ ] Do not mark release QA as passed until all top-calculator regressions are green.

## 5) Exit Criteria

- [ ] All targeted routes pass availability + functional + mobile/desktop checks.
- [ ] Top-calculator regression gate is `PASS`.
- [ ] QA gate issue updated with evidence links, verdict, and owner sign-off.
