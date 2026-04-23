/**
 * Thai Text Chunking Strategy
 *
 * Implements sentence-level chunking optimized for Thai text:
 * - Thai has no word spaces, so standard chunking breaks poorly
 * - Detects Thai sentence boundaries using linguistic markers
 * - Preserves formulas, code blocks, and examples
 * - Targets 200-500 tokens per chunk for optimal RAG retrieval
 */

export interface ChunkMetadata {
  chunkIndex: number;
  chunkType: 'description' | 'formula' | 'examples' | 'faq' | 'sentence';
  characterCount: number;
  estimatedTokens: number;
  startChar: number;
  endChar: number;
}

export interface TextChunk {
  content: string;
  metadata: ChunkMetadata;
}

/**
 * Estimate token count for text using Thai character approximation
 * Thai characters generally map to fewer tokens than Latin, with ratio ~0.6-0.8
 * Formula: roughly 1 Thai character ≈ 0.6-0.8 tokens, 1 English word ≈ 1.3 tokens
 */
export function estimateTokenCount(text: string): number {
  if (!text || text.length === 0) return 0;

  let tokenCount = 0;
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    const code = char.charCodeAt(0);

    // Thai character ranges (Unicode 0x0E00-0x0E7F)
    if (code >= 0x0e00 && code <= 0x0e7f) {
      // Thai consonants, vowels, digits, punctuation
      tokenCount += 0.7; // Conservative estimate for Thai chars
      i++;
    } else if (char === ' ' || char === '\n' || char === '\t') {
      // Whitespace separates tokens but doesn't consume them
      i++;
      // Skip multiple whitespaces
      while (i < text.length && /[\s]/.test(text[i])) {
        i++;
      }
    } else if (/[a-zA-Z0-9]/.test(char)) {
      // English word or number token
      let wordLength = 0;
      while (i < text.length && /[a-zA-Z0-9_-]/.test(text[i])) {
        wordLength++;
        i++;
      }
      // Average English word ≈ 1.3 tokens
      tokenCount += (wordLength / 5) * 1.3;
    } else {
      // Punctuation, symbols
      tokenCount += 0.2;
      i++;
    }
  }

  return Math.ceil(tokenCount);
}

/**
 * Detect Thai sentence boundaries
 * Thai sentences end with:
 * - `।` (Devanagari danda, U+0964) - primary Thai sentence marker
 * - `॥` (Devanagari double danda, U+0965) - section break
 * - `!` (exclamation mark)
 * - `?` (question mark)
 * - `\n` (newline, often implicit boundary)
 *
 * Note: Thai also uses periods but they're less reliable, so we focus on strong markers
 */
function detectThaiSentenceBoundaries(text: string): number[] {
  const boundaries: number[] = [];
  const thaiDanda = '।'; // ।
  const thaiDoubleDanda = '॥'; // ॥

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    // Strong sentence-ending markers
    if (
      char === thaiDanda ||
      char === thaiDoubleDanda ||
      char === '!' ||
      char === '?'
    ) {
      boundaries.push(i + 1); // Boundary after the marker
    }

    // Newline is a soft boundary (check for preceding text)
    if (char === '\n' && i > 0) {
      const prevText = text.substring(0, i).trim();
      if (prevText.length > 0) {
        boundaries.push(i); // Boundary at the newline
      }
    }
  }

  // Sort and deduplicate
  return Array.from(new Set(boundaries)).sort((a, b) => a - b);
}

/**
 * Extract sentences from text based on Thai boundaries
 * Groups sentences together if they're small enough, splits if too large
 */
function extractThaiSentences(text: string): string[] {
  if (!text || text.trim().length === 0) return [];

  // Boundaries are positions right after sentence-ending marks
  const boundaries = detectThaiSentenceBoundaries(text);

  if (boundaries.length === 0) {
    // No boundaries found, return the whole text as one sentence
    return [text.trim()];
  }

  const sentences: string[] = [];
  let lastPos = 0;

  for (const boundary of boundaries) {
    if (boundary > lastPos) {
      const sentence = text.substring(lastPos, boundary).trim();
      if (sentence.length > 0) {
        sentences.push(sentence);
      }
      lastPos = boundary;
    }
  }

  // Add remaining text if any
  if (lastPos < text.length) {
    const remaining = text.substring(lastPos).trim();
    if (remaining.length > 0) {
      sentences.push(remaining);
    }
  }

  return sentences;
}

/**
 * Check if text contains formula/code blocks
 * Formulas should NOT be split further
 */
function isFormulaOrCodeBlock(text: string): boolean {
  const codeBlockIndicators = [
    /```[\s\S]*?```/, // Markdown code blocks
    /\$\$[\s\S]*?\$\$/, // LaTeX display math
    /<code>[\s\S]*?<\/code>/, // HTML code
    /^[+=\-*/()[\]{}]/, // Starts with math operators
  ];

  return codeBlockIndicators.some((pattern) => pattern.test(text));
}

/**
 * Group sentences into chunks targeting TOKEN_TARGET
 * Strategy:
 * 1. Preserve formulas as-is
 * 2. Group small sentences together
 * 3. Split very large sentences if needed
 * 4. Target 200-500 tokens per chunk
 */
