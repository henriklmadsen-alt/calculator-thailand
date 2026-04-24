/**
 * PostgreSQL connection + user management.
 * Uses the `pg` package. Requires DATABASE_URL env var.
 *
 * Users table schema (auto-created on first connection):
 *   id                  UUID PRIMARY KEY
 *   email               TEXT UNIQUE NOT NULL
 *   provider            TEXT NOT NULL  (google | facebook | apple)
 *   provider_id         TEXT NOT NULL
 *   name                TEXT
 *   avatar_url          TEXT
 *   tier                TEXT DEFAULT 'free'  (free | basic | premium | master)
 *   questions_used      INT DEFAULT 0        (legacy cumulative counter)
 *   billing_started_at  TIMESTAMPTZ          (first paid subscription date; NULL = use created_at)
 *   created_at          TIMESTAMPTZ DEFAULT NOW()
 *   updated_at          TIMESTAMPTZ DEFAULT NOW()
 *
 * Questions table (per-question log for accurate tier enforcement):
 *   id         UUID PRIMARY KEY
 *   user_id    UUID NOT NULL REFERENCES users(id)
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 */

import pg from 'pg';
import { Sentry, isSentryEnabled } from './monitoring.mjs';

const { Pool } = pg;

let pool = null;

// Pool pressure warning thresholds (fraction of max connections)
const POOL_WARN_FRACTION = 0.8;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL env var not set — PostgreSQL not available');
    }
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('railway') || connectionString.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : false,
      max: 10,
      idleTimeoutMillis: 30000,
    });

    pool.on('error', (err) => {
      console.error('[db] unexpected client error:', err.message);
      if (isSentryEnabled()) {
        Sentry.captureException(err, { tags: { component: 'db_pool' } });
      }
    });

    pool.on('connect', () => {
      const total = pool.totalCount;
      const max = pool.options.max;
      if (total >= max * POOL_WARN_FRACTION) {
        const msg = `DB pool under pressure: ${total}/${max} connections active`;
        console.warn(`[db] ${msg}`);
        if (isSentryEnabled()) {
          Sentry.captureMessage(msg, {
            level: 'warning',
            tags: { type: 'pool_pressure' },
            extra: { totalConnections: total, maxConnections: max, waitingCount: pool.waitingCount },
          });
        }
      }
    });

    pool.on('acquire', () => {
      if (pool.waitingCount > 0) {
        console.warn(
          `[db] Pool contention: ${pool.waitingCount} queries waiting (total=${pool.totalCount}/${pool.options.max})`
        );
      }
    });
  }
  return pool;
}

export async function initDb() {
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email        TEXT UNIQUE NOT NULL,
      provider     TEXT NOT NULL,
      provider_id  TEXT NOT NULL,
      name         TEXT,
      avatar_url   TEXT,
      tier         TEXT NOT NULL DEFAULT 'free',
      questions_used INT NOT NULL DEFAULT 0,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE UNIQUE INDEX IF NOT EXISTS users_provider_idx ON users (provider, provider_id);
  `);

  // Add billing_started_at if it doesn't exist yet (idempotent migration)
  await db.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_started_at TIMESTAMPTZ;
  `);

  // Add questions_used if column missing from legacy schema (idempotent migration)
  await db.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS questions_used INT NOT NULL DEFAULT 0;
  `);

  // Per-question log — used for server-side tier enforcement (CAL-1263)
  await db.query(`
    CREATE TABLE IF NOT EXISTS questions (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS questions_user_id_created_at_idx ON questions (user_id, created_at);
  `);

  // Stripe customer ID column (CAL-1266)
  await db.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
  `);

  // Conversation history (CAL-1265)
  await db.query(`
    CREATE TABLE IF NOT EXISTS conversations (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title      TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS conversations_user_id_updated_at_idx ON conversations (user_id, updated_at DESC);
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role            TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      content         TEXT NOT NULL,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages (conversation_id, created_at ASC);
  `);

  console.log('[db] users + questions + conversations + messages tables ready');
}

