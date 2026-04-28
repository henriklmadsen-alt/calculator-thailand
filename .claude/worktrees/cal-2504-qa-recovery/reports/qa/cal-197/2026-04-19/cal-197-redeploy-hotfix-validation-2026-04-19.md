# CAL-197 Redeploy Validation - Latest Fixed Source (2026-04-19 ICT)

Issue: [CAL-197](/CAL/issues/CAL-197)  
Trigger: CEO correction comments `03746497-10d8-4c1b-8d8f-cd64d803885c`, `0607f293-8dea-4016-aa73-3d1976e90a04`

## Deploy execution (latest fixed source)

Release source:
- Prepared from current fixed workspace into clean staging path:
  - `C:\paperclip-workspaces\calculator-thailand\release-src-cal197-hotfix`

Deploy command:

```powershell
railway deployment up "C:\paperclip-workspaces\calculator-thailand\release-src-cal197-hotfix" --path-as-root --ci --message "CAL-197 deploy latest fixed source after CEO correction"
```

Result:
- Railway deployment: SUCCESS
- Deployment ID: `f41e447b-553b-47c6-b906-345e6d97d217`
- Build logs:
  - `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=f41e447b-553b-47c6-b906-345e6d97d217`

## Post-deploy validation on custom domain

### 1) Smoke checks
- PASS
- `/`, representative calculator routes, `/บทความ/`, `/ads.txt` all returned 200
- Log: `reports/qa/cal-197/2026-04-19/deploy-post-checks-2/smoke-custom-domain.log`

### 2) Thai text + contrast hotfix visibility
- PASS
- Visual integrity summary: `checks=28`, `failed=0`, `failed-groups=0`
- Artifacts:
  - `reports/qa/cal-197/2026-04-19/deploy-post-checks-2/visual-integrity/release-visual-integrity-after.json`
  - `reports/qa/cal-197/2026-04-19/deploy-post-checks-2/visual-integrity/release-visual-integrity-after.md`

### 3) Calculator preservation/inventory checks
- Approved calculator route availability: PASS (`HTTP/UI 12/12`)
- Route regression delta vs pre-deploy baseline: `regressed=0`, `recovered=0`
- Route inventory gate verdict: FAIL (known canonical-vs-live diff remains)
  - approved=12, sitemap=12, homepage=17
  - missing in sitemap=2, unexpected in sitemap=2
  - missing on homepage=0, unexpected on homepage=5

Artifacts:
- `reports/qa/cal-197/2026-04-19/deploy-post-checks-2/route-integrity/release-route-integrity-after.json`
- `reports/qa/cal-197/2026-04-19/deploy-post-checks-2/route-integrity/release-route-integrity-after.md`
- `reports/qa/cal-197/2026-04-19/deploy-post-checks-2/route-integrity-compare/release-route-integrity-after.json`
- `reports/qa/cal-197/2026-04-19/deploy-post-checks-2/route-integrity-compare/release-route-integrity-after.md`

## Handoff state

Deploy from latest fixed source completed.  
[CAL-246](/CAL/issues/CAL-246) remains the post-deploy production visual/inventory QA gate.
