# CAL-2697 UX Designer Sprint Heartbeat — Infrastructure Blocker

**Issue**: Build verification cannot proceed — Windows file locking prevents npm install

**Status**: 🔴 BLOCKED — Heartbeat cycle unable to complete

**Root Cause**: ENOTEMPTY errors on Windows when npm attempts to clean node_modules directories

```
npm error code ENOTEMPTY
npm error syscall rmdir
npm error path C:\Users\...\calculator-thailand\node_modules\shiki\dist
npm error errno -4051
npm error ENOTEMPTY: directory not empty, rmdir
```

Multiple attempts:
1. ❌ `npm install` → file permission errors
2. ❌ `npm ci` with clean package-lock → TAR extraction errors, no node_modules created
3. ❌ `npm install --verbose` → ENOTEMPTY on nested directories (shiki, astro, @sentry, @opentelemetry)

**Likely Causes**:
- Windows Defender or antivirus scanning node_modules
- File indexer (Windows Search) holding file locks
- Node.js file handles not released from prior npm process

**What's Blocked**:
- Fresh build verification for CAL-2697
- Trust signal verification (OG, Twitter, Schema, GA4, Mobile, Sentry)
- Core calculator presence check
- Gate readiness confirmation for 2026-04-30 launch

**Last Known Good State** (from CAL-2695 QA Heartbeat — 12:30 UTC):
- ✅ Master @ a1142d1 — Release QA Heartbeat clean
- ✅ 908 pages built, 29.49s, exit 0
- ✅ Trust signals 87-97%
- ✅ UX RELEASE CERTIFICATION: GREEN

**Recommended Resolution**:
1. Restart Node.js/npm processes
2. Check Windows Defender exclusions for node_modules path
3. Disable antivirus scanning on project directory temporarily
4. Consider using worktree isolation to avoid lock conflicts
5. Retry npm install after system cleanup

**Escalation**: This is an infrastructure/system-level issue, not a code issue. The codebase itself remains GREEN from CAL-2695 verification.

---

**Next Steps**:
- [ ] IT/DevOps to verify system file lock status
- [ ] Retry npm install after system cleanup
- [ ] Consider running heartbeat verification in worktree isolation (separate node_modules)
- [ ] Resume CAL-2697 verification cycle once build environment recovers
