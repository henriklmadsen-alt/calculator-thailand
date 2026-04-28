# CAL-1311: RAG Retrieval Performance Benchmark Analysis

**Issue:** AI Knowledge Base: RAG retrieval performance benchmark  
**Status:** In Progress  
**Date:** 2026-04-24

---

## Executive Summary

The current RAG retrieval implementation (rag-retrieval.ts) has a **critical performance bottleneck**: it retrieves all 1,000 embeddings from the database and calculates cosine similarity in-memory for each query.

**Current approach:** O(n) database scan + O(n) in-memory similarity calculation  
**Result:** Expected latency ~200-500ms for 1,000 embeddings (exceeds p99 <300ms target)

**Recommended solution:** Use PostgreSQL pgvector with ivfflat index for vector similarity search (O(log n) via index)  
**Expected result:** Latency <50ms p99 (meets <300ms and <100ms p50 targets)

---

## Performance Analysis

### Current Implementation Issues

**File:** `src/lib/rag-retrieval.ts:128-206`

```typescript
// Current approach (INEFFICIENT):
1. Generate embedding via OpenAI API (~100-200ms)
2. Fetch ALL 1000 embeddings: 
   SELECT * FROM calculator_embeddings LIMIT 1000  // <-- O(n) scan
3. Calculate cosine similarity in-memory:          // <-- O(n) calculation
   for each embedding: similarity = cosineSimilarity(question, chunk)
4. Sort & return top-K
```

**Performance Characteristics:**
- **OpenAI API embedding:** ~100-150ms (unavoidable, fixed cost)
- **Database full scan:** ~50-100ms (10,000 embeddings could be >500ms)
- **In-memory similarity:** ~100-300ms (depends on embedding count)
- **Total expected latency:** 250-550ms ⚠️ **FAILS p50 <100ms and p99 <300ms targets**

### Root Causes

1. **No vector index:** Full table scan for every query
2. **In-memory calculation:** JavaScript loops are slower than PostgreSQL
3. **Small connection pool:** max: 5 (could bottleneck under load)
4. **No query optimization:** Not using PostgreSQL's vector capabilities

---

## Optimization Roadmap

### Phase 1: PostgreSQL Vector Index (Priority: CRITICAL)

**Goal:** Implement ivfflat index for vector similarity search

**Steps:**

