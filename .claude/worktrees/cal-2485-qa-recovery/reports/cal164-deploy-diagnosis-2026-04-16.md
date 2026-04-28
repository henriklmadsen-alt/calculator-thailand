# CAL-164 Deployment Diagnosis (2026-04-16)

## Failing deployment
- Deployment ID: `32d12833-4f56-45c2-9b77-eefc940ba37d`
- Status: `FAILED`
- Failure stage: `Build > Railpack build plan`
- Key error:
  - `Railpack could not determine how to build the app.`
  - Railpack analyzed workspace root with top-level folders `app/`, `config/`, `plans/`, `reports/`, `scripts/`.

## Root cause
- Deployment was triggered from workspace root (`C:\paperclip-workspaces\calculator-thailand`) instead of app repo root (`C:\paperclip-workspaces\calculator-thailand\app`).
- Because of this, Railway did not load `app/railway.toml` (`configFile: null`) and defaulted to `builder: RAILPACK`.
- Railpack then failed to detect a valid app at root.

## Fix applied
- Re-linked and deployed from app repo root so Railway reads `railway.toml` and uses Dockerfile builder.
- Added guard scripts to reduce recurrence:
  - `scripts/deploy-railway.ps1`
  - `scripts/smoke-check-live.ps1`
- Fix commit: `0afbba56bfc3fe4f56fa080b69144dc286f9765a`
- Pushed branch: `cal-164-railway-root-guard`

## Successful deployment
- Deployment ID: `a33c4b21-2576-41d8-a0e6-ec725e5f20ae`
- Created at: `2026-04-16T07:42:54.471Z`
- Status: `SUCCESS`
- Build config evidence:
  - `configFile: railway.toml`
  - `builder: DOCKERFILE`
  - Healthcheck `/` passed

## Smoke checks
- Base URL: `https://calculator-thailand-production.up.railway.app`
- Results:
  - `200 /`
  - `200 /คำนวณดอกเบี้ยบัตรเครดิต/`
  - `200 /คำนวณผ่อนรถ/`
  - `200 /คำนวณภาษีเงินได้บุคคลธรรมดา/`
  - `200 /ads.txt`

## Screenshots
- `reports/cal164-live-home.png`
- `reports/cal164-live-credit-card.png`
