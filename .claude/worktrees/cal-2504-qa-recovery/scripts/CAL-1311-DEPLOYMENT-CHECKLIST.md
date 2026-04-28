# CAL-1311: RAG Performance Optimization — Deployment Checklist

**Issue:** AI Knowledge Base: RAG retrieval performance benchmark  
**Owner:** CTO (implementation), Calculator Engineer Alpha (QA/benchmark)  
**Date:** 2026-04-24  
**Estimated effort:** 2-4 hours

---

## Pre-Deployment Verification

### Database Connectivity ✓

- [ ] Railway PostgreSQL is provisioned and accessible
- [ ] DATABASE_URL environment variable is set in Railway
- [ ] Test connection: `psql $DATABASE_URL -c "SELECT version();"`
- [ ] Verify table exists: `SELECT COUNT(*) FROM calculator_embeddings;`

### Prerequisites ✓

- [ ] pgvector extension installed on Railway PostgreSQL (or superuser access to install)
  - Test: `psql $DATABASE_URL -c "SELECT extname FROM pg_extension WHERE extname = 'vector';"`
  - If not installed: Contact Railway support or request superuser privileges

### Performance Baseline ✓

- [ ] Current RAG implementation is accessible
  - Current file: `src/lib/rag-retrieval.ts`
  - Current approach: O(n) full table scan + in-memory similarity (SLOW)
- [ ] Embeddings are populated in `calculator_embeddings` table
  - Expected: 500+ embeddings for Tier 1 calculators

---

## Implementation Steps

### Phase 1: Database Index Creation (1 hour)

**Estimated time: 30-60 minutes**

1. **Deploy pgvector ivfflat index:**
   ```bash
   # Local development:
   DATABASE_URL="your-railway-url" node scripts/migrate-vector-index.mjs
   
   # Or via psql directly:
   psql $DATABASE_URL <<'SQL'
   CREATE EXTENSION IF NOT EXISTS vector;
   CREATE INDEX CONCURRENTLY idx_calculator_embeddings_embedding_ivfflat
     ON calculator_embeddings
     USING ivfflat (embedding vector_cosine_ops)
     WITH (lists = 50);
   SQL
   ```

   - [ ] Index creation completes without errors
   - [ ] Index is visible in schema: `\d calculator_embeddings`
   - [ ] Index uses correct operator: `vector_cosine_ops`
   - [ ] Index uses lists=50 parameter (tuned for ~1000 embeddings)

2. **Verify index performance:**
   ```bash
   # Check index usage
   psql $DATABASE_URL <<'SQL'
   EXPLAIN ANALYZE
   SELECT * FROM calculator_embeddings
   ORDER BY embedding <-> '[0,0,0...]'::vector
   LIMIT 3;
   SQL
   ```

   - [ ] Query plan includes "ivfflat" index scan
   - [ ] Expected execution time: <50ms
   - [ ] Index scan is used (not sequential scan)

### Phase 2: Code Update (45 minutes)

**Estimated time: 30-60 minutes**

3. **Update RAG retrieval implementation:**

   **Option A: Replace with optimized version (RECOMMENDED)**
   ```bash
   # Backup original
   cp src/lib/rag-retrieval.ts src/lib/rag-retrieval.ts.backup
   
   # Deploy optimized version
   cp src/lib/rag-retrieval-optimized.ts src/lib/rag-retrieval.ts
   
   # Commit
   git add src/lib/rag-retrieval.ts
   git commit -m "CAL-1311: Optimize RAG retrieval with pgvector ivfflat index"
   ```

   **Option B: Manually update existing file**
   - [ ] Replace lines 128-206 in `src/lib/rag-retrieval.ts`
   - [ ] Update database query to use `<->` operator
   - [ ] Remove in-memory cosineSimilarity calculation
   - [ ] Update pool config: `max: 5` → `max: 20`
   - [ ] Update pool config: add `min: 5, maxUses: 7200`
   - [ ] Remove helper function: `cosineSimilarity()`

4. **Verify code changes:**
   - [ ] No breaking changes to API interface
   - [ ] Function signature is identical to original
   - [ ] Return type matches RetrievalResult interface
   - [ ] Error handling is preserved