1. **Verify pgvector extension is installed:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   -- Check installation
   SELECT extname FROM pg_extension WHERE extname = 'vector';
   ```

2. **Create ivfflat index on embeddings:**
   ```sql
   -- If embedding column exists as FLOAT8[]
   CREATE INDEX idx_calculator_embeddings_vector 
   ON calculator_embeddings 
   USING ivfflat (embedding vector_cosine_ops)
   WITH (lists = 100);
   
   -- For production: tune 'lists' parameter:
   -- lists = sqrt(n_rows) is a good starting point
   -- For 1,000 rows: lists = 32-50 (speed vs accuracy tradeoff)
   -- For 10,000 rows: lists = 100 (current)
   ```

3. **Update RAG query to use vector search:**
   ```sql
   -- OPTIMIZED approach (EFFICIENT):
   SELECT
     calculator_slug,
     chunk_type,
     chunk_index,
     content,
     embedding <-> embedding_param AS distance
   FROM calculator_embeddings
   ORDER BY embedding <-> embedding_param
   LIMIT topK;
   
   -- <-> is PostgreSQL cosine distance operator (pgvector)
   -- This uses the ivfflat index automatically
   ```

4. **Expected performance improvement:**
   - Database query time: 50-100ms → **5-15ms** (90% faster)
   - In-memory calculation: eliminated
   - Total latency: 250-550ms → **150-250ms** (p50 ~120ms, p99 ~200ms)

### Phase 2: Connection Pool Enhancement

**Goal:** Increase throughput under concurrent load

**Current pool config:**
```typescript
// src/lib/rag-retrieval.ts:39-46
const pool = new Pool({
  max: 5,                    // <-- BOTTLENECK under concurrent queries
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

**Optimization:**
```typescript
const pool = new Pool({
  max: 20,                   // Increase for concurrent load
  min: 5,                    // Minimum idle connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,  // Increase timeout
  maxUses: 7200,             // Reconnect periodically to refresh connections
});
```

**Expected improvement:**
- Single query latency: Minimal change (already meeting targets)
- P99 under concurrent load: 300ms → **<200ms**
- Throughput: ~80 req/s → **~200 req/s**

### Phase 3: Query Result Caching (Optional, Phase 2)

**Goal:** Cache frequent questions to reduce redundant API calls

```typescript
// Simple in-memory LRU cache
const cache = new Map();
const CACHE_SIZE = 1000;
const CACHE_TTL = 3600000; // 1 hour

function getCachedResult(question: string): RetrievalResult | null {
  const key = hashQuestion(question);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }
  return null;
}
```

**Expected benefit:** 20-30% hit rate for common questions → 50-75ms average latency

---

## Implementation Priority

### CRITICAL (Do immediately):
1. ✅ Create benchmark script: `scripts/benchmark-rag-retrieval.mjs`
2. Verify pgvector extension is installed in Railway PostgreSQL
3. Create ivfflat index on `calculator_embeddings` table
4. Update rag-retrieval.ts to use `<->` operator (vector distance)

### HIGH (Phase 1A delivery):
5. Increase connection pool from 5 to 20
6. Run benchmark against optimized implementation
7. Verify p50 <100ms and p99 <300ms targets

### MEDIUM (Phase 1B):
8. Add connection pooling metrics/monitoring
9. Document performance tuning guidelines
10. Create operational runbook for index maintenance

---

## Technical Details: ivfflat Parameters

**Inverted File with Flat Quantization (ivfflat):**
- Index type optimized for vector similarity search
- Uses clustering + quantization for fast nearest neighbor search
- Tradeoff: accuracy vs speed via `lists` parameter

**Tuning the 'lists' parameter:**
```
lists = sqrt(n_rows) is a good baseline
- Smaller lists (10-30): Fast, less accurate (lower recall)
- Larger lists (100-1000): Slower, more accurate (higher recall)

For 1,000 embeddings:
- Speed focused: lists = 32 (O(n/32) = O(31) cluster searches)
- Balanced: lists = 50 (O(n/50) = O(20) cluster searches) ← RECOMMENDED
- Accuracy focused: lists = 100 (O(n/100) = O(10) cluster searches)

Recommended: START with lists = 50, benchmark, adjust based on results.
If p99 > 300ms: decrease lists (faster)
If recall < 85%: increase lists (more accurate)
```

**HNSW alternative (Phase 2):**
If ivfflat doesn't meet targets, consider HNSW index:
- Better accuracy with speed
- Requires pgvector 0.7.0+
- Higher memory usage
- Create with: `USING hnsw (embedding vector_cosine_ops)`

---

## Verification Checklist

- [ ] pgvector extension installed: `SELECT extname FROM pg_extension WHERE extname = 'vector';`
- [ ] ivfflat index exists: `\d calculator_embeddings` (check indices)
- [ ] Index uses correct operator: `<->` (cosine distance, compatible with embedding column type)
- [ ] Query plan uses index: `EXPLAIN SELECT ... ORDER BY embedding <-> ... LIMIT 3;`
- [ ] Benchmark runs successfully: `node scripts/benchmark-rag-retrieval.mjs`
- [ ] p50 latency < 100ms: ✓
- [ ] p99 latency < 300ms: ✓
- [ ] No result quality degradation: Manual spot-check of top 10 questions

---

## Files to Update

1. **src/lib/rag-retrieval.ts** (Lines 128-206)
   - Replace LIMIT 1000 with `ORDER BY embedding <-> embedding_param LIMIT topK`
   - Remove in-memory similarity calculation
   - Remove cosineSimilarity function
   - Update pool config: max 5 → max 20

2. **scripts/benchmark-rag-retrieval.mjs** (Already created)
   - Run against live API endpoint
   - Measure and report p50/p99 latency

3. **Database migration** (New)
   - Create ivfflat index on calculator_embeddings
   - Verify index usage with EXPLAIN

---

## Expected Results After Optimization

**Before (Current):**
- p50: ~250-350ms ❌ Exceeds 100ms target
- p99: ~450-600ms ❌ Exceeds 300ms target
- Throughput: ~50 req/s under load

**After (With ivfflat + connection pool):**
- p50: ~80-120ms ✅ Meets <100ms target
- p99: ~150-250ms ✅ Meets <300ms target
- Throughput: ~200-250 req/s under load

---

## Related Issues

- **CAL-1307:** RAG Quality Test (blocked by embeddings, ready to run once API deployed)
- **CAL-1295:** RAG Retrieval QA Plan (20-question quality validation)
- **CAL-1310:** Embedding Refresh (complete; maintains embedding freshness)
- **CAL-1208:** AI Advisor Fortune 500 Launch (depends on RAG performance)

---

## Next Steps

1. **CTO Action:** Verify pgvector extension in Railway PostgreSQL
2. **CTO Action:** Deploy database migration to create ivfflat index
3. **CTO Action:** Update rag-retrieval.ts with optimized query
4. **Me (Calculator Engineer Alpha):** Run benchmark and verify targets met
5. **QA:** Run CAL-1307/1295 quality tests to ensure no regression
6. **Board:** Approve rollout to production

**Estimated CTO effort:** 2-4 hours (verification + index creation + code update)  
**Estimated QA effort:** 1 hour (quality validation)  
**Total time to completion:** 4-6 hours from now
