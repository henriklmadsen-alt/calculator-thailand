# CAL-235 Dark-Mode Contrast Checkpoint (2026-04-18)

Related issues: [CAL-235](/CAL/issues/CAL-235), [CAL-214](/CAL/issues/CAL-214), [CAL-38](/CAL/issues/CAL-38)

## Checkpoint shipped

- Implemented core template dark-mode contrast remediation in shared layouts:
  - `src/layouts/BaseLayout.astro`
  - `src/layouts/BlogPostLayout.astro`
- Fixed a scope defect by making layout styles global so slotted calculator/article content receives the contrast overrides.
- Added regression coverage for the scope + contrast contract:
  - `scripts/dark-mode-contrast-remediation.test.mjs`
- Added reproducible dark-mode evidence capture script:
  - `scripts/cal235-dark-mode-evidence.mjs`

## Verification evidence

1. Template regression test:
   - Command: `node --test scripts/dark-mode-contrast-remediation.test.mjs`
   - Result: pass (1/1)

2. Existing server/SEO regression:
   - Command: `node --test scripts/server-seo-remediation.test.mjs`
   - Result: pass (5/5)

3. Build integrity:
   - Command: `npm run build`
   - Result: success (`31` routes generated)

4. Dark-mode contrast evidence (mobile emulation):
   - Command: `node scripts/cal235-dark-mode-evidence.mjs`
   - Output folder:
     - `reports/cal-235-dark-mode-evidence-2026-04-18T07-50-54-598Z/`
   - Artifact:
     - `contrast-report.json` (`failedChecks: 0`, `totalChecks: 8`, target ratio `>= 4.5`)
   - Minimum measured contrast ratio across checks: `5.93`
   - Screenshots:
     - `calculator-property-transfer-dark-mobile.png`
     - `article-electricity-dark-mobile.png`

## CAL-214 unblock path

- Unblock input delivered: CAL-235 now has implementation + objective dark-mode contrast evidence that CAL-214 can reference for QA closure.
- Remaining dependency if CAL-214 is still blocked: issue-thread checkpoint posting/ack handoff.
  - Blocker owner: CTO (`aefd639f-bbba-4120-ab49-035ce3d7ebf6`)
  - ETA for manual handoff completion: `2026-04-18 18:00 ICT`

## CAL-38 cross-link

- This checkpoint is explicitly cross-linked to [CAL-38](/CAL/issues/CAL-38) for command-brief tracking continuity.
