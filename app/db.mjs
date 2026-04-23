/**
 * PostgreSQL connection + user management.
 * Uses the `pg` package. Requires DATABASE_URL env var.
 *
 * Users table schema (auto-created on first connection):
 *   id            UUID PRIMARY KEY
 *   email         TEXT UNIQUE NOT NULL
 *   provider      TEXT NOT NULL  (google | facebook | apple)
 *   provider_id   TEXT NOT NULL
 *   name          TEXT
 *   avatar_url    TEXT
 *   tier          TEXT DEFAULT 'free'  (free | basic | premium | master)
 *   questions_used INT DEFAULT 0
 *   created_at    TIMESTAMPTZ DEFAULT NOW()
 *   updated_at    TIMESTAMPTZ DEFAULT NOW()
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
  console.log('[db] users table ready');

  await initAiAdvisorTables();
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
    'SELECT id, email, tier, questions_used, name, avatar_url FROM users WHERE id = $1',
    [userId]
  );
  if (!result.rows.length) return null;
  const u = result.rows[0];
  return { id: u.id, email: u.email, tier: u.tier, questionsUsed: u.questions_used, name: u.name, avatarUrl: u.avatar_url };
}

// Tier question limits per month
export const TIER_LIMITS = {
  free: 3,
  basic: 200,
  premium: 500,
  master: 1000,
};

// Calculator embeddings table schema:
//   calculator_slug  TEXT NOT NULL
//   chunk_type       TEXT NOT NULL  (formula | description | examples | faq)
//   chunk_index      INT NOT NULL   (for ordering multiple chunks of same type)
//   content          TEXT NOT NULL
//   embedding        FLOAT8[]       (OpenAI text-embedding-3-small, 1536 dimensions)
//   tokens_used      INT            (for tracking API costs)
//   created_at       TIMESTAMPTZ DEFAULT NOW()
//   updated_at       TIMESTAMPTZ DEFAULT NOW()

export async function initCalculatorEmbeddings() {
  const db = getPool();
  // Use FLOAT8[] (array of float8) to store embeddings without pgvector extension
  await db.query(`
    CREATE TABLE IF NOT EXISTS calculator_embeddings (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      calculator_slug  TEXT NOT NULL,
      chunk_type       TEXT NOT NULL,
      chunk_index      INT NOT NULL DEFAULT 0,
      content          TEXT NOT NULL,
      embedding        FLOAT8[],
      tokens_used      INT,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(calculator_slug, chunk_type, chunk_index)
    );
    CREATE INDEX IF NOT EXISTS idx_calculator_embeddings_slug ON calculator_embeddings (calculator_slug);
    CREATE INDEX IF NOT EXISTS idx_calculator_embeddings_type ON calculator_embeddings (chunk_type);
  `);
  console.log('[db] calculator_embeddings table ready');
}

export async function upsertCalculatorEmbedding({
  calculatorSlug,
  chunkType,
  chunkIndex,
  content,
  embedding,
  tokensUsed,
}) {
  const db = getPool();
  const result = await db.query(
    `INSERT INTO calculator_embeddings (calculator_slug, chunk_type, chunk_index, content, embedding, tokens_used)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (calculator_slug, chunk_type, chunk_index) DO UPDATE
       SET content = EXCLUDED.content,
           embedding = EXCLUDED.embedding,
           tokens_used = EXCLUDED.tokens_used,
           updated_at = NOW()
     RETURNING id`,
    [calculatorSlug, chunkType, chunkIndex, content, embedding, tokensUsed]
  );
  return result.rows[0]?.id;
}

export async function getCalculatorEmbeddings(calculatorSlug) {
  const db = getPool();
  const result = await db.query(
    'SELECT calculator_slug, chunk_type, chunk_index, content, embedding FROM calculator_embeddings WHERE calculator_slug = $1 ORDER BY chunk_type, chunk_index',
    [calculatorSlug]
  );
  return result.rows;
}

// Questions and messages tables for AI Advisor (CAL-1312)
// questions table: stores user questions
// messages table: stores AI responses with citations

export async function initAiAdvisorTables() {
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS questions (
      id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      idempotency_key   TEXT,
      content           TEXT NOT NULL,
      calculator        TEXT,
      status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
      created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS questions_user_idx ON questions (user_id, created_at DESC);
    CREATE UNIQUE INDEX IF NOT EXISTS questions_idempotency_idx ON questions (user_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      question_id   UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      role          TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      content       TEXT NOT NULL,
      citations     JSONB,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS messages_question_idx ON messages (question_id, created_at ASC);
  `);
  console.log('[db] AI Advisor tables (questions, messages) ready');
}

export async function createQuestion({ userId, content, calculator }) {
  const db = getPool();
  const result = await db.query(
    'INSERT INTO questions (user_id, content, calculator) VALUES ($1, $2, $3) RETURNING id',
    [userId, content, calculator || null]
  );
  return result.rows[0].id;
}

/**
 * Create a question atomically with idempotency support.
 * CAL-1313: Atomic question counter (no double-counting)
 *
 * 1. If idempotencyKey exists for this user, returns cached result
 * 2. Otherwise, inserts question (status='pending') in transaction
 * 3. Returns question ID (question is now counted for quota check)
 *
 * @param {string} userId - User ID
 * @param {string} content - Question content
 * @param {string} idempotencyKey - Client-provided UUID (ensures no double-count on retry)
 * @param {string} calculator - Optional calculator context
 * @returns {Promise<{id: string, isNew: boolean}>} Question ID and whether it's new
 */
