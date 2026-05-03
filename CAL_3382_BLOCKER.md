# CAL-3382 UX Designer Sprint Heartbeat — BUILD ENVIRONMENT BLOCKER

**Status**: 🔴 **BLOCKED** — Build Environment File System Issue  
**Date**: 2026-05-02 22:36 ICT+7  
**Assigned**: UXDesigner (CAL-3382)  
**Escalation**: CTO — Environmental Issue  

---

## Issue Summary

Build environment has critical file system locks preventing npm operations. This is **NOT a code regression** — the last successful build (CAL-3364) was clean. This is an **environment/infrastructure blocker**.

---

## Error Sequence

### Error 1: npm install failures (TAR_ENTRY_ERROR)
```
npm warn tar TAR_ENTRY_ERROR UNKNOWN: unknown error, open 
  'C:\Users\...\node_modules\mdast-util-gfm-strikethrough\package.json'
npm warn tar TAR_ENTRY_ERROR UNKNOWN: unknown error, open 
  'C:\Users\...\node_modules\@img\sharp-win32-x64\lib\libvips-cpp.dll'
```
**Root cause**: npm cannot write/extract certain files to node_modules (antivirus? file locks? permissions?)

### Error 2: @shikijs/core incomplete package
```
ls -la node_modules/@shikijs/core/dist/
  index.d.ts (TypeScript only)
  textmate.d.mts
  types.d.mts
  ✗ No .js / .mjs implementations
```
**Impact**: Astro build fails because it needs actual JS implementations, not just types.

### Error 3: npm cache clean fails
```
npm cache clean --force
error: ENOTEMPTY: directory not empty, rmdir 
  'C:\Users\...\AppData\Local\npm-cache\_cacache\tmp'
```
**Impact**: Cannot recover by clearing cache (directory is locked).

### Error 4: Build fails on Astro config load
```
Cannot find module 'astro/config' imported from 
  'C:.../calculator-thailand/astro.config.mjs'
```
Because node_modules is in a partially-installed state.

---

## What This Means for UX Verification

**UX cannot proceed** with Phase 1 heartbeat verification because:
1. Cannot build the project (build fails on dependencies)
2. Cannot verify mobile UX responsiveness (no built HTML to test)
3. Cannot verify trust signal rendering (no built pages)
4. Cannot spot-check calculator pages (no dist/ HTML output)

---

## Last Known Good State

**CAL-3364 Heartbeat** (2026-05-02 19:40 ICT+7):
- Build: 947 pages in 43.24s ✓
- Sitemap: 943 URLs, clean ✓
- Trust signals: 100% verified ✓
- Mobile-first: responsive ✓
- Ad safety: 775 GuardedAdSlots ✓
- Phase 1 SUSTAINED ✓
- **Release-ready**

**Commit**: 7a05f876 (CAL-2124: Fix Build Cache Issue)

---

## Recommendation

**CTO Action Required**:
1. Investigate Windows file system locks on local dev environment
2. Check antivirus/Windows Defender exclusions for node_modules
3. Verify npm operations aren't being intercepted
4. Consider using a clean worktree or restarting npm daemon
5. If local environment cannot be fixed, use Railway CI/CD environment for verification

**Timeline**: UX can resume Phase 1 heartbeat once build environment is restored.

---

## Next UX Action

Once CTO restores build environment:
1. Fresh build verification
2. Mobile-first spot-check (5 calculator pages + homepage)
3. Trust signal verification (OG tags, schema, viewport)
4. Ad placement safety check
5. Accessibility baseline (color contrast, focus states)
6. Phase 1 gate confirmation

**Estimated verification time**: 20-30 minutes once build is clean.
