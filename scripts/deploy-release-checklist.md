# Release Integrity Deploy Checklist

Use this checklist for every production deploy.

## 1) Workspace integrity
- [ ] Working tree is clean (`git status --porcelain` returns empty).
- [ ] Current branch is `master`.
- [ ] `git fetch origin master --prune` completed.
- [ ] `git merge --ff-only origin/master` completed.
- [ ] SHA parity confirmed: `HEAD == origin/master == git ls-remote origin refs/heads/master`.

## 2) Railway target integrity
- [ ] `railway status` matches expected target:
- [ ] Project: `appealing-possibility`
- [ ] Environment: `production`
- [ ] Service: `calculator-thailand`

## 3) Regression prevention
- [ ] Latest successful production deploy SHA is detected.
- [ ] Target SHA contains latest successful production SHA (ancestor check passes).
- [ ] Pre-deploy commit summary reviewed.
- [ ] Pre-deploy changed-files summary reviewed.

## 4) Deploy
- [ ] Deploy via `scripts/deploy-railway.ps1` only.
- [ ] Do not deploy from stale/dirty workspace.

## 5) Post-deploy smoke
- [ ] Smoke checks return `200` on required routes.
- [ ] Recently changed calculator routes are included in smoke set.
- [ ] Post-deploy approved calculator verification passes (`scripts/release-route-integrity.mjs`).
- [ ] Each approved calculator route has HTTP `200`, visible UI checks, and screenshot evidence.
- [ ] Route integrity checks run against the live production domain (`https://www.kamnuanlek.com`) unless explicitly overridden.
- [ ] Live sitemap calculator routes exactly match canonical approved inventory.
- [ ] Homepage calculator links exactly match canonical approved inventory.
- [ ] Post-deploy visual integrity verification passes (`scripts/release-visual-integrity.mjs`).
- [ ] Visual checks include header, footer, homepage hero, trust section, calculator chips, one calculator page, and one article page in both light and dark modes.
- [ ] Thai text rendering checks pass (no mojibake / garbled Thai on checked surfaces).
- [ ] Contrast checks pass on checked surfaces for readability (WCAG ratio scan).
- [ ] No layout overflow regressions on checked surfaces (desktop + mobile spot checks).

## 6) Evidence in issue comment
- [ ] Source SHA
- [ ] GitHub SHA
- [ ] Deployed SHA
- [ ] Railway deployment ID
- [ ] Route checklist before report path (json + md)
- [ ] Route checklist after report path (json + md)
- [ ] Approved calculators vs live routes diff summary
- [ ] Approved calculators vs homepage links diff summary
- [ ] Before/after regression delta summary
- [ ] Visual checklist before report path (json + md)
- [ ] Visual checklist after report path (json + md)
- [ ] Visual surface/mode pass-fail summary and failed-group count
- [ ] Before/after visual regression delta summary
- [ ] Pre-deploy changed-files summary
- [ ] Smoke results

## 7) AdSense preflight (custom domain)
- [ ] `ads.txt` returns `200` on custom domain and contains expected publisher line.
- [ ] AdSense client token exists in rendered HTML on representative calculator routes.
- [ ] Representative calculator routes contain expected ad script/slot behavior.
- [ ] `robots.txt` is crawl-safe and sitemap host points to custom domain.
- [ ] Canonical URLs on representative routes point to custom domain.
- [ ] Evidence stored under `reports/qa/cal-197/<date>/adsense-preflight/`.