export async function createQuestionAtomic({ userId, content, idempotencyKey, calculator }) {
  const db = getPool();

  // For idempotency: if this key exists, return the existing question ID
  // This prevents double-counting if client retries the request
  if (idempotencyKey) {
    const existing = await db.query(
      'SELECT id, status FROM questions WHERE user_id = $1 AND idempotency_key = $2',
      [userId, idempotencyKey]
    );
    if (existing.rows.length > 0) {
      return { id: existing.rows[0].id, isNew: false, status: existing.rows[0].status };
    }
  }

  // Create new question with status='pending'
  // This counts immediately toward quota, even before Claude responds
  const result = await db.query(
    `INSERT INTO questions (user_id, idempotency_key, content, calculator, status)
     VALUES ($1, $2, $3, $4, 'pending')
     RETURNING id, status`,
    [userId, idempotencyKey || null, content, calculator || null]
  );
  return { id: result.rows[0].id, isNew: true, status: result.rows[0].status };
}

/**
 * Mark a question as success and increment the user's questions_used.
 * CAL-1313: Only count toward quota if Claude response succeeds.
 * Uses transaction to ensure atomicity: status update and counter increment are all-or-nothing.
 *
 * @param {string} questionId - Question ID to mark as success
 * @param {string} userId - User ID (for counter increment)
 * @returns {Promise<{questionsUsed: number}>} New questions_used count
 */