/** Create a new conversation for a user with an auto-generated title. */
export async function createConversation(userId, title) {
  const db = getPool();
  const result = await db.query(
    `INSERT INTO conversations (user_id, title) VALUES ($1, $2)
     RETURNING id, title, created_at, updated_at`,
    [userId, title]
  );
  return result.rows[0];
}

/** List conversations for a user, newest-updated first, 20 per page. */
export async function listConversations(userId, page = 1) {
  const db = getPool();
  const limit = 20;
  const offset = (page - 1) * limit;
  const [rows, countRow] = await Promise.all([
    db.query(
      `SELECT id, title, created_at, updated_at
       FROM conversations WHERE user_id = $1
       ORDER BY updated_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    ),
    db.query('SELECT COUNT(*) FROM conversations WHERE user_id = $1', [userId]),
  ]);
  const total = parseInt(countRow.rows[0].count, 10);
  return {
    conversations: rows.rows,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    hasMore: offset + rows.rows.length < total,
  };
}

/**
 * Fetch a conversation with all its messages.
 * Returns null if not found, 'forbidden' if user_id mismatch.
 */
export async function getConversationWithMessages(conversationId, userId) {
  const db = getPool();
  const convResult = await db.query(
    'SELECT id, title, user_id, created_at, updated_at FROM conversations WHERE id = $1',
    [conversationId]
  );
  if (!convResult.rows.length) return null;
  const conv = convResult.rows[0];
  if (conv.user_id !== userId) return 'forbidden';

  const msgResult = await db.query(
    `SELECT id, role, content, created_at FROM messages
     WHERE conversation_id = $1 ORDER BY created_at ASC`,
    [conversationId]
  );
  return {
    id: conv.id,
    title: conv.title,
    createdAt: conv.created_at,
    updatedAt: conv.updated_at,
    messages: msgResult.rows.map(m => ({
      id: m.id, role: m.role, content: m.content, createdAt: m.created_at,
    })),
  };
}

/**
 * Delete a conversation by ID.
 * Returns 'not_found', 'forbidden', or 'deleted'.
 */
export async function deleteConversation(conversationId, userId) {
  const db = getPool();
  const check = await db.query(
    'SELECT user_id FROM conversations WHERE id = $1',
    [conversationId]
  );
  if (!check.rows.length) return 'not_found';
  if (check.rows[0].user_id !== userId) return 'forbidden';
  await db.query('DELETE FROM conversations WHERE id = $1', [conversationId]);
  return 'deleted';
}

/** Append a message to a conversation and bump updated_at. */
export async function addMessage(conversationId, role, content) {
  const db = getPool();
  const [msgResult] = await Promise.all([
    db.query(
      `INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)
       RETURNING id, role, content, created_at`,
      [conversationId, role, content]
    ),
    db.query('UPDATE conversations SET updated_at = NOW() WHERE id = $1', [conversationId]),
  ]);
  return msgResult.rows[0];
}

export async function getOrCreateUser({ provider, providerId, email, name, avatarUrl }) {
  const db = getPool();

  // Try find by provider identity first (handles email changes)
  const existing = await db.query(
    'SELECT id, email, tier, questions_used FROM users WHERE provider = $1 AND provider_id = $2',
    [provider, providerId]
  );
  if (existing.rows.length > 0) {
    const u = existing.rows[0];
    return { id: u.id, email: u.email, tier: u.tier, questionsUsed: u.questions_used };
  }

  // Insert new user (ON CONFLICT handles race on duplicate email)
  const result = await db.query(
    `INSERT INTO users (email, provider, provider_id, name, avatar_url)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE
       SET provider = EXCLUDED.provider,
           provider_id = EXCLUDED.provider_id,
           name = COALESCE(EXCLUDED.name, users.name),
           avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
           updated_at = NOW()
     RETURNING id, email, tier, questions_used`,
    [email, provider, providerId, name || null, avatarUrl || null]
  );
  const u = result.rows[0];
  return { id: u.id, email: u.email, tier: u.tier, questionsUsed: u.questions_used };
}

export async function incrementQuestionsUsed(userId) {
  const db = getPool();
  const result = await db.query(
    'UPDATE users SET questions_used = questions_used + 1, updated_at = NOW() WHERE id = $1 RETURNING questions_used',
    [userId]
  );
  return result.rows[0]?.questions_used ?? 0;
}

export async function getUserById(userId) {
  const db = getPool();
  const result = await db.query(
    'SELECT id, email, tier, questions_used, billing_started_at, created_at, name, avatar_url, stripe_customer_id FROM users WHERE id = $1',
    [userId]
  );
  if (!result.rows.length) return null;
  const u = result.rows[0];
  return {
    id: u.id,
    email: u.email,
    tier: u.tier,
    questionsUsed: u.questions_used,
    billingStartedAt: u.billing_started_at,
    createdAt: u.created_at,
    name: u.name,
    avatarUrl: u.avatar_url,
    stripeCustomerId: u.stripe_customer_id,
  };
}

export async function setUserStripeCustomerId(userId, stripeCustomerId) {
  const db = getPool();
  await db.query(
    'UPDATE users SET stripe_customer_id = $1, updated_at = NOW() WHERE id = $2',
    [stripeCustomerId, userId]
  );
}

export async function getUserByStripeCustomerId(stripeCustomerId) {
  const db = getPool();
  const result = await db.query(
    'SELECT id, email, tier, stripe_customer_id FROM users WHERE stripe_customer_id = $1',
    [stripeCustomerId]
  );
  if (!result.rows.length) return null;
  const u = result.rows[0];
  return { id: u.id, email: u.email, tier: u.tier, stripeCustomerId: u.stripe_customer_id };
}

/**
 * Update a user's tier. Sets billing_started_at on the first upgrade from free.
 * Idempotent — safe to call multiple times with the same tier.
 */
export async function updateUserTier(userId, tier) {
  const db = getPool();
  await db.query(
    `UPDATE users
     SET tier = $1,
         billing_started_at = CASE
           WHEN tier = 'free' AND $1 != 'free' AND billing_started_at IS NULL THEN NOW()
           ELSE billing_started_at
         END,
         updated_at = NOW()
     WHERE id = $2`,
    [tier, userId]
  );
}

// Tier question limits: free = lifetime, others = per billing month
export const TIER_LIMITS = {
  free: 3,
  basic: 200,
  premium: 500,
  master: 1000,
};

// Returns the start of the current billing cycle for monthly-limit tiers.
// Uses the anniversary day from billingStartedAt (or createdAt as fallback).
function getBillingCycleStart(billingStartedAt) {
  const now = new Date();
  const startDay = new Date(billingStartedAt).getDate(); // 1–31

  let year = now.getFullYear();
  let month = now.getMonth(); // 0-indexed

  // Clamp day to the actual days in the candidate month
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const effectiveDay = Math.min(startDay, daysInMonth(year, month));
  let cycleStart = new Date(year, month, effectiveDay);

  if (cycleStart > now) {
    // Anniversary hasn't occurred yet this month — step back one month
    month -= 1;
    if (month < 0) { month = 11; year -= 1; }
    const prevEffectiveDay = Math.min(startDay, daysInMonth(year, month));
    cycleStart = new Date(year, month, prevEffectiveDay);
  }

  cycleStart.setHours(0, 0, 0, 0);
  return cycleStart;
}

/**
 * Count questions for tier enforcement.
 * - free tier: lifetime count (all rows for user)
 * - paid tiers: monthly count from the current billing cycle start
 *
 * billingStartedAt: the user's billing_started_at or created_at date
 */
export async function getQuestionCount(userId, tier, billingStartedAt) {
  const db = getPool();
  if (tier === 'free') {
    const result = await db.query(
      'SELECT COUNT(*) FROM questions WHERE user_id = $1',
      [userId]
    );
    return parseInt(result.rows[0].count, 10);
  }
  const cycleStart = getBillingCycleStart(billingStartedAt || new Date());
  const result = await db.query(
    'SELECT COUNT(*) FROM questions WHERE user_id = $1 AND created_at >= $2',
    [userId, cycleStart]
  );
  return parseInt(result.rows[0].count, 10);
}

/** Record a question ask. Called after limit check passes, before calling Claude. */
export async function recordQuestion(userId) {
  const db = getPool();
  await db.query('INSERT INTO questions (user_id) VALUES ($1)', [userId]);
}
