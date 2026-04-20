# CAL-197 Post-Deploy Validation (2026-04-19 ICT)

Issue: [CAL-197](/CAL/issues/CAL-197)  
Release trigger: [CAL-251](/CAL/issues/CAL-251) moved to `done`

## Deployment execution

Source enforcement:
- Clean source path: `C:\paperclip-workspaces\calculator-thailand\app-clean-master`
- Source SHA: `1ce9656210c1515918dc02b91120d4e9e8e1c73c`
- Parity check: `HEAD == origin/master == ls-remote master`

Deploy command:

```powershell
railway deployment up "C:\paperclip-workspaces\calculator-thailand\app-clean-master" --path-as-root --ci --message "CAL-197 deploy after CAL-251 closure (clean master source)"
```

Deployment result:
- Command exit: success
- Deployment ID: `b2a4b50a-4d55-451a-b14a-ce77b79f1d8f`
- Build logs URL:
  - `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=b2a4b50a-4d55-451a-b14a-ce77b79f1d8f`

## Post-deploy validation

### Custom domain smoke

Command:

```powershell
./scripts/smoke-check-live.ps1 -BaseUrl "https://www.kamnuanlek.com" -Paths @('/', '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/', '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%97%E0%B8%B5/', '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2/', '/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/', '/ads.txt')
```

Result: PASS (`200` for all checked routes)  
Log: `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/smoke-custom-domain.log`

### Approved calculator preservation (route integrity)

Command:

```powershell
node scripts/release-route-integrity.mjs --phase after --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-197/2026-04-19/deploy-post-checks-1/route-integrity --release-sha 1ce9656210c1515918dc02b91120d4e9e8e1c73c --deployment-id b2a4b50a-4d55-451a-b14a-ce77b79f1d8f --skip-screenshots
```

Result: FAIL
- Approved routes: 12
- Sitemap calculator routes: 7
- Homepage calculator links: 10
- Approved route route-checks: HTTP/UI `12/12` pass
- Missing in sitemap: 5
- Missing on homepage: 2

Artifacts:
- `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/route-integrity/release-route-integrity-after.json`
- `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/route-integrity/release-route-integrity-after.md`

### Thai text and contrast hotfix visibility (visual integrity)

Command:

```powershell
node scripts/release-visual-integrity.mjs --phase after --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity --release-sha 1ce9656210c1515918dc02b91120d4e9e8e1c73c --deployment-id b2a4b50a-4d55-451a-b14a-ce77b79f1d8f
```

Result: FAIL
- Checks: 28 total, 25 failed
- Failed surface-mode groups: 14
- Includes header/footer/homepage/trust/chips/calculator/article failures

Artifacts:
- `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/release-visual-integrity-after.json`
- `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/release-visual-integrity-after.md`

## Incident verdict

Deployment transport/build succeeded, but post-deploy production quality gates failed.

- Requirement "confirm Thai text/contrast hotfix is visible live": NOT MET.
- Requirement "confirm no previously approved calculators disappeared": NOT MET for sitemap/homepage inventory presence.

Immediate escalation required to CTO + CEO for release sequencing decision and corrective action.
