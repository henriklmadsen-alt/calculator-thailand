/**
 * API Endpoint: /api/ai-advisor/retrieve
 *
 * Retrieves relevant calculator context for a user question
 * Called by the AI Advisor chat interface before generating LLM responses
 *
 * Request:
 *   POST /api/ai-advisor/retrieve
 *   Content-Type: application/json
 *   { "question": "ภาษีเงินได้ของฉันจะเท่าไหร่ถ้ารายได้ 50,000 บาท", "topK": 3 }
 *
 * Response:
 *   { "chunks": [...], "query_embedding_tokens": 10, "search_time_ms": 45, "sources": ["คำนวณ-salary", ...] }
 */

import type { APIRoute } from 'astro';
import { retrieveCalculatorContext, type RetrievalResult } from '../../../lib/rag-retrieval';

interface RetrieveRequest {
  question: string;
  topK?: number;
}

interface RetrieveResponse {
  success: boolean;
  data?: RetrievalResult;
  error?: string;
}

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse request body
    let body: RetrieveRequest;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { question, topK = 3 } = body;

    // Validate input
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Question is required and must be a non-empty string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (typeof topK !== 'number' || topK < 1 || topK > 10) {
      return new Response(
        JSON.stringify({ success: false, error: 'topK must be a number between 1 and 10' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Retrieve calculator context
    const result = await retrieveCalculatorContext(question, topK);

    // Check performance requirement (<100ms)
    if (result.search_time_ms > 100) {
      console.warn(`[ai-advisor/retrieve] slow retrieval: ${result.search_time_ms}ms for question "${question.substring(0, 50)}..."`);
    }

    const response: RetrieveResponse = {
      success: true,
      data: result,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[ai-advisor/retrieve] error:', error);

    const response: RetrieveResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    };

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