5. **Build and test locally:**
   ```bash
   npm run build
   npm run test  # If tests exist
   ```

   - [ ] Build completes without errors
   - [ ] No TypeScript compilation errors
   - [ ] No new linter warnings

### Phase 3: Deployment to Railway (1 hour)

**Estimated time: 30-45 minutes**

6. **Create feature branch (if using branch-based deployment):**
   ```bash
   git checkout -b CAL-1311-rag-optimization
   git push -u origin CAL-1311-rag-optimization
   ```

   - [ ] Branch created and pushed
   - [ ] CI pipeline runs (if configured)
   - [ ] No build failures

7. **Deploy to Railway staging:**
   ```bash
   # If using Railway CLI:
   railway deploy --service api
   
   # Or push to staging branch:
   git push origin CAL-1311-rag-optimization:staging
   ```

   - [ ] Deployment starts and completes
   - [ ] No critical errors in deployment logs
   - [ ] API endpoint becomes accessible
   - [ ] DATABASE_URL is set in Railway environment
   - [ ] OPENAI_API_KEY is set in Railway environment

8. **Health check:**
   ```bash
   # Get Railway deployment URL
   RAILWAY_URL="https://your-railway-app.up.railway.app"
   
   # Test endpoint health
   curl -X POST "$RAILWAY_URL/api/ai-advisor/retrieve" \
     -H "Content-Type: application/json" \
     -d '{"question":"ภาษีเงินได้คืออะไร","topK":3}'
   ```

   - [ ] API responds with 200 status
   - [ ] Response includes `chunks` array
   - [ ] Response includes `search_time_ms` field
   - [ ] Response latency is reasonable (~200-300ms for first query)

---

## Performance Validation

### Benchmark Execution (1 hour)

**Estimated time: 20-30 minutes**

9. **Run performance benchmark:**
   ```bash
   # Against local dev server
   npm run dev &  # Start dev server in background
   sleep 5        # Wait for startup
   node scripts/benchmark-rag-retrieval.mjs --api-url=http://localhost:3000 --verbose
   
   # Or against Railway production
   RAILWAY_URL="https://your-railway-app.up.railway.app"
   node scripts/benchmark-rag-retrieval.mjs --api-url="$RAILWAY_URL"
   ```

   - [ ] Benchmark completes without errors
   - [ ] Results saved to `RAG-PERFORMANCE-BENCHMARK-RESULTS.json`
   - [ ] File contains latency statistics (p50, p99, min, max, avg)

10. **Verify performance targets:**
    ```bash
    # Check results
    cat RAG-PERFORMANCE-BENCHMARK-RESULTS.json | jq '.latency_stats'
    ```

    - [ ] p50 latency < 100ms ✓
    - [ ] p99 latency < 300ms ✓
    - [ ] min latency > 0ms
    - [ ] max latency reasonable (<500ms)
    - [ ] average latency < 150ms
    - [ ] successful queries: 100/100 or >95%

    **If performance targets are NOT met:**
    1. Check pgvector index usage: `EXPLAIN ANALYZE` on RAG query
    2. Verify index is being used (not sequential scan)
    3. Increase `lists` parameter if p99 is high but p50 is low (might indicate outliers)
    4. Decrease `lists` parameter if p50 is high (sacrifice accuracy for speed)
    5. Check database server resources (CPU, memory, disk I/O)

### Quality Validation (30 minutes)

11. **Run RAG quality tests (CAL-1307 / CAL-1295):**
    ```bash
    # This requires the API to be running
    # QA Engineer Alpha will run these tests:
    node scripts/test-rag-retrieval.mjs --api-url="$RAILWAY_URL" --verbose
    ```

    - [ ] 20 Thai test questions retrieve relevant calculators
    - [ ] Precision@3 >= 85% (at least 2 of top-3 are relevant)
    - [ ] Average relevance score >= 4.0 (on 1-5 scale)
    - [ ] No regression compared to previous results

