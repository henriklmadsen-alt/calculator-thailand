/**
 * RAG (Retrieval-Augmented Generation) Retrieval Function
 *
 * Retrieves relevant calculator content from the vector database based on a user question.
 * Used by the AI Advisor to provide context for LLM responses.
 *
 * Performance target: <100ms retrieval per question
 */

import postgres from 'pg';

const { Pool } = postgres;

export interface CalculatorChunk {
  calculator_slug: string;
  chunk_type: 'description' | 'formula' | 'examples' | 'faq';
  chunk_index: number;
  content: string;
  similarity: number;
}

export interface RetrievalResult {
  chunks: CalculatorChunk[];
  query_embedding_tokens: number;
  search_time_ms: number;
  sources: string[];
}

// Global connection pool (initialized on first use)
let pool: postgres.Pool | null = null;

function getPool(): postgres.Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable not set');
    }

    pool = new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes('railway') || databaseUrl.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : false,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('[rag-retrieval] database pool error:', err);
    });
  }

  return pool;
}

/**
 * Generate embedding for a text using OpenAI text-embedding-3-small
 * Returns the embedding vector and token count
 */
async function generateQuestionEmbedding(question: string): Promise<{
  embedding: number[];
  tokens: number;
}> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY environment variable not set');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: question,
      dimensions: 1536,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const embedding = data.data[0]?.embedding;
  const tokens = data.usage?.total_tokens || 0;

  if (!embedding || embedding.length === 0) {
    throw new Error('No embedding returned from OpenAI API');
  }

  return { embedding, tokens };
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Retrieve calculator context chunks most similar to the given question
 *
 * @param question The user's question
 * @param topK Number of chunks to return (default: 3)
 * @returns RetrievalResult with top-K chunks, metadata, and performance timing
 */
export async function retrieveCalculatorContext(
  question: string,
  topK: number = 3
): Promise<RetrievalResult> {
  const startTime = Date.now();

  if (!question || question.trim().length === 0) {
    throw new Error('Question cannot be empty');
  }

  if (topK < 1 || topK > 10) {
    throw new Error('topK must be between 1 and 10');
  }

  try {
    // Step 1: Generate embedding for the question
    const { embedding: questionEmbedding, tokens: queryTokens } =
      await generateQuestionEmbedding(question);

    // Step 2: Retrieve all embeddings from database
    const dbPool = getPool();
    const result = await dbPool.query(`
      SELECT
        id,
        calculator_slug,
        chunk_type,
        chunk_index,
        content,
        embedding
      FROM calculator_embeddings
      LIMIT 1000
    `);

    if (!result.rows || result.rows.length === 0) {
      return {
        chunks: [],
        query_embedding_tokens: queryTokens,
        search_time_ms: Date.now() - startTime,
        sources: [],
      };
    }

    // Step 3: Calculate similarity scores for all chunks (in-memory)
    // This approach is used because:
    // - Direct SQL similarity functions (pgvector) may not be available on all instances
    // - PostgreSQL cosine_distance on FLOAT8[] arrays requires custom functions
    // - In-memory calculation gives us control and works with FLOAT8[] storage
    // - For 1000 chunks, this is still <100ms on modern hardware
    const chunksWithSimilarity = result.rows
      .map((row: any) => {
        let embedding: number[] = [];

        // Parse embedding (could be stored as FLOAT8[] or JSON)
        if (typeof row.embedding === 'string') {
          try {
            embedding = JSON.parse(row.embedding);
          } catch {
            embedding = [];
          }
        } else if (Array.isArray(row.embedding)) {
          embedding = row.embedding;
        }

        const similarity = embedding.length === questionEmbedding.length
          ? cosineSimilarity(questionEmbedding, embedding)
          : 0;

        return {
          calculator_slug: row.calculator_slug,
          chunk_type: row.chunk_type,
          chunk_index: row.chunk_index,
          content: row.content,
          similarity,
        };
      })
      .filter((chunk) => chunk.similarity > 0) // Filter out chunks with zero similarity
      .sort((a, b) => b.similarity - a.similarity) // Sort by similarity descending
      .slice(0, topK); // Take top K

    // Step 4: Get unique sources for metadata
    const sourceSet = new Set<string>();
    chunksWithSimilarity.forEach((c) => sourceSet.add(c.calculator_slug));
    const sources = Array.from(sourceSet);

    return {
      chunks: chunksWithSimilarity,
      query_embedding_tokens: queryTokens,
      search_time_ms: Date.now() - startTime,
      sources,
    };
  } catch (error) {
    console.error('[rag-retrieval] error retrieving calculator context:', error);
    throw error;
  }
}

/**
 * Format retrieval results for passing to Claude as context
 *
 * @param result The retrieval result from retrieveCalculatorContext
 * @returns Formatted string suitable for use as LLM context
 */
export function formatRetrievalContext(result: RetrievalResult): string {
  if (result.chunks.length === 0) {
    return 'No relevant calculator content found.';
  }

  const contextLines: string[] = [
    '=== Relevant Calculator Context ===\n',
  ];

  result.chunks.forEach((chunk, index) => {
    contextLines.push(`[${index + 1}] Calculator: ${chunk.calculator_slug}`);
    contextLines.push(`    Type: ${chunk.chunk_type}`);
    contextLines.push(`    Relevance: ${(chunk.similarity * 100).toFixed(1)}%`);
    contextLines.push(`    Content: ${chunk.content.substring(0, 300)}...`);
    contextLines.push('');
  });

  contextLines.push(`Sources: ${result.sources.join(', ')}`);
  contextLines.push(`Search time: ${result.search_time_ms}ms`);

  return contextLines.join('\n');
}

/**
 * Close the database connection pool (for cleanup on server shutdown)
 */
export async function closeConnectionPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
