/**
 * Rate Limiting Middleware for AI Advisor API
 *
 * Enforces:
 * - 10 questions/minute per authenticated user
 * - 3 concurrent SSE connections per user
 * - 500 character limit on question text
 * - IP-based limiting for unauthenticated requests (10 requests/minute)
 * - Returns HTTP 429 with Retry-After header when limits exceeded
 */

interface RateLimitEntry {
  timestamp: number;
  count: number;
}

interface ConcurrentConnectionTracker {
  connections: Set<string>;
  lastCleanup: number;
}

/**
 * In-memory rate limiting store
 * Structure:
 * - questionLimits: Map<userId|ipAddress, RateLimitEntry[]>
 * - concurrentConnections: Map<userId, Set<connectionId>>
 */
class RateLimiter {
  private questionLimits: Map<string, RateLimitEntry> = new Map();
  private concurrentConnections: Map<string, ConcurrentConnectionTracker> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  // Configuration (in ms)
  private MINUTE_MS = 60 * 1000;
  private CLEANUP_INTERVAL_MS = 30 * 1000; // Clean up old entries every 30 seconds

  // Rate limit thresholds
  private QUESTIONS_PER_MINUTE = 10;
  private CONCURRENT_SSE_LIMIT = 3;
  private MAX_QUESTION_LENGTH = 500;
  private IP_REQUESTS_PER_MINUTE = 10; // For unauthenticated requests

  constructor() {
    // Auto cleanup old entries to prevent memory leaks
    this.cleanupInterval = setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL_MS);
  }

  /**
   * Extract user ID from request (from auth header, session, or null for unauthenticated)
   */
  private extractUserId(request: Request): string | null {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Simple extraction of token; in production, this would validate the JWT
      return authHeader.substring(7).split('.')[0]; // Use first part of JWT as simple ID
    }
    return null;
  }

  /**
   * Get client IP address from request
   */
  private getClientIp(request: Request): string {
    const xff = request.headers.get('x-forwarded-for');
    if (xff) {
      return xff.split(',')[0].trim();
    }
    const cfIp = request.headers.get('cf-connecting-ip');
    if (cfIp) {
      return cfIp;
    }
    return 'unknown';
  }

  /**
   * Get rate limit key: user ID if authenticated, otherwise IP address
   */
  getRateLimitKey(request: Request): { key: string; isAuthenticated: boolean } {
    const userId = this.extractUserId(request);
    if (userId) {
      return { key: `user:${userId}`, isAuthenticated: true };
    }
    const ip = this.getClientIp(request);
    return { key: `ip:${ip}`, isAuthenticated: false };
  }

  /**
   * Check if a question exceeds the length limit
   */
  checkQuestionLength(question: string): { valid: boolean; error?: string } {
    if (!question || typeof question !== 'string') {
      return { valid: false, error: 'Question must be a non-empty string' };
    }

    const length = question.trim().length;
    if (length > this.MAX_QUESTION_LENGTH) {
      return {
        valid: false,
        error: `Question exceeds maximum length of ${this.MAX_QUESTION_LENGTH} characters (received ${length})`,
      };
    }

    return { valid: true };
  }

  /**
   * Check rate limit for question submissions
   * Returns: { allowed: boolean, retryAfter?: number }
   */
  checkQuestionRateLimit(request: Request): { allowed: boolean; retryAfterSeconds?: number } {
    const { key, isAuthenticated } = this.getRateLimitKey(request);
    const now = Date.now();
    const limit = isAuthenticated ? this.QUESTIONS_PER_MINUTE : this.IP_REQUESTS_PER_MINUTE;

    const entry = this.questionLimits.get(key);

    if (!entry) {
      // First request for this key
      this.questionLimits.set(key, { timestamp: now, count: 1 });
      return { allowed: true };
    }

    const timeSinceLastRequest = now - entry.timestamp;

    if (timeSinceLastRequest > this.MINUTE_MS) {
      // Outside of 1-minute window, reset counter
      this.questionLimits.set(key, { timestamp: now, count: 1 });
      return { allowed: true };
    }

    // Within 1-minute window
    if (entry.count >= limit) {
      const retryAfter = Math.ceil((entry.timestamp + this.MINUTE_MS - now) / 1000);
      return { allowed: false, retryAfterSeconds: retryAfter };
    }

    // Increment counter
    entry.count += 1;
    return { allowed: true };
  }

  /**
   * Register an SSE connection
   * Returns: { allowed: boolean, retryAfter?: number }
   */
  registerSseConnection(request: Request, connectionId: string): { allowed: boolean; retryAfterSeconds?: number } {
    const { key } = this.getRateLimitKey(request);

    if (!this.concurrentConnections.has(key)) {
      this.concurrentConnections.set(key, {
        connections: new Set([connectionId]),
        lastCleanup: Date.now(),
      });
      return { allowed: true };
    }

    const tracker = this.concurrentConnections.get(key)!;

    if (tracker.connections.size >= this.CONCURRENT_SSE_LIMIT) {
      return { allowed: false, retryAfterSeconds: 30 };
    }

    tracker.connections.add(connectionId);
    return { allowed: true };
  }

  /**
   * Unregister an SSE connection
   */
  unregisterSseConnection(request: Request, connectionId: string): void {
    const { key } = this.getRateLimitKey(request);
    const tracker = this.concurrentConnections.get(key);
    if (tracker) {
      tracker.connections.delete(connectionId);
      if (tracker.connections.size === 0) {
        this.concurrentConnections.delete(key);
      }
    }
  }

  /**
   * Log a rate limit hit
   */
  logRateLimitHit(limitType: string, key: string, details?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    console.warn(`[RATE_LIMIT_HIT] ${timestamp} | type=${limitType} | key=${key}`, details || '');

    // TODO: In production, write to database/analytics table
    // e.g., insertAnalyticsEvent({ type: 'rate_limit_hit', limitType, key, timestamp, details })
  }

  /**
   * Clean up old entries from rate limit tracking
   * Entries older than 2 minutes are removed to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    const cutoffTime = now - this.MINUTE_MS * 2;

    // Clean up question limits
    for (const [key, entry] of this.questionLimits.entries()) {
      if (entry.timestamp < cutoffTime) {
        this.questionLimits.delete(key);
      }
    }

    // Clean up concurrent connection trackers with no active connections
    for (const [key, tracker] of this.concurrentConnections.entries()) {
      if (tracker.connections.size === 0) {
        this.concurrentConnections.delete(key);
      }
    }
  }

  /**
   * Shutdown the rate limiter (stop cleanup interval)
   */
  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Global singleton instance
let instance: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (!instance) {
    instance = new RateLimiter();
  }
  return instance;
}

/**
 * Create a 429 Too Many Requests response
 */
export function createRateLimitResponse(retryAfterSeconds: number): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfterSeconds.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}

/**
 * Middleware wrapper for API routes that handles rate limiting
 * Usage:
 *   export const POST: APIRoute = withRateLimit(async ({ request }) => { ... })
 */
export function withRateLimit(handler: (context: any) => Promise<Response>) {
  return async (context: any): Promise<Response> => {
    const request = context.request;
    const limiter = getRateLimiter();

    // Check question rate limit
    const rateLimitCheck = limiter.checkQuestionRateLimit(request);
    if (!rateLimitCheck.allowed) {
      const { key } = limiter.getRateLimitKey(request);
      limiter.logRateLimitHit('question_rate_limit', key, {
        retryAfter: rateLimitCheck.retryAfterSeconds,
      });
      return createRateLimitResponse(rateLimitCheck.retryAfterSeconds || 60);
    }

    // Call the handler
    return handler(context);
  };
}
