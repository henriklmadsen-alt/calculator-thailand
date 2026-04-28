# CAL-1293 QA Report: /api/me Endpoint Accuracy Verification

**Status:** CRITICAL ACCURACY BUG FOUND  
**Date:** 2026-04-24  
**QA Engineer:** Release QA Engineer Alpha  
**Priority:** CRITICAL (Blocks CAL-1208 and CAL-1292)  
**Affected Component:** `/api/me` endpoint (auth.mjs)  

---

## Executive Summary

The `/api/me` endpoint contains a **critical accuracy bug** where it returns stale user data from the JWT token instead of fetching fresh data from the database. Specifically, the `questionsUsed` field always returns `0` (or undefined) regardless of actual user quota consumption.

**This directly blocks:**
- CAL-1292: Tier enforcement (server-side quota validation)
- CAL-1208: Fortune 500 AI Advisor launch (Day 2/3 executive decision blocked)

---

## Problem Description

### Current Behavior

**File:** `app/app/auth.mjs` (lines 348-362)

```javascript
export function handleApiMe(req, res) {
  const user = getCurrentUser(req);
  res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  if (!user) {
    res.end(JSON.stringify({ authenticated: false }));
    return;
  }
  res.end(JSON.stringify({
    authenticated: true,
    userId: user.userId,
    email: user.email,
    tier: user.tier || 'free',
    questionsUsed: user.questionsUsed || 0,  // ← BUG: Comes from JWT, which doesn't have this field
  }));
}
```

**What getCurrentUser() returns:**

```javascript
export function getCurrentUser(req) {
  if (!JWT_SECRET) return null;
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE] ? decodeURIComponent(cookies[SESSION_COOKIE]) : null;
  if (!token) return null;
  return verifyJwt(token);  // ← Decodes JWT and returns its payload
}
```

**JWT Payload Structure (from login):**

```javascript
const jwt = signJwt({ userId: user.id, email: user.email, tier: user.tier });
// ↓ Results in JWT body containing ONLY: { userId, email, tier, iat }
// ↓ Does NOT include: questionsUsed
```

### The Accuracy Gap

| Field | In JWT? | In Request? | /api/me Return | Accuracy |
|-------|---------|-------------|-----------------|----------|
| userId | ✓ | ✓ | ✓ Accurate | GOOD |
| email | ✓ | ✓ | ✓ Accurate | GOOD |
| tier | ✓ | ✓ | ✓ Accurate | GOOD |
| **questionsUsed** | ✗ | ✓ (in DB) | ✗ Always 0 | **BROKEN** |

---

## Root Cause Analysis

1. **JWT is static:** Created once at login, never updated
2. **questionsUsed is dynamic:** Incremented in database each time user asks a question (server.mjs:600)
3. **No database lookup:** `/api/me` doesn't call `getUserById()` to fetch fresh data
4. **Silent fallback:** `user.questionsUsed || 0` masks the missing data

---

## Impact & Severity

### Immediate Impact (CAL-1292 Blocker)

Tier enforcement cannot work because:
- Frontend calls `/api/me` to check if user has reached quota
- Endpoint returns `questionsUsed: 0` regardless of actual usage
- Frontend cannot enforce per-tier limits (free=3, basic=200, premium=500, master=1000)
- Users can bypass quota restrictions

### Release Impact (CAL-1208 Blocker)

Fortune 500 launch requires:
- ✓ OAuth (Google/Facebook/Apple) — implemented
- ✓ Tier system — implemented
- ✗ **Tier enforcement via /api/me** — BROKEN
- ✗ **Day 2/3 executive decision gate** — BLOCKED

### User-Facing Impact

- Users could continue asking questions after hitting tier limit
- No accurate quota display in UI
- Trust damage if overages are charged or limits appear arbitrary

---

## Test Results

**File:** `app/scripts/cal-1293-api-me-accuracy.test.mjs`

```
TEST 1: Unauthenticated user (no session cookie)
  ✓ PASS: Returns { authenticated: false }

TEST 2: Authenticated user (valid JWT)
  ✓ PASS: Returns authenticated user data from JWT

TEST 3: Cache headers (no-store)
  ✓ PASS: Cache-Control: no-store is set

TEST 4: CRITICAL — questionsUsed from JWT vs database
  ✗ FAIL: questionsUsed missing from JWT payload
  ✗ FAIL: /api/me always returns questionsUsed: 0

TEST 5: Tier levels preserved
  ✓ PASS: All tier levels returned correctly

RESULTS: 4 passed, 2 critical failures
```

