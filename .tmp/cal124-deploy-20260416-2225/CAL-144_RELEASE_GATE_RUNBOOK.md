# CAL-144 GitHub -> Railway Release Confirmation Gate

Date: 2026-04-15  
Owner: CTO

## 1) End-to-End Deployment Path Audit

- Source branch for release automation: `master`
- GitHub workflow gate: `.github/workflows/deploy.yml`
- Runtime host: `https://calculator-thailand-production.up.railway.app`
- Runtime edge evidence (`curl -I /`): `server: railway-edge`, `x-railway-edge` present.
- Runtime server file: `server.mjs` (serves static build + release metadata endpoint).

## 2) Release Confirmation Gate Design

The release gate is enforced by GitHub Actions and runtime verification:

1. Build job runs on every push to `master`.
2. Confirmation job polls production `GET /__release`.
3. Gate passes only when deployed commit SHA matches triggering GitHub SHA (full or prefix).
4. Gate fails on timeout with the latest payload/error details.

## 3) Commit Linkage + Runtime Health Verification

### Runtime release endpoint

- Path: `/__release`
- Returned JSON fields:
  - `gitCommit` (from `RAILWAY_GIT_COMMIT_SHA`, `SOURCE_COMMIT`, or `GITHUB_SHA`)
  - `deploymentId` (`RAILWAY_DEPLOYMENT_ID` when available)
  - `generatedAt` (server boot timestamp)

### Verification command

```bash
node scripts/verify-railway-release.mjs \
  --site-url https://calculator-thailand-production.up.railway.app \
  --expected-sha <commit-sha> \
  --timeout-ms 900000 \
  --interval-ms 15000
```

## 4) Proof Artifacts (Current Heartbeat)

Local validation (2026-04-15):

- `node --test scripts/verify-railway-release.test.mjs` -> PASS (5/5)
- `npm run build` -> PASS
- Local runtime check:
  - `node scripts/verify-railway-release.mjs --site-url http://127.0.0.1:3000 --expected-sha unknown --timeout-ms 15000 --interval-ms 1000` -> PASS

Live pre-deploy snapshot (before this branch is merged):

- `curl -I https://calculator-thailand-production.up.railway.app/` -> `200`, `server: railway-edge`
- `curl -i https://calculator-thailand-production.up.railway.app/__release` -> `404 Not Found`

This confirms production is still serving the previous build and the new gate endpoint is not yet deployed.

## 5) Operational Runbook (Per Release)

1. Merge approved release commit into `master`.
2. Wait for workflow `Railway Release Confirmation Gate` to start automatically.
3. Confirm job `Release Confirmation` passes.
4. Validate live endpoint manually:
   - `curl https://calculator-thailand-production.up.railway.app/__release`
   - Verify `gitCommit` matches release commit SHA.
5. Post issue evidence:
   - Workflow run URL
   - `/__release` response payload
   - Production URL confirmation

## 6) Go/No-Go Rules

- Go: build passes and release confirmation job matches SHA in production.
- No-Go: timeout, SHA mismatch, or `/__release` unavailable after rollout window.
- Escalation target on No-Go: CEO + platform owner with exact failing SHA and workflow URL.
