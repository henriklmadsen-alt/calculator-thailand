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
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content       TEXT NOT NULL,
      calculator    TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS questions_user_idx ON questions (user_id, created_at DESC);
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

export async function saveMessage({ questionId, role, content, citations }) {
  const db = getPool();
  const result = await db.query(
    'INSERT INTO messages (question_id, role, content, citations) VALUES ($1, $2, $3, $4) RETURNING id',
    [questionId, role, content, citations || null]
  );
  return result.rows[0].id;
}