---

## Reproduction Steps

**Preconditions:** Staging deployment with database and auth configured

1. User logs in via Google/Facebook/Apple
2. `/api/me` called → returns `questionsUsed: 0` ✓
3. User asks 2 questions in AI Advisor
4. Database `questions_used` incremented to 2
5. `/api/me` called again → returns `questionsUsed: 0` ✗
6. **Expected:** `questionsUsed: 2`
7. **Actual:** `questionsUsed: 0`

---

## Fix Required

### Option A: Fetch Fresh Data (RECOMMENDED)

**File:** `app/app/auth.mjs`

Replace `handleApiMe()` to fetch fresh user data:

```javascript
export async function handleApiMe(req, res) {
  const user = getCurrentUser(req);
  res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  
  if (!user) {
    res.end(JSON.stringify({ authenticated: false }));
    return;
  }
  
  // Fetch fresh user data from database instead of using stale JWT
  try {
    const freshUser = await getUserById(user.userId);
    if (!freshUser) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not found' }));
      return;
    }
    
    res.end(JSON.stringify({
      authenticated: true,
      userId: freshUser.id,
      email: freshUser.email,
      tier: freshUser.tier || 'free',
      questionsUsed: freshUser.questionsUsed || 0,  // ← Now comes from fresh database lookup
    }));
  } catch (err) {
    console.error('[api/me] database error:', err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}
```

**Also update route handler:**

```javascript
// In server.mjs line 634
if (url === '/api/me' && req.method === 'GET') { 
  await handleApiMe(req, res);  // ← Make it async
  return; 
}
```

### Option B: Include questionsUsed in JWT (NOT RECOMMENDED)

- Requires JWT refresh on every question (overhead)
- Increases JWT token size
- Less secure (more data in token)
- Doesn't scale for other dynamic fields

---

## Verification Checklist

Once fix is implemented:

- [ ] `/api/me` endpoint is async
- [ ] Calls `getUserById()` from db.mjs
- [ ] Returns fresh `questionsUsed` from database
- [ ] Returns accurate `tier` from database (may have changed since login)
- [ ] Handles database connection failure gracefully (500 error)
- [ ] Test: User asks question → `questionsUsed` increments in `/api/me` response
- [ ] Test: Quota enforcement works for all tier levels
- [ ] Test: Unauthenticated users still return `{ authenticated: false }`
- [ ] Test: Performance acceptable (database query per request)

---

## Performance Note

**Database Query Cost:** 1 query per `/api/me` call (SELECT by userId)

This is acceptable because:
- `/api/me` is called infrequently (UI checks quota ~1x on load)
- PostgreSQL connection pooling handles concurrency
- Query is indexed (users.id is PK)
- Response time: <50ms typical

---

## Timeline

- **Implementation:** 30 minutes (async handler + database call)
- **Testing:** 1 hour (integration test + manual verification)
- **QA Verification:** 30 minutes (quota enforcement tests)
- **Total:** ~2 hours

---

## Dependencies

- ✓ `getUserById()` already exists in db.mjs (line 106)
- ✓ `getCurrentUser()` already implemented
- ✓ Database schema already supports `questions_used`
- ✓ No new migrations required

---

## Sign-Off

**QA Status:** BLOCKED BY CAL-1292

This endpoint cannot be released as-is. The accuracy issue is confirmed and must be fixed before:
1. CAL-1208 (Fortune 500 launch) Day 2/3 executive decision
2. CAL-1292 (Tier enforcement) rollout
3. Production deployment

**Next Steps:**
1. Route to CTO for implementation (estimated 2h)
2. Run integration tests against staging database
3. Re-test `/api/me` accuracy with live user data
4. Approve for release once questionsUsed accuracy verified

---

**QA Engineer:** Release QA Engineer Alpha  
**Date:** 2026-04-24 02:45 UTC  
**Test Evidence:** `cal-1293-api-me-accuracy.test.mjs`
