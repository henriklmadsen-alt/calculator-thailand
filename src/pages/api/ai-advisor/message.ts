/**
 * API Endpoint: /api/ai-advisor/message
 *
 * Main AI Advisor endpoint that:
 * 1. Validates and rate-limits incoming questions
 * 2. Retrieves relevant calculator context (RAG retrieval)
 * 3. Generates AI response using Claude with Thai financial expertise
 * 4. Returns response via Server-Sent Events (SSE) for streaming
 *
 * Rate Limits:
 * - 10 questions/minute per authenticated user
 * - 10 requests/minute per IP (unauthenticated)
 * - Max 500 characters per question
 * - Max 3 concurrent SSE streams per user
 *
 * Request:
 *   POST /api/ai-advisor/message
 *   Authorization: Bearer <token> (optional)
 *   Content-Type: application/json
 *   {
 *     "question": "ภาษีเงินได้เท่าไหร่สำหรับรายได้ 500,000 บาทต่อปี",
 *     "conversationId": "conv-123", // optional
 *     "includeFollowUp": true
 *   }
 *
 * Response (Server-Sent Events):
 *   event: ai_response
 *   data: {"content": "ส่วนหนึ่งของคำตอบ...", "done": false}
 *   ...
 *   event: ai_response
 *   data: {"content": "ส่วนสุดท้าย", "done": true, "sources": [...]}
 */

import type { APIRoute } from 'astro';
import { getRateLimiter, createRateLimitResponse } from '../../../lib/rate-limiter';
import { retrieveCalculatorContext } from '../../../lib/rag-retrieval';
import { Anthropic } from '@anthropic-ai/sdk';
import crypto from 'crypto';

interface AiAdvisorRequest {
  question: string;
  conversationId?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  includeFollowUp?: boolean;
}

/**
 * Extract user ID from request headers (from OAuth token or session)
 */
function extractUserId(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract token; in production, this validates the JWT
    return authHeader.substring(7).split('.')[0];
  }
  return null;
}

/**
 * Build system prompt for Thai financial AI advisor
 */
function buildSystemPrompt(calculatorContext: any = null): string {
  let prompt = `คุณเป็นผู้ที่ปรึกษาการเงินที่มีความรู้เกี่ยวกับระบบการเงินไทย (Kamnuanlek.com).

หลักเกณฑ์สำคัญ:
1. ตอบเป็นภาษาไทยเท่านั้น - ธรรมชาติ สื่อสารให้เข้าใจได้
2. ยึดหลักความแม่นยำ - ใช้ข้อมูลจากแหล่งที่น่าเชื่อถือ (ธนาคารแห่งประเทศไทย, สรรพากร, ประกันสังคม)
3. ไม่เป็นการให้คำปรึกษาส่วนตัว - บอกให้ผู้ใช้ปรึกษาผู้เชี่ยวชาญเมื่อจำเป็น
4. อ้างอิงข้อมูล - บอกแหล่งข้อมูลที่ใช้ในคำตอบ
5. เน้นการคำนวณจริง - แสดงตัวอย่างด้วยตัวเลขไทยที่เป็นจริง`;

  if (calculatorContext) {
    prompt += `

บริบทจากเครื่องคิดเลข:
- เครื่องคิดเลข: ${calculatorContext.calculatorName || 'N/A'}
- ข้อมูลที่เกี่ยวข้อง: ${calculatorContext.sources?.join(', ') || 'ไม่มี'}`;
  }

  return prompt;
}

/**
 * Generate AI response using Claude API
 */
async function generateAiResponse(
  question: string,
  systemPrompt: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<{ response: string; sourcesUsed?: string[] }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable not set');
  }

  const client = new Anthropic({ apiKey });

  // Build messages for API
  const messages = [
    ...conversationHistory.map((msg) => ({
      role: msg.role === 'user' || msg.role === 'assistant' ? msg.role : 'user',
      content: msg.content,
    })),
    {
      role: 'user' as const,
      content: question,
    },
  ];

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    return {
      response: textContent.text,
      sourcesUsed: [],
    };
  } catch (error) {
    console.error('[ai-advisor/message] Error generating AI response:', error);
    throw error;
  }
}

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  const startTime = performance.now();
  const limiter = getRateLimiter();

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse request body
    let body: AiAdvisorRequest;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { question, conversationId, conversationHistory = [], includeFollowUp = false } = body;

    // Validate question exists
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Question is required and must be a non-empty string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check question length (before rate limiting to fail fast)
    const lengthCheck = limiter.checkQuestionLength(question);
    if (!lengthCheck.valid) {
      return new Response(
        JSON.stringify({ success: false, error: lengthCheck.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
    const rateLimitCheck = limiter.checkQuestionRateLimit(request);
    if (!rateLimitCheck.allowed) {
      const { key } = limiter.getRateLimitKey(request);
      limiter.logRateLimitHit('question_rate_limit', key, {
        question: question.substring(0, 50),
        retryAfter: rateLimitCheck.retryAfterSeconds,
      });
      return createRateLimitResponse(rateLimitCheck.retryAfterSeconds || 60);
    }

    // Generate conversation ID if not provided
    const convId = conversationId || crypto.randomBytes(8).toString('hex');

    // For SSE streaming, use a connection ID for tracking
    const connectionId = crypto.randomBytes(8).toString('hex');

    // Register SSE connection
    const sseCheck = limiter.registerSseConnection(request, connectionId);
    if (!sseCheck.allowed) {
      const { key } = limiter.getRateLimitKey(request);
      limiter.logRateLimitHit('concurrent_sse_limit', key, {
        limit: 3,
        retryAfter: sseCheck.retryAfterSeconds,
      });
      return createRateLimitResponse(sseCheck.retryAfterSeconds || 30);
    }

    // Retrieve calculator context for RAG
    let calculatorContext;
    try {
      const ragResult = await retrieveCalculatorContext(question, 3);
      calculatorContext = {
        calculatorName: ragResult.sources?.[0] || 'Unknown',
        sources: ragResult.sources || [],
      };
    } catch (error) {
      console.warn('[ai-advisor/message] RAG retrieval failed, proceeding without context:', error);
      calculatorContext = null;
    }

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(calculatorContext);

    // Generate AI response
    const aiResult = await generateAiResponse(question, systemPrompt, conversationHistory);

    // Return streaming response with SSE
    const responseContent = new ReadableStream({
      async start(controller) {
        try {
          // Send response content
          controller.enqueue(
            new TextEncoder().encode(
              `event: ai_response\ndata: ${JSON.stringify({ content: aiResult.response, done: false })}\n\n`
            )
          );

          // Send completion event with metadata
          const metadata = {
            done: true,
            conversationId: convId,
            processingTimeMs: Math.round(performance.now() - startTime),
            sources: aiResult.sourcesUsed || [],
          };

          controller.enqueue(
            new TextEncoder().encode(`event: ai_response\ndata: ${JSON.stringify(metadata)}\n\n`)
          );

          // Unregister SSE connection
          limiter.unregisterSseConnection(request, connectionId);

          controller.close();
        } catch (error) {
          console.error('[ai-advisor/message] SSE streaming error:', error);
          limiter.unregisterSseConnection(request, connectionId);
          controller.error(error);
        }
      },
    });

    return new Response(responseContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Conversation-Id': convId,
      },
    });
  } catch (error) {
    console.error('[ai-advisor/message] error:', error);

    const response = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    };

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
