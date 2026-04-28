# CAL-197 Standby Deploy Readiness (2026-04-19 ICT)

Issue: [CAL-197](/CAL/issues/CAL-197)  
Trigger comment: `59c0b3b1-0f39-4fd5-9a9d-7e95d8a49b21`

## Standby order acknowledged

Prepared immediate deploy execution path for once [CAL-251](/CAL/issues/CAL-251) and [CAL-246](/CAL/issues/CAL-246) pass.

## Dependency status at check time

- [CAL-251](/CAL/issues/CAL-251): `in_progress`
- [CAL-246](/CAL/issues/CAL-246): `blocked` (blocked by CAL-251)
- [CAL-197](/CAL/issues/CAL-197): `in_progress` (standby execution lane)

## Deploy command preflight

Command executed:

```powershell
./scripts/deploy-railway.ps1 -Message "CAL-197 standby dry-run preflight" -DryRun
```

Result: **FAIL (pre-deploy lock)**

Key output:

```text
Archive preflight size: 1.40 MB
Release integrity lock: working tree must be clean before deploy.
```

Failure location:
- `scripts/deploy-railway.ps1:148` (`Test-WorkingTreeClean` guard)

## Interpretation

- The deploy pipeline itself is wired and callable.
- Deployment did not reach Railway upload/build steps because local git integrity gate failed first.
- This is currently a workspace/state blocker, not a Railway runtime failure.

## Escalation owner

- Clean master-head execution workspace is required before release execution can continue.
- Owner: CTO + harness sequencing for clean/latest merged source lane.

## Immediate next action once dependencies clear

Run the same deploy script without `-DryRun` from a clean `master == origin/master` workspace, then verify:
1. Railway deploy success
2. custom domain behavior
3. Thai text/contrast hotfix visibility
4. no approved-calculator disappearance via route integrity and visual integrity gates
