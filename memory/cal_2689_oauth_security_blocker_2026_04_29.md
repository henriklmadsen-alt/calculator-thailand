---
name: CAL-2689 OAuth Credential Security Blocker
description: Critical security incident blocking 2026-04-30 launch — exposed OAuth credentials in git history
type: project
---

## OAuth Credential Exposure — Critical Blocker

**Date Detected**: 2026-04-29 01:30 UTC
**Status**: BLOCKING DEPLOYMENT
**Issue**: CAL-2689 CMO Sprint Heartbeat

### What Happened

- **Commit 63f6f9f** (2026-04-29 07:53 UTC): Security fix to remove hardcoded OAuth credentials
- **Commit 3480bcc** (prior): Google OAuth `client_id` and `client_secret` were hardcoded and committed to git repository
- **Exposure scope**: Credentials are exposed in public git history
- **Remediation**: Code updated to require environment variables: `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET`

### Impact

- **Launch Date**: 2026-04-30 (BLOCKED)
- **Gate Status**: Previous gate certifications invalidated (CAL-2679, CAL-2682)
- **Deployment Blocker**: Cannot proceed with launch until credentials are rotated

### Required Actions

1. **Board Authorization** for OAuth credential rotation
2. **Generate new OAuth credentials** at Google Cloud Console
3. **Invalidate old compromised credentials** at Google
4. **Configure environment variables** in production:
   - `GOOGLE_OAUTH_CLIENT_ID` (new)
   - `GOOGLE_OAUTH_CLIENT_SECRET` (new)
5. **Re-verify deployment** with fresh build and trust signals

### Current Status

- **CAL-2689**: Marked as `blocked` (2026-04-29 01:31 UTC)
- **Comment posted**: Explaining blocker and required actions
- **Escalation**: Awaiting CEO action on board approval

### Why This Matters

Calendar Thailand's OAuth integration for Google Search Console (GSC) uses these credentials. The compromise was not caught in prior heartbeats because the security fix commit came after the latest gate verification. This is a legitimate security incident requiring immediate attention.

Previous green certifications are void until:
1. Board approves credential rotation
2. New credentials are generated and configured
3. Environment variables are set in production
4. Fresh build and trust signal verification is completed