12. **Manual spot-check (5 calculators):**
    ```bash
    # Test a few real questions manually
    curl -X POST "http://localhost:3000/api/ai-advisor/retrieve" \
      -H "Content-Type: application/json" \
      -d '{"question":"ภาษีเงินได้ของฉันจะเท่าไหร่ถ้ารายได้ 50000 บาท","topK":3}'
    ```

    - [ ] Salary/Income Tax calculator appears in results
    - [ ] Relevance score is high (>0.75)
    - [ ] Latency is reasonable (<150ms)

    Repeat for:
    - [ ] Mortgage calculator query
    - [ ] Vehicle loan query
    - [ ] BMI calculator query
    - [ ] VAT tax query

---

## Rollback Plan (If Needed)

If performance targets are not met after optimization:

```bash
# Quick rollback to previous version
git checkout main  # Or revert commit
git push origin main:production

# Or use backup
cp src/lib/rag-retrieval.ts.backup src/lib/rag-retrieval.ts
git commit -m "CAL-1311: Rollback to previous RAG implementation"
git push origin main:production
```

**Troubleshooting steps:**
1. Verify ivfflat index exists and is being used (EXPLAIN ANALYZE)
2. Check if embedding column type matches vector type (CREATE CAST if needed)
3. Verify connection pool is actually using the increased size
4. Profile slow queries: `EXPLAIN ANALYZE` on problematic queries
5. Check pgvector version: must support vector operators
6. Escalate to CTO if index creation fails or version mismatch

---

## Post-Deployment Monitoring

### Metrics to Track (Week 1)

13. **Monitor RAG API performance:**
    - [ ] Set up logging for `search_time_ms` in responses
    - [ ] Create dashboard for p50/p99 latency trends
    - [ ] Alert if p99 latency exceeds 500ms (regression indicator)

    ```javascript
    // In API response logging
    const searchTime = result.search_time_ms;
    if (searchTime > 100) {
      logger.warn(`[RAG] slow retrieval: ${searchTime}ms`);
    }
    ```

14. **Monitor database index health:**
    - [ ] Weekly: Check index size and maintenance status
    ```sql
    SELECT * FROM pg_stat_user_indexes
    WHERE indexname LIKE '%embedding%';
    ```
    - [ ] Monthly: Consider REINDEX if index becomes fragmented
    - [ ] Monitor index scan count (should be >100/day for active system)

15. **Monitor quality metrics:**
    - [ ] Track retrieval quality via AI Advisor feedback
    - [ ] If "not helpful" rate exceeds 5%, escalate to CAL-1307/1295 QA team
    - [ ] Periodically re-run quality tests (weekly)

---

## Sign-Off Checklist

**CTO:**
- [ ] Index creation verified
- [ ] Code update verified  
- [ ] Build passes
- [ ] Deployment to production completes
- [ ] Database connectivity verified

**Calculator Engineer Alpha (Performance):**
- [ ] Benchmark runs successfully
- [ ] p50 <100ms ✓
- [ ] p99 <300ms ✓
- [ ] Results saved to repository

**Release QA Engineer Alpha (Quality):**
- [ ] CAL-1307 quality tests pass
- [ ] CAL-1295 precision@3 >= 85%
- [ ] No regressions in retrieval quality
- [ ] Spot-check 5 questions manually

**Board/CMO (Final Approval):**
- [ ] All checklist items complete
- [ ] Ready to include in next release
- [ ] No blockers to CAL-1208 Fortune 500 launch

---

## Related Documentation

- **Performance Analysis:** `scripts/cal-1311-performance-analysis.md`
- **Optimized Implementation:** `src/lib/rag-retrieval-optimized.ts`
- **Migration Script:** `scripts/migrate-vector-index.mjs`
- **Benchmark Script:** `scripts/benchmark-rag-retrieval.mjs`
- **Quality Tests:** CAL-1307, CAL-1295
- **Related Issues:** CAL-1310 (embedding refresh), CAL-1208 (AI Advisor launch)

---

## Questions?

- **Performance issues?** Check `scripts/cal-1311-performance-analysis.md` troubleshooting section
- **Database issues?** Escalate to Railway support (pgvector extension)
- **Quality concerns?** Reach out to Release QA Engineer Alpha
- **Deployment issues?** Follow rollback plan and escalate to CTO