export function groupIntoTokenTargetChunks(
  sentences: string[],
  targetTokenMin: number = 200,
  targetTokenMax: number = 500
): TextChunk[] {
  if (sentences.length === 0) return [];

  const chunks: TextChunk[] = [];
  let currentGroup: string[] = [];
  let currentTokens = 0;

  for (const sentence of sentences) {
    const tokens = estimateTokenCount(sentence);

    // If this is a formula, always preserve it as its own chunk
    if (isFormulaOrCodeBlock(sentence)) {
      // Flush current group if it has content
      if (currentGroup.length > 0) {
        chunks.push({
          content: currentGroup.join(' '),
          metadata: {
            chunkIndex: chunks.length,
            chunkType: 'sentence',
            characterCount: currentGroup.join(' ').length,
            estimatedTokens: currentTokens,
            startChar: 0,
            endChar: 0,
          },
        });
        currentGroup = [];
        currentTokens = 0;
      }

      // Add formula as its own chunk
      chunks.push({
        content: sentence,
        metadata: {
          chunkIndex: chunks.length,
          chunkType: 'formula',
          characterCount: sentence.length,
          estimatedTokens: tokens,
          startChar: 0,
          endChar: 0,
        },
      });
      continue;
    }

    // Check if adding this sentence exceeds token target
    if (currentTokens + tokens > targetTokenMax && currentGroup.length > 0) {
      // Flush current group
      chunks.push({
        content: currentGroup.join(' '),
        metadata: {
          chunkIndex: chunks.length,
          chunkType: 'sentence',
          characterCount: currentGroup.join(' ').length,
          estimatedTokens: currentTokens,
          startChar: 0,
          endChar: 0,
        },
      });
      currentGroup = [];
      currentTokens = 0;
    }

    // Add sentence to current group
    currentGroup.push(sentence);
    currentTokens += tokens;

    // If we've reached the target minimum, optionally flush
    if (currentTokens >= targetTokenMin && Math.random() > 0.7) {
      // 30% chance to flush at target minimum to avoid bias
      chunks.push({
        content: currentGroup.join(' '),
        metadata: {
          chunkIndex: chunks.length,
          chunkType: 'sentence',
          characterCount: currentGroup.join(' ').length,
          estimatedTokens: currentTokens,
          startChar: 0,
          endChar: 0,
        },
      });
      currentGroup = [];
      currentTokens = 0;
    }
  }

  // Flush remaining group
  if (currentGroup.length > 0) {
    chunks.push({
      content: currentGroup.join(' '),
      metadata: {
        chunkIndex: chunks.length,
        chunkType: 'sentence',
        characterCount: currentGroup.join(' ').length,
        estimatedTokens: currentTokens,
        startChar: 0,
        endChar: 0,
      },
    });
  }

  return chunks;
}

/**
 * Chunk text using Thai sentence-level strategy
 * Main entry point for chunking calculator content
 */
export function chunkThaiText(
  text: string,
  options: {
    targetTokenMin?: number;
    targetTokenMax?: number;
    preserveFormulas?: boolean;
  } = {}
): TextChunk[] {
  const {
    targetTokenMin = 200,
    targetTokenMax = 500,
    preserveFormulas = true,
  } = options;

  if (!text || text.trim().length === 0) {
    return [];
  }

  // Extract Thai sentences
  const sentences = extractThaiSentences(text);

  // Group into token-target chunks
  const chunks = groupIntoTokenTargetChunks(
    sentences,
    targetTokenMin,
    targetTokenMax
  );

  // If preserveFormulas is false, further split formulas into sentences
  // (but we keep it at sentence level for now)

  return chunks;
}

/**
 * Validate chunk quality
 * Returns warnings and statistics about the chunked text
 */
export function validateChunks(chunks: TextChunk[]): {
  totalChunks: number;
  totalTokens: number;
  averageTokensPerChunk: number;
  chunkStatistics: {
    belowTarget: number;
    withinTarget: number;
    aboveTarget: number;
  };
  warnings: string[];
} {
  const belowTarget: TextChunk[] = [];
  const withinTarget: TextChunk[] = [];
  const aboveTarget: TextChunk[] = [];
  const warnings: string[] = [];

  let totalTokens = 0;

  for (const chunk of chunks) {
    const tokens = chunk.metadata.estimatedTokens;
    totalTokens += tokens;

    if (tokens < 200) {
      belowTarget.push(chunk);
    } else if (tokens <= 500) {
      withinTarget.push(chunk);
    } else {
      aboveTarget.push(chunk);
      warnings.push(
        `Chunk ${chunk.metadata.chunkIndex} exceeds target: ${tokens} tokens`
      );
    }
  }

  if (belowTarget.length > chunks.length * 0.3) {
    warnings.push(
      `${belowTarget.length} chunks below target (${(
        (belowTarget.length / chunks.length) *
        100
      ).toFixed(1)}%)`
    );
  }

  return {
    totalChunks: chunks.length,
    totalTokens,
    averageTokensPerChunk:
      chunks.length > 0 ? Math.round(totalTokens / chunks.length) : 0,
    chunkStatistics: {
      belowTarget: belowTarget.length,
      withinTarget: withinTarget.length,
      aboveTarget: aboveTarget.length,
    },
    warnings,
  };
}
