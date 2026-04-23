#!/usr/bin/env node

/**
 * Calculator Content Embedder Script
 *
 * Reads calculator page content from src/pages, chunks by section (formula,
 * description, examples, FAQ), generates vector embeddings using OpenAI
 * text-embedding-3-small (1536 dimensions), and upserts into calculator_embeddings table.
 *
 * Handles Thai text correctly. Progress logging. Deduplicates on (calculator_slug, chunk_type, chunk_index).
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." OPENAI_API_KEY="sk-..." node embed-calculator-content.mjs [--calculator-slug <slug>]
 *
 * If no slug provided, embeds all calculators found in src/pages.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import postgres from 'pg';

const { Pool } = postgres;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.join(__dirname, '..');

// ============================================================================
// Configuration
// ============================================================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const DRY_RUN = process.argv.includes('--dry-run');
const TARGET_SLUG = process.argv[process.argv.indexOf('--calculator-slug') + 1] || null;

if (!DRY_RUN && !OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY environment variable not set');
  process.exit(1);
}

if (!DRY_RUN && !DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable not set');
  process.exit(1);
}

// ============================================================================
// Database Connection
// ============================================================================

let pool = null;

if (!DRY_RUN) {
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('railway') || DATABASE_URL.includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : false,
    max: 5,
  });

  pool.on('error', (err) => {
    console.error('[db] unexpected client error:', err.message);
  });
}

// ============================================================================
// Helper: Initialize embeddings table if needed
// ============================================================================

async function ensureEmbeddingsTable() {
  if (DRY_RUN) {
    console.log('✓ [DRY-RUN] Skipping database setup');
    return;
  }
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  try {
    await pool.query(`
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
    console.log('✓ calculator_embeddings table ready');
  } catch (err) {
    console.error('Failed to initialize embeddings table:', err.message);
    throw err;
  }
}

// ============================================================================
// Helper: Extract calculator slug from directory path
// ============================================================================

function extractCalculatorSlug(dirPath) {
  // Extract from path like "src/pages/คำนวณ-apr" → "คำนวณ-apr"
  const parts = dirPath.split(path.sep);
  const calculatorDir = parts[parts.length - 1];
  if (calculatorDir === 'pages') return null;
  return calculatorDir || null;
}

// ============================================================================
// Helper: Parse Astro file and extract sections
// ============================================================================

function parseAstroContent(content) {
  const sections = {
    description: '',
    faq: [],
    examples: [],
    formula: '',
  };

  // Extract description from frontmatter
  const pageDescMatch = content.match(/const pageDescription = ['"]([^'"]*)['"]/);
  if (pageDescMatch) {
    sections.description = pageDescMatch[1];
  }

  // Extract FAQ data
  const faqMatch = content.match(/const faqData = \[([\s\S]*?)\];/);
  if (faqMatch) {
    try {
      // Simple extraction of FAQ Q&A pairs
      const faqBlock = faqMatch[1];
      const qMatches = faqBlock.matchAll(/question:\s*['"]([^'"]*)['"]/g);
      const aMatches = faqBlock.matchAll(/answer:\s*['"]([^'"]*)['"]/g);

      const questions = Array.from(qMatches, (m) => m[1]);
      const answers = Array.from(aMatches, (m) => m[1]);

      for (let i = 0; i < questions.length; i++) {
        sections.faq.push({
          question: questions[i],
          answer: answers[i] || '',
        });
      }
    } catch (err) {
      // Silently skip if FAQ parsing fails
    }
  }

  // Extract h2 sections (examples, formulas, etc.)
  const h2Regex = /<h2[^>]*>([^<]*)<\/h2>([\s\S]*?)(?=<h2|<\/article>|$)/g;
  let match;
  while ((match = h2Regex.exec(content)) !== null) {
    const heading = match[1].toLowerCase();
    const sectionContent = match[2];

    if (heading.includes('formula') || heading.includes('สูตร')) {
      sections.formula += sectionContent + '\n';
    } else if (heading.includes('example') || heading.includes('ตัวอย่าง')) {
      sections.examples.push(sectionContent.trim());
    }
  }

  return sections;
}

// ============================================================================
// Helper: Process and upsert a single embedding
// ============================================================================

async function processAndUpsert(calculatorSlug, chunkType, chunkIndex, content) {
  if (!content || content.trim().length === 0) {
    return { success: false, tokensUsed: 0 };
  }

  try {
    let embedding;
    let tokensUsed;

    if (DRY_RUN) {
      // Dry-run: create dummy embedding
      embedding = Array(1536).fill(0.001);
      tokensUsed = 10;
      console.log(`    [DRY-RUN] Would embed ${content.length} chars (${tokensUsed} tokens)`);
    } else {
      const result = await generateEmbedding(content);
      embedding = result.embedding;
      tokensUsed = result.tokensUsed;
      await upsertEmbedding(calculatorSlug, chunkType, chunkIndex, content, embedding, tokensUsed);
    }

    return { success: true, tokensUsed };
  } catch (err) {
    console.error(`    ✗ Failed: ${err.message}`);
    return { success: false, tokensUsed: 0 };
  }
}

// ============================================================================
// Helper: Generate embedding using OpenAI API
// ============================================================================

async function generateEmbedding(text) {
  if (!text || text.trim().length === 0) {
    console.warn('⚠️  Skipping empty text for embedding');
    return { embedding: null, tokensUsed: 0 };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
        dimensions: 1536,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API failed: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const embedding = data.data[0]?.embedding;
    const tokensUsed = data.usage?.total_tokens || 0;

    if (!embedding) {
      throw new Error('No embedding returned from OpenAI API');
    }

    return { embedding, tokensUsed };
  } catch (err) {
    console.error('Failed to generate embedding:', err.message);
    throw err;
  }
}

// ============================================================================
// Helper: Upsert embedding into database
// ============================================================================

async function upsertEmbedding(calculatorSlug, chunkType, chunkIndex, content, embedding, tokensUsed) {
  try {
    const result = await pool.query(
      `INSERT INTO calculator_embeddings (calculator_slug, chunk_type, chunk_index, content, embedding, tokens_used)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (calculator_slug, chunk_type, chunk_index) DO UPDATE
         SET content = EXCLUDED.content,
             embedding = EXCLUDED.embedding,
             tokens_used = EXCLUDED.tokens_used,
             updated_at = NOW()
       RETURNING id`,
      [calculatorSlug, chunkType, chunkIndex, content, JSON.stringify(embedding), tokensUsed]
    );
    return result.rows[0]?.id;
  } catch (err) {
    console.error(`Failed to upsert embedding for ${calculatorSlug}/${chunkType}/${chunkIndex}:`, err.message);
    throw err;
  }
}

// ============================================================================
// Main: Process calculator
// ============================================================================

async function processCalculator(calculatorPath) {
  const calculatorSlug = extractCalculatorSlug(calculatorPath);
  if (!calculatorSlug) return;

  // Filter by slug if specified
  if (TARGET_SLUG && calculatorSlug !== TARGET_SLUG) {
    return;
  }

  console.log(`\n📄 Processing: ${calculatorSlug}`);

  const indexPath = path.join(calculatorPath, 'index.astro');

  try {
    const content = await fs.readFile(indexPath, 'utf-8');
    const sections = parseAstroContent(content);

    let embeddingCount = 0;
    let totalTokens = 0;

    // Embed description
    if (sections.description && sections.description.length > 0) {
      console.log('  → Description');
      const result = await processAndUpsert(calculatorSlug, 'description', 0, sections.description);
      if (result.success) {
        embeddingCount++;
        totalTokens += result.tokensUsed;
      }
    }

    // Embed formula
    if (sections.formula && sections.formula.length > 0) {
      console.log('  → Formula');
      const result = await processAndUpsert(calculatorSlug, 'formula', 0, sections.formula);
      if (result.success) {
        embeddingCount++;
        totalTokens += result.tokensUsed;
      }
    }

    // Embed examples
    for (let i = 0; i < sections.examples.length; i++) {
      if (sections.examples[i] && sections.examples[i].length > 0) {
        console.log(`  → Example ${i + 1}`);
        const result = await processAndUpsert(calculatorSlug, 'examples', i, sections.examples[i]);
        if (result.success) {
          embeddingCount++;
          totalTokens += result.tokensUsed;
        }
      }
    }

    // Embed FAQ
    for (let i = 0; i < sections.faq.length; i++) {
      const faqItem = sections.faq[i];
      if (faqItem.question && faqItem.answer) {
        const faqText = `Q: ${faqItem.question}\nA: ${faqItem.answer}`;
        console.log(`  → FAQ ${i + 1}`);
        const result = await processAndUpsert(calculatorSlug, 'faq', i, faqText);
        if (result.success) {
          embeddingCount++;
          totalTokens += result.tokensUsed;
        }
      }
    }

    console.log(`✅ ${calculatorSlug}: ${embeddingCount} embeddings created (${totalTokens} tokens)`);
  } catch (err) {
    console.error(`❌ Failed to process ${calculatorSlug}:`, err.message);
  }
}

// ============================================================================
// Main: Find and process all calculators
// ============================================================================

async function findCalculatorPaths() {
  const pagesDir = path.join(APP_ROOT, 'src', 'pages');

  try {
    const entries = await fs.readdir(pagesDir, { withFileTypes: true });
    const calculatorPaths = entries
      .filter((entry) => entry.isDirectory() && entry.name.startsWith('คำนวณ'))
      .map((entry) => path.join(pagesDir, entry.name));

    return calculatorPaths;
  } catch (err) {
    console.error('Failed to read pages directory:', err.message);
    return [];
  }
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  console.log('🚀 Calculator Content Embedder\n');

  try {
    // Ensure embeddings table exists
    await ensureEmbeddingsTable();

    // Find calculators
    const calculatorPaths = await findCalculatorPaths();
    if (calculatorPaths.length === 0) {
      console.warn('⚠️  No calculators found in src/pages');
      process.exit(0);
    }

    console.log(`📊 Found ${calculatorPaths.length} calculator(s)\n`);

    // Process each calculator
    for (const calcPath of calculatorPaths) {
      await processCalculator(calcPath);
    }

    console.log('\n✨ Embedding complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Fatal error:', err.message);
    process.exit(1);
  } finally {
    if (!DRY_RUN) {
      await pool.end();
    }
  }
}

main();
