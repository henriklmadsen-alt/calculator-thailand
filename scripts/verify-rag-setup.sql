-- CAL-1394: Verify RAG retrieval infrastructure
-- This script checks database setup for pgvector-based RAG retrieval

-- 1. Check if pgvector extension is installed
SELECT
  extname,
  extversion,
  'pgvector extension installed' as status
FROM pg_extension
WHERE extname = 'vector';

-- If pgvector is missing, install it with:
-- CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Check calculator_embeddings table exists and structure
\d calculator_embeddings

-- 3. Check table row count
SELECT
  COUNT(*) as total_chunks,
  COUNT(DISTINCT calculator_slug) as unique_calculators,
  COUNT(DISTINCT chunk_type) as chunk_types
FROM calculator_embeddings;

-- 4. Show chunk type distribution
SELECT
  chunk_type,
  COUNT(*) as count
FROM calculator_embeddings
GROUP BY chunk_type
ORDER BY count DESC;

-- 5. Show top 5 calculators by embedding count
SELECT
  calculator_slug,
  COUNT(*) as chunk_count
FROM calculator_embeddings
GROUP BY calculator_slug
ORDER BY chunk_count DESC
LIMIT 5;

-- 6. Check if ivfflat index exists on embedding column
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'calculator_embeddings'
AND indexname LIKE '%embedding%';

-- If index doesn't exist, create it with:
-- CREATE INDEX CONCURRENTLY idx_calculator_embeddings_embedding_ivfflat
--   ON calculator_embeddings
--   USING ivfflat (embedding vector_cosine_ops)
--   WITH (lists = 100);

-- 7. Sample one embedding (verify it's properly stored)
SELECT
  calculator_slug,
  chunk_type,
  chunk_index,
  content,
  embedding[1:5] as first_5_dims,  -- Show first 5 dimensions
  array_length(embedding, 1) as embedding_dimension,
  created_at
FROM calculator_embeddings
LIMIT 1;

-- 8. Quick performance test query
-- This should use the ivfflat index if it exists
-- Expected time: <15ms (vs 100ms+ without index)
EXPLAIN ANALYZE
SELECT
  calculator_slug,
  chunk_type,
  chunk_index,
  content,
  embedding <-> '[0.1, -0.2, 0.05, ...]'::vector AS distance
FROM calculator_embeddings
ORDER BY embedding <-> '[0.1, -0.2, 0.05, ...]'::vector
LIMIT 3;