export async function markQuestionSuccessAndIncrement(questionId, userId) {
  const db = getPool();
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Mark question as success
    await client.query(
      'UPDATE questions SET status = $1, updated_at = NOW() WHERE id = $2',
      ['success', questionId]
    );

    // Atomically increment counter
    const result = await client.query(
      'UPDATE users SET questions_used = questions_used + 1, updated_at = NOW() WHERE id = $1 RETURNING questions_used',
      [userId]
    );

    await client.query('COMMIT');
    return { questionsUsed: result.rows[0].questions_used };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Mark a question as failed (Claude API error, timeout, etc).
 * CAL-1313: Failed questions do NOT count toward quota.
 *
 * @param {string} questionId - Question ID to mark as failed
 * @returns {Promise<void>}
 */
export async function markQuestionFailed(questionId) {
  const db = getPool();
  await db.query(
    'UPDATE questions SET status = $1, updated_at = NOW() WHERE id = $2',
    ['failed', questionId]
  );
}

export async function saveMessage({ questionId, role, content, citations }) {
  const db = getPool();
  const result = await db.query(
    'INSERT INTO messages (question_id, role, content, citations) VALUES ($1, $2, $3, $4) RETURNING id',
    [questionId, role, content, citations || null]
  );
  return result.rows[0].id;
}

// ── Admin stats (CAL-1318) ────────────────────────────────────────────────────

/**
 * Get usage statistics for admin dashboard.
 * Returns: user counts by tier, questions time-series, most used categories, revenue estimate.
 */
export async function getAdminUsageStats() {
  const db = getPool();

  // 1. Total users by tier
  const tierStats = await db.query(`
    SELECT tier, COUNT(*) as count
    FROM users
    GROUP BY tier
    ORDER BY CASE tier WHEN 'free' THEN 0 WHEN 'basic' THEN 1 WHEN 'premium' THEN 2 WHEN 'master' THEN 3 ELSE 4 END
  `);

  const totalUsersByTier = {};
  for (const row of tierStats.rows) {
    totalUsersByTier[row.tier] = parseInt(row.count, 10);
  }

  // 2. Questions today/week/month
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1);

  const questionsStats = await db.query(`
    SELECT
      (SELECT COUNT(*) FROM questions WHERE created_at >= $1 AND status = 'success') as today,
      (SELECT COUNT(*) FROM questions WHERE created_at >= $2 AND status = 'success') as week,
      (SELECT COUNT(*) FROM questions WHERE created_at >= $3 AND status = 'success') as month
  `, [today, weekAgo, monthAgo]);

  const questions = {
    today: parseInt(questionsStats.rows[0].today, 10),
    week: parseInt(questionsStats.rows[0].week, 10),
    month: parseInt(questionsStats.rows[0].month, 10),
  };

  // 3. Average questions per user
  const avgStats = await db.query(`
    SELECT
      AVG(questions_used) as avg_questions,
      MAX(questions_used) as max_questions,
      MIN(questions_used) as min_questions
    FROM users
    WHERE questions_used > 0
  `);

  const avgQuestions = {
    avg: Math.round(avgStats.rows[0].avg_questions * 100) / 100,
    max: parseInt(avgStats.rows[0].max_questions, 10),
    min: parseInt(avgStats.rows[0].min_questions, 10),
  };

  // 4. Most used calculator categories (from questions)
  const categoryStats = await db.query(`
    SELECT calculator, COUNT(*) as count
    FROM questions
    WHERE calculator IS NOT NULL AND calculator != ''
    GROUP BY calculator
    ORDER BY count DESC
    LIMIT 10
  `);

  const topCalculators = categoryStats.rows.map(row => ({
    calculator: row.calculator,
    count: parseInt(row.count, 10),
  }));

  // 5. Revenue estimate (based on tier subscriptions)
  // Assumes: Basic = 99 THB/month, Premium = 199 THB/month, Master = 599 THB/month
  // Assumes free users generate 0 revenue (but AdSense revenue would go here)
  const monthlyMRR = (
    (totalUsersByTier.basic || 0) * 99 +
    (totalUsersByTier.premium || 0) * 199 +
    (totalUsersByTier.master || 0) * 599
  );

  return {
    timestamp: new Date().toISOString(),
    totalUsers: Object.values(totalUsersByTier).reduce((a, b) => a + b, 0),
    usersByTier: totalUsersByTier,
    questions,
    averageQuestionsPerUser: avgQuestions,
    topCalculators,
    estimatedMonthlyRevenue: {
      amount: monthlyMRR,
      currency: 'THB',
      breakdown: {
        basic: (totalUsersByTier.basic || 0) * 99,
        premium: (totalUsersByTier.premium || 0) * 199,
        master: (totalUsersByTier.master || 0) * 599,
      },
    },
  };
}
