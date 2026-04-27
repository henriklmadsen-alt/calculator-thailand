---
name: CAL-2367 Release QA Heartbeat — P0 Build Infrastructure Blocker
description: Build system corrupted with persistent EPERM errors; all builds failing
type: project
---

# ⛔ P0 BUILD BLOCKER — CAL-2367 Release QA Heartbeat (2026-04-27 14:02 UTC)

## Status
**BLOCKER SEVERITY: P0 — RELEASE CANNOT PROCEED**

Build infrastructure is corrupted. All build attempts fail.

## Error Sequence

### Error 1: dist Directory Cleanup Failure
```
EPERM, Permission denied: \\?\C:\Users\Henrik Madsen\...dist\_astro
  Location: astro/dist/core/fs/index.js:82:8
  at Object.rmdirSync (node:fs:1169:22)
```

**What happened**: First `npm run build` attempt failed to clean dist/_astro directory.

**Recovery attempt**: Manual `rm -rf dist` before retry.

---

### Error 2: Missing SSR Chunk Module (After dist cleanup)
```
Cannot find module 'C:\Users\Henrik Madsen\...dist\chunks\page-ssr_D6vKvP0X.mjs'
  imported from C:\Users\Henrik Madsen\...หมวดหมู่\_slug_.astro.mjs
```

**What happened**: After manual dist cleanup, build partially proceeded but failed during SSR rendering phase. Referenced chunk file does not exist (file corruption or interrupted build).

**Recovery attempt**: Full clean with `rm -rf dist .astro && npm ci`.

---

### Error 3: Node Modules Locked by Process
```
npm error syscall unlink
npm error path C:\Users\Henrik Madsen\...node_modules\@esbuild\win32-x64\esbuild.exe
npm error errno -4048
npm error code EPERM
[Error: EPERM: operation not permitted, unlink '...esbuild.exe']
```

**What happened**: `npm ci` cannot install dependencies because esbuild.exe in node_modules is locked (held by process or system).

**Root cause**: Either:
- A previous build/npm process did not terminate cleanly and still holds file handles
- Windows antivirus is blocking deletion
- System file permissions issue

---

## Release Impact

**Gate Checkpoint (2026-04-29 08:00 UTC)**: At risk  
**Launch (2026-04-30 00:00 UTC)**: At risk  
**Verification scope**: Cannot verify:
- Calculator behavior (no pages generated)
- Regressions (no build to test)
- Mobile quality (no live pages)
- Quality gates (no build output)

## Actions Required

**Severity: P0 — Escalate to CTO immediately**

**CTO must**:
1. Diagnose process holding esbuild.exe and terminate cleanly
2. Clear or reset node_modules in a clean environment
3. Verify system file permissions on build directory
4. Perform successful test build before QA can resume verification

**Timeline**: This must be resolved within 1 hour to maintain gate checkpoint schedule.

## QA Status
**Release QA verification HALTED** pending build infrastructure recovery.

---

**Reported**: 2026-04-27 14:02 UTC  
**Reporter**: Release QA Engineer Alpha  
**Status**: Escalated to CTO
