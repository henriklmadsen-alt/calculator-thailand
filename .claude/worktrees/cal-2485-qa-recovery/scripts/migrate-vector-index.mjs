#!/usr/bin/env node

/**
 * Database Migration: Create pgvector ivfflat Index for RAG Performance
 *
 * This script:
 * 1. Verifies pgvector extension is installed
 * 2. Creates ivfflat index on calculator_embeddings.embedding
 * 3. Verifies index creation
 *
 * Usage:
 *   node scripts/migrate-vector-index.mjs [--database-url=<url>]
 *
 * Environment:
 *   DATABASE_URL: PostgreSQL connection string
 */

import postgres from 'pg';

const { Pool } = postgres;

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL || process.argv
    .find(arg => arg.startsWith('--database-url='))
    ?.split('=')[1];

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not provided. Set environment variable or use --database-url=<url>');
    process.exit(1);
  }

  console.log('\n🔧 CAL-1311: Vector Index Migration');
  console.log('='.repeat(60));
  console.log('Creating pgvector ivfflat index for RAG retrieval optimization\n');

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('railway') || databaseUrl.includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : false,
  });

  try {
    // Step 1: Verify pgvector extension
    console.log('📋 Step 1: Verifying pgvector extension...');
    const extResult = await pool.query(
      `SELECT extname FROM pg_extension WHERE extname = 'vector'`
    );

    if (extResult.rows.length === 0) {
      console.log('⚠️  pgvector extension not found. Attempting to create...');
      try {
        await pool.query(`CREATE EXTENSION IF NOT EXISTS vector`);
        console.log('✅ pgvector extension created');
      } catch (error) {
        console.error('❌ Failed to create pgvector extension');
        console.error('   This requires superuser privileges on the database');
        console.error('   Contact your database administrator or Railway support');
        throw error;
      }
    } else {
      console.log('✅ pgvector extension already installed');
    }

    // Step 2: Verify calculator_embeddings table exists
    console.log('\n📋 Step 2: Verifying calculator_embeddings table...');
    const tableResult = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'calculator_embeddings')`
    );

    if (!tableResult.rows[0].exists) {
      console.error('❌ calculator_embeddings table not found');
      process.exit(1);
    }
    console.log('✅ calculator_embeddings table exists');

    // Step 3: Check embedding column type
    console.log('\n📋 Step 3: Checking embedding column type...');
    const colResult = await pool.query(
      `
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'calculator_embeddings' AND column_name = 'embedding'
      `
    );

    if (colResult.rows.length === 0) {
      console.error('❌ embedding column not found in calculator_embeddings table');
      process.exit(1);
    }

    const { data_type, udt_name } = colResult.rows[0];
    console.log(`✅ embedding column found (type: ${data_type || udt_name})`);

    // Step 4: Check for existing index
    console.log('\n📋 Step 4: Checking for existing vector index...');
    const indexResult = await pool.query(
      `
      SELECT indexname FROM pg_indexes
      WHERE tablename = 'calculator_embeddings'
      AND indexname LIKE '%embedding%'
      `
    );

    if (indexResult.rows.length > 0) {
      console.log(`⚠️  Vector index already exists: ${indexResult.rows[0].indexname}`);
      console.log('   Dropping old index before creating new one...');
      await pool.query(
        `DROP INDEX IF EXISTS ${indexResult.rows[0].indexname}`
      );
      console.log('✅ Old index dropped');
    }

    // Step 5: Create ivfflat index
    console.log('\n📋 Step 5: Creating ivfflat index...');
    console.log('   (This may take 1-5 minutes depending on data size)');

    const startTime = Date.now();

    try {
      // Using vector_cosine_ops for cosine similarity (matching <-> operator)
      // lists parameter tuned for ~1000 embeddings (sqrt(1000) ≈ 32, using 50 for balance)
      await pool.query(
        `
        CREATE INDEX CONCURRENTLY idx_calculator_embeddings_embedding_ivfflat
        ON calculator_embeddings
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 50)
        `
      );

      const duration = Date.now() - startTime;
      console.log(`✅ ivfflat index created successfully (${(duration / 1000).toFixed(1)}s)`);
    } catch (error) {
      // Fallback to non-concurrent creation if CONCURRENTLY fails
      if (error.message.includes('CONCURRENTLY')) {
        console.log('⚠️  CONCURRENTLY not supported, trying standard CREATE INDEX...');
        await pool.query(
          `
          CREATE INDEX idx_calculator_embeddings_embedding_ivfflat
          ON calculator_embeddings
          USING ivfflat (embedding vector_cosine_ops)
          WITH (lists = 50)
          `
        );
        console.log('✅ ivfflat index created (note: application may have been locked briefly)');
      } else {
        throw error;
      }
    }

    // Step 6: Verify index was created
    console.log('\n📋 Step 6: Verifying index creation...');
    const verifyResult = await pool.query(
      `
      SELECT indexname, indexdef FROM pg_indexes
      WHERE tablename = 'calculator_embeddings'
      AND indexname = 'idx_calculator_embeddings_embedding_ivfflat'
      `
    );

    if (verifyResult.rows.length === 0) {
      console.error('❌ Index verification failed');
      process.exit(1);
    }

    console.log('✅ Index verified successfully');
    console.log(`   Name: ${verifyResult.rows[0].indexname}`);

    // Step 7: Check index size and statistics
    console.log('\n📋 Step 7: Gathering index statistics...');
    const statsResult = await pool.query(
      `
      SELECT
        schemaname,
        tablename,
        indexname,
        idx_scan as index_scans,
        idx_tup_read as tuples_read,
        idx_tup_fetch as tuples_fetched
      FROM pg_stat_user_indexes
      WHERE indexname = 'idx_calculator_embeddings_embedding_ivfflat'
      `
    );

    if (statsResult.rows.length > 0) {
      const stats = statsResult.rows[0];
      console.log('✅ Index statistics:');
      console.log(`   Index scans: ${stats.index_scans || 0}`);
      console.log(`   Tuples read: ${stats.tuples_read || 0}`);
    }

    // Step 8: Test query performance
    console.log('\n📋 Step 8: Testing query performance...');
    console.log('   Running test query with EXPLAIN ANALYZE...');

    // Create a test embedding (all zeros for consistency)
    const testEmbedding = new Array(1536).fill(0);
    const testEmbeddingStr = `[${testEmbedding.join(',')}]`;

    const explainResult = await pool.query(
      `
      EXPLAIN ANALYZE
      SELECT
        calculator_slug,
        chunk_type,
        embedding <-> $1::vector AS distance
      FROM calculator_embeddings
      ORDER BY embedding <-> $1::vector
      LIMIT 3
      `,
      [testEmbeddingStr]
    );

    console.log('✅ Test query executed. Plan:');
    explainResult.rows.forEach(row => {
      console.log(`   ${row['QUERY PLAN']}`);
    });

    // Check if plan uses the index
    const planText = explainResult.rows.map(r => r['QUERY PLAN']).join(' ');
    if (planText.includes('ivfflat')) {
      console.log('\n✅ EXCELLENT: Query plan uses ivfflat index!');
    } else {
      console.log('\n⚠️  WARNING: Query plan may not be using the ivfflat index');
      console.log('   The index may need time to be recognized by the query planner');
      console.log('   Or the optimizer may prefer sequential scan for small tables');
    }

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ Migration completed successfully!');
    console.log('='.repeat(60));
    console.log('\nNext steps:');
    console.log('1. Update src/lib/rag-retrieval.ts to use optimized version');
    console.log('   (or replace with src/lib/rag-retrieval-optimized.ts)');
    console.log('2. Run RAG performance benchmark:');
    console.log('   node scripts/benchmark-rag-retrieval.mjs');
    console.log('3. Verify targets are met:');
    console.log('   - p50 latency < 100ms');
    console.log('   - p99 latency < 300ms');
    console.log('4. Run QA tests (CAL-1307 / CAL-1295) to ensure quality');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration
runMigration();
