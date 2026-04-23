# CAL-145 Mandatory Visual Post-Deploy QA (Desktop + Mobile)

Date: 2026-04-15  
Owner: CTO

## Objective

Block release confirmation unless post-deploy screenshots are captured for both desktop and mobile viewports.

## Enforcement Point

- Workflow: `.github/workflows/deploy.yml`
- Step order:
1. `Verify Railway production commit`
2. `Capture post-deploy visual QA (desktop + mobile)` (hard gate)
3. `Upload post-deploy visual QA artifact`

## Capture Script

- Command:

```bash
npm run verify:visual-qa -- \
  --site-url https://calculator-thailand-production.up.railway.app \
  --paths "/,/calc-credit-card-interest/" \
  --output-dir .tmp/post-deploy-visual-qa
```

- Output:
1. `manifest.json` with pass/fail details per route and viewport
2. `*-desktop.png` screenshots
3. `*-mobile.png` screenshots

## Required Issue Evidence

1. Workflow run URL with successful visual QA step
2. Artifact name `post-deploy-visual-qa-<run_id>`
3. At least one desktop screenshot and one mobile screenshot from production
