/**
 * Production monitoring — CAL-1421
 * Sentry initialization + active long-running request tracking.
 *
 * The ai-advisor endpoint streams internally from Claude SDK (not true SSE) but
 * each request can hold an open connection for 10–60s. We track these as
 * "active requests" and alert if count exceeds threshold or a request leaks.
 */

import * as Sentry from '@sentry/node';

let sentryEnabled = false;

export function initSentry({ release } = {}) {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    console.warn('[monitoring] SENTRY_DSN not set — Sentry performance tracking disabled');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'production',
    release: release || process.env.RAILWAY_GIT_COMMIT_SHA || 'unknown',
    // Sample all transactions so p95 latency is accurate at current traffic levels.
    // Lower to 0.1 once traffic exceeds ~500 req/day to control Sentry quota.
    tracesSampleRate: 1.0,
    integrations: [
      Sentry.httpIntegration({ tracing: true }),
    ],
  });

  sentryEnabled = true;
  console.log('[monitoring] Sentry initialized (tracesSampleRate=1.0, env=' + (process.env.NODE_ENV || 'production') + ')');
}

export function isSentryEnabled() {
  return sentryEnabled;
}

export { Sentry };

// ── Active long-running request tracker ──────────────────────────────────────
// Tracks ai-advisor Claude streaming calls. Each request holds an HTTP connection
// open while waiting for Anthropic. Threshold and leak detection guard against
// connection pile-up on slow Anthropic responses or client disconnects.

const activeRequests = new Map(); // id → { startTime, endpoint, userId }
let _idCounter = 0;

const CONCURRENT_REQUEST_THRESHOLD = 50;  // alert above this many parallel requests
const LEAK_AGE_MS = 60_000;               // 60s without completion = likely leaked

export function trackActiveRequest(endpoint, { userId } = {}) {
  const id = ++_idCounter;
  activeRequests.set(id, { startTime: Date.now(), endpoint, userId });

  const count = activeRequests.size;
  if (count > CONCURRENT_REQUEST_THRESHOLD) {
    const msg = `Active long-running request count (${count}) exceeds threshold of ${CONCURRENT_REQUEST_THRESHOLD}`;
    console.warn(`[monitoring] ${msg}`);
    if (sentryEnabled) {
      Sentry.captureMessage(msg, {
        level: 'warning',
        tags: { type: 'concurrent_request_threshold', endpoint },
        extra: { activeCount: count, threshold: CONCURRENT_REQUEST_THRESHOLD },
      });
    }
  }

  return id;
}

export function releaseActiveRequest(id) {
  const req = activeRequests.get(id);
  if (!req) return null;
  activeRequests.delete(id);
  return Date.now() - req.startTime;
}

export function getActiveRequestCount() {
  return activeRequests.size;
}

/**
 * Sweep for requests that have been open longer than LEAK_AGE_MS.
 * Called on a periodic interval from server.mjs.
 * Returns the number of leaked entries removed.
 */
export function sweepLeakedRequests() {
  const now = Date.now();
  let leaked = 0;

  for (const [id, req] of activeRequests) {
    const ageMs = now - req.startTime;
    if (ageMs > LEAK_AGE_MS) {
      leaked++;
      const ageSec = Math.round(ageMs / 1000);
      console.warn(
        `[monitoring] Leaked request detected: id=${id} endpoint=${req.endpoint} userId=${req.userId ?? 'unknown'} age=${ageSec}s`
      );
      activeRequests.delete(id);
    }
  }

  if (leaked > 0) {
    console.warn(`[monitoring] Swept ${leaked} leaked request(s)`);
    if (sentryEnabled) {
      Sentry.captureMessage(`Detected ${leaked} leaked long-running request(s)`, {
        level: 'warning',
        tags: { type: 'request_leak' },
        extra: { leakedCount: leaked, leakThresholdMs: LEAK_AGE_MS },
      });
    }
  }

  return leaked;
}
