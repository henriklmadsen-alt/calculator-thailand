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

const { Pool } = pg;

let pool = null;

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

  // Per-question log — used for server-side tier enforcement (CAL-1263)
  await db.query(`
    CREATE TABLE IF NOT EXISTS questions (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS questions_user_id_created_at_idx ON questions (user_id, created_at);
  `);

  console.log('[db] users + questions tables ready');
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
    'SELECT id, email, tier, questions_used, billing_started_at, created_at, name, avatar_url FROM users WHERE id = $1',
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
  };
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
