#!/usr/bin/env node

/**
 * CAL-1394: Setup RAG Infrastructure
 *
 * Verifies and configures the database for pgvector-based RAG retrieval:
 * 1. Enables pgvector extension (if not already enabled)
 * 2. Creates calculator_embeddings table (if it doesn't exist)
 * 3. Creates ivfflat index for vector similarity search
 * 4. Verifies embeddings are populated
 * 5. Performance test: vector search query
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." node setup-rag-infrastructure.mjs [--verify-only]
 *
 * Options:
 *   --verify-only  Only verify setup, don't create/modify anything
 *   --index-only   Only create index (skip table creation)
 *   --verbose      Show detailed output for each step
 */

import postgres from 'pg';
import process from 'process';

const { Pool } = postgres;

const DATABASE_URL = process.env.DATABASE_URL;
const VERIFY_ONLY = process.argv.includes('--verify-only');
const INDEX_ONLY = process.argv.includes('--index-only');
const VERBOSE = process.argv.includes('--verbose');

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable not set');
  process.exit(1);
}

let pool;
let exitCode = 0;

async function log(title, message, level = 'info') {
  const icons = { info: 'ℹ️ ', success: '✅', error: '❌', warn: '⚠️ ' };
  const color = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[36m';
  const reset = '\x1b[0m';
  console.log(`${icons[level]} ${color}${title}${reset}: ${message}`);
}

async function step(name, fn) {
  try {
    if (VERBOSE) console.log(`\n--- ${name} ---`);
    await fn();
  } catch (error) {
    await log(name, error.message, 'error');
    exitCode = 1;
  }
}

async function main() {
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('railway') || DATABASE_URL.includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : false,
  });

  console.log('🚀 RAG Infrastructure Setup\n');

  // Step 1: Check pgvector extension
  await step('Check pgvector extension', async () => {
    const result = await pool.query(`
      SELECT extname, extversion
      FROM pg_extension
      WHERE extname = 'vector'
    `);

    if (result.rows.length === 0) {
      if (VERIFY_ONLY) {
        await log('pgvector', 'NOT INSTALLED (use --verify-only=false to install)', 'warn');
      } else {
        await pool.query('CREATE EXTENSION IF NOT EXISTS vector');
        await log('pgvector', 'Installed', 'success');
      }
    } else {
      const ver = result.rows[0].extversion;
      await log('pgvector', `Installed (v${ver})`, 'success');
    }
  });

  // Step 2: Create table if not exists
  if (!INDEX_ONLY) {
    await step('Create calculator_embeddings table', async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS calculator_embeddings (
          id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          calculator_slug  TEXT NOT NULL,
          chunk_type       TEXT NOT NULL,
          chunk_index      INT NOT NULL DEFAULT 0,
          content          TEXT NOT NULL,
          embedding        vector(1536),
          tokens_used      INT,
          created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE(calculator_slug, chunk_type, chunk_index)
        )
      `);

      const result = await pool.query(`
        SELECT COUNT(*) as count FROM information_schema.tables
        WHERE table_name = 'calculator_embeddings'
      `);

      const exists = result.rows[0].count > 0;
      if (exists) {
        await log('Table', 'Created or already exists', 'success');
      } else {
        throw new Error('Failed to create table');
      }
    });

    // Check for basic indices
    await step('Ensure basic indices exist', async () => {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_calculator_embeddings_slug
          ON calculator_embeddings (calculator_slug)
      `);
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_calculator_embeddings_type
          ON calculator_embeddings (chunk_type)
      `);
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_calculator_embeddings_created
          ON calculator_embeddings (created_at)
      `);
      await log('Basic indices', 'Created or already exist', 'success');
    });
  }

  // Step 3: Create ivfflat index for vector search
  await step('Create vector search index (ivfflat)', async () => {
    // Check if index already exists
    const indexCheck = await pool.query(`
      SELECT indexname FROM pg_indexes
      WHERE tablename = 'calculator_embeddings'
      AND indexname LIKE '%embedding%'
    `);

    if (indexCheck.rows.length > 0) {
      await log('ivfflat index', `Already exists: ${indexCheck.rows.map(r => r.indexname).join(', ')}`, 'success');
    } else {
      if (VERIFY_ONLY) {
        await log('ivfflat index', 'NOT FOUND (use --verify-only=false to create)', 'warn');
      } else {
        // Create ivfflat index for cosine distance
        await pool.query(`
          CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calculator_embeddings_embedding_ivfflat
          ON calculator_embeddings
          USING ivfflat (embedding vector_cosine_ops)
          WITH (lists = 100)
        `);
        await log('ivfflat index', 'Created successfully', 'success');
      }
    }
  });

  // Step 4: Verify embeddings are populated
  await step('Verify embeddings are populated', async () => {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total_chunks,
        COUNT(DISTINCT calculator_slug) as unique_calculators,
        COUNT(DISTINCT chunk_type) as chunk_types
      FROM calculator_embeddings
    `);

    const { total_chunks, unique_calculators, chunk_types } = result.rows[0];

    if (total_chunks === 0) {
      await log(
        'Embeddings',
        `No embeddings found. Run: node embed-calculator-content.mjs`,
        'warn'
      );
    } else {
      await log(
        'Embeddings',
        `${total_chunks} chunks from ${unique_calculators} calculators (${chunk_types} types)`,
        'success'
      );

      // Show distribution by chunk type
      const typeResult = await pool.query(`
        SELECT chunk_type, COUNT(*) as count
        FROM calculator_embeddings
        GROUP BY chunk_type
        ORDER BY count DESC
      `);

      if (VERBOSE) {
        console.log('  Breakdown by chunk type:');
        for (const row of typeResult.rows) {
          console.log(`    ${row.chunk_type}: ${row.count}`);
        }
      }
    }
  });

  // Step 5: Quick performance test
  await step('Performance test: sample vector search', async () => {
    // Create a dummy embedding vector (1536 dimensions)
    const dummyEmbedding = '[' + Array(1536).fill(0.1).join(',') + ']';

    const startTime = Date.now();
    const result = await pool.query(`
      SELECT
        calculator_slug,
        chunk_type,
        content,
        embedding <-> $1::vector AS distance
      FROM calculator_embeddings
      ORDER BY embedding <-> $1::vector
      LIMIT 3
    `, [dummyEmbedding]);

    const elapsedMs = Date.now() - startTime;

    if (result.rows.length === 0) {
      await log('Performance test', 'No embeddings to test', 'warn');
    } else if (elapsedMs < 100) {
      await log('Performance test', `${elapsedMs}ms (✓ PASS: <100ms)`, 'success');
      if (VERBOSE) {
        console.log('  Sample results:');
        for (const row of result.rows) {
          console.log(`    ${row.calculator_slug} (${row.chunk_type}): distance=${row.distance.toFixed(4)}`);
        }
      }
    } else {
      await log('Performance test', `${elapsedMs}ms (⚠ WARN: >100ms, may need index optimization)`, 'warn');
    }
  });

  // Summary
  console.log('\n' + '='.repeat(60));
  if (exitCode === 0) {
    console.log('✅ RAG infrastructure is ready for deployment');
    console.log('\nNext steps:');
    console.log('1. Deploy optimized rag-retrieval.ts to production');
    console.log('2. Verify /api/ai-advisor/retrieve endpoint works');
    console.log('3. Monitor performance metrics (target: <100ms p50)');
  } else {
    console.log('⚠️  Some issues found. Review above for details.');
  }

  await pool.end();
  process.exit(exitCode);
}

main().catch(error => {
  console.error('Fatal error:', error);
  if (pool) pool.end();
  process.exit(2);
});
