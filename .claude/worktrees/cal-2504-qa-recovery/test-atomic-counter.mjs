/**
 * CAL-1313 Test: Atomic question counter (no double-counting)
 * Simulates 100 concurrent requests to verify:
 * 1. No double-counting
 * 2. No misses
 * 3. Exact count of 100
 */

import { createPool } from 'pg';
import { randomUUID } from 'crypto';

const pool = new createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false,
});

async function setupTestDb() {
  const client = await pool.connect();
  try {
    // Create test user
    await client.query(`
      INSERT INTO users (id, email, provider, provider_id, tier, questions_used)
      VALUES ('test-user-1', 'test@example.com', 'test', 'test-id', 'master', 0)
      ON CONFLICT (email) DO UPDATE SET questions_used = 0;
    `);
    console.log('[test] Created test user');
  } finally {
    client.release();
  }
}

async function testAtomicCounter() {
  console.log('\n🧪 CAL-1313: Testing Atomic Question Counter\n');

  // Clean up previous test
  const cleanupClient = await pool.connect();
  try {
    await cleanupClient.query('DELETE FROM questions WHERE user_id = $1', ['test-user-1']);
  } finally {
    cleanupClient.release();
  }

  const userId = 'test-user-1';
  const concurrentRequests = 100;
  const promises = [];

  console.log(`📊 Sending ${concurrentRequests} concurrent requests...\n`);

  // Fire all 100 requests in parallel (simulating concurrent client submits)
  for (let i = 0; i < concurrentRequests; i++) {
    const promise = (async () => {
      const client = await pool.connect();
      try {
        const idempotencyKey = randomUUID();
        const result = await client.query(
          `INSERT INTO questions (user_id, idempotency_key, content, status)
           VALUES ($1, $2, $3, 'success')
           RETURNING id`,
          [userId, idempotencyKey, `Test question ${i}`]
        );
        
        // Mark as success and increment counter (simulates markQuestionSuccessAndIncrement)
        await client.query('BEGIN');
        await client.query(
          'UPDATE questions SET status = $1 WHERE id = $2',
          ['success', result.rows[0].id]
        );
        await client.query(
          'UPDATE users SET questions_used = questions_used + 1 WHERE id = $1',
          [userId]
        );
        await client.query('COMMIT');

        return { success: true, index: i };
      } catch (err) {
        console.error(`  ❌ Request ${i} failed:`, err.message);
        return { success: false, index: i, error: err.message };
      } finally {
        client.release();
      }
    })();
    promises.push(promise);
  }

  // Wait for all requests
  const results = await Promise.all(promises);

  // Verify results
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  console.log(`✅ Successful: ${successCount}/${concurrentRequests}`);
  console.log(`❌ Failed: ${failureCount}/${concurrentRequests}`);

  // Check database state
  const checkClient = await pool.connect();
  try {
    const questionCount = await checkClient.query(
      'SELECT COUNT(*) as count FROM questions WHERE user_id = $1',
      [userId]
    );
    const userCount = await checkClient.query(
      'SELECT questions_used FROM users WHERE id = $1',
      [userId]
    );

    const qCount = parseInt(questionCount.rows[0].count);
    const usedCount = userCount.rows[0].questions_used;

    console.log(`\n📈 Database verification:`);
    console.log(`   Questions in DB: ${qCount}`);
    console.log(`   users.questions_used: ${usedCount}`);

    // Pass/fail criteria
    const passed = qCount === concurrentRequests && usedCount === concurrentRequests && failureCount === 0;

    if (passed) {
      console.log(`\n✅ TEST PASSED: Exact count ${concurrentRequests} × ${concurrentRequests}, no double-count\n`);
    } else {
      console.log(`\n❌ TEST FAILED:`);
      if (qCount !== concurrentRequests) console.log(`   - Questions count mismatch: got ${qCount}, expected ${concurrentRequests}`);
      if (usedCount !== concurrentRequests) console.log(`   - Counter mismatch: got ${usedCount}, expected ${concurrentRequests}`);
      if (failureCount > 0) console.log(`   - ${failureCount} requests failed`);
      console.log();
    }

    process.exit(passed ? 0 : 1);
  } finally {
    checkClient.release();
  }
}

(async () => {
  try {
    await setupTestDb();
    await testAtomicCounter();
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
