/**
 * API Endpoint: /api/ai-advisor/generate-follow-up-questions
 *
 * Generates contextually relevant follow-up questions for AI Advisor chat.
 * Called after the AI generates a response to suggest next questions to the user.
 *
 * Request:
 *   POST /api/ai-advisor/generate-follow-up-questions
 *   Content-Type: application/json
 *   {
 *     "aiResponse": "ดอกเบี้ยของคุณคำนวณจาก...",
 *     "userQuestion": "APR คืออะไร",
 *     "conversationHistory": [
 *       { "role": "user", "content": "APR คืออะไร" },
 *       { "role": "ai", "content": "ดอกเบี้ยของคุณคำนวณจาก..." }
 *     ],
 *     "calculatorContext": {
 *       "calculatorName": "APR Calculator",
 *       "userInput": { "loanAmount": 100000, "interest": 8, "duration": 12 }
 *     }
 *   }
 *
 * Response:
 *   {
 *     "success": true,
 *     "data": {
 *       "questions": [
 *         { "id": "q-001", "text": "ดอกเบี้ยปรับขึ้นแล้วจะเป็นอย่างไร?" },
 *         { "id": "q-002", "text": "ถ้าฉันมีผู้ค้ำประกันล่ะ?" },
 *         { "id": "q-003", "text": "วิธีคำนวณแตกต่างจากธนาคารอื่นไหม?" }
 *       ],
 *       "generationTimeMs": 450
 *     }
 *   }
 */

import type { APIRoute } from 'astro';
import { Anthropic } from '@anthropic-ai/sdk';
import crypto from 'crypto';

interface ConversationMessage {
  role: 'user' | 'ai' | 'assistant';
  content: string;
}

interface CalculatorContext {
  calculatorName?: string;
  userInput?: Record<string, unknown>;
  result?: unknown;
  relatedCalculators?: string[];
}

interface GenerateFollowUpQuestionsRequest {
  aiResponse: string;
  userQuestion: string;
  conversationHistory?: ConversationMessage[];
  calculatorContext?: CalculatorContext;
  maxQuestions?: number;
}

interface FollowUpQuestion {
  id: string;
  text: string;
}

interface GenerateFollowUpQuestionsResponse {
  success: boolean;
  data?: {
    questions: FollowUpQuestion[];
    generationTimeMs: number;
  };
  error?: string;
}

// Initialize Anthropic client
function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable not set');
  }
  return new Anthropic({ apiKey });
}

/**
 * Validate Thai language content (basic heuristic)
 * Thai Unicode ranges: U+0E00 to U+0E7F
 */
function hasThaiCharacters(text: string): boolean {
  const thaiRegex = /[฀-๿]/;
  return thaiRegex.test(text);
}

/**
 * Validate a follow-up question
 * - Must be in Thai
 * - Must be 40-80 characters
 * - Must end with ? (question mark)
 * - Must not be just repeated input
 */
function validateFollowUpQuestion(question: string, originalQuestion: string): boolean {
  // Check Thai characters exist
  if (!hasThaiCharacters(question)) {
    return false;
  }

  // Check length (40-80 chars)
  const trimmed = question.trim();
  if (trimmed.length < 40 || trimmed.length > 90) {
    return false;
  }

  // Check if it's a question (ends with ?)
  if (!trimmed.endsWith('?') && !trimmed.endsWith('？')) {
    return false;
  }

  // Reject if it's too similar to original question (simple check)
  const similarity = trimmed.toLowerCase() === originalQuestion.toLowerCase();
  if (similarity) {
    return false;
  }

  return true;
}

/**
 * Generate follow-up questions using Claude
 */
async function generateFollowUpQuestions(
  aiResponse: string,
  userQuestion: string,
  conversationHistory: ConversationMessage[] = [],
  calculatorContext: CalculatorContext | undefined = undefined,
  maxQuestions: number = 3
): Promise<FollowUpQuestion[]> {
  const client = getAnthropicClient();

  // Build conversation context
  const recentMessages = conversationHistory.slice(-4); // Last 4 messages for context
  const conversationContext = recentMessages
    .map((msg) => `${msg.role === 'user' ? 'ผู้ใช้' : 'AI'}: ${msg.content}`)
    .join('\n');

  // Build calculator context string
  let calculatorContextStr = '';
  if (calculatorContext) {
    calculatorContextStr = `
Calculator: ${calculatorContext.calculatorName || 'N/A'}
Related: ${(calculatorContext.relatedCalculators || []).join(', ') || 'None'}`;
  }

  const prompt = `คุณเป็นผู้ช่วยสร้างคำถามติดตามที่ชาญฉลาดสำหรับแพลตฟอร์มการเงินไทย (Kamnuanlek.com)

กำหนด:
- คำถามเดิมของผู้ใช้: "${userQuestion}"
- การตอบสนองของ AI ล่าสุด:
${aiResponse}
${conversationContextStr}

บริบทการสนทนา:
${conversationContext}

สร้างคำถามติดตาม ${Math.min(maxQuestions, 4)} ข้อที่:
1. มีความเกี่ยวข้องโดยตรงกับคำตอบของ AI
2. ลึกขึ้น (ไม่ใช่เพียงแค่ซ้ำ) - ข้อมูลเพิ่มเติม ทางเลือก การใช้งาน
3. เป็นภาษาไทยธรรมชาติ (ไม่ใช่ทำให้แปลตามตัวอักษร)
4. จบด้วย ? และมีความยาว 40-80 ตัวอักษร
5. สมดุล: บางข้อเป็นคำถามจริงทันทีที่มีประโยชน์ + บางข้อจะสำรวจทำความเข้าใจได้ลึกขึ้น

ห้าม:
- ทำซ้ำคำถามเดิมหรือคำตอบ
- ใช้คำศัพท์ที่ซับซ้อนเกินไป
- นอกหัวข้อ
- ไม่ใช่คำถาม (ต้องจบด้วย ?)

เอาต์พุต: ส่งคืนเป็น JSON เท่านั้น (ไม่มีข้อความอื่น)
\`\`\`json
{
  "questions": ["คำถาม 1?", "คำถาม 2?", "คำถาม 3?"]
}
\`\`\``;

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text response
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    // Parse JSON response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[generate-follow-up-questions] Failed to find JSON in response:', textContent.text);
      throw new Error('Invalid response format: no JSON found');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const questions = parsed.questions || [];

    // Validate and format questions
    const validQuestions = questions
      .filter((q: string) => validateFollowUpQuestion(q, userQuestion))
      .slice(0, Math.min(maxQuestions, 4))
      .map((q: string, index: number) => ({
        id: `q-${crypto.randomBytes(4).toString('hex')}`,
        text: q.trim(),
      }));

    return validQuestions;
  } catch (error) {
    console.error('[generate-follow-up-questions] Error generating questions:', error);
    throw error;
  }
}

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  const startTime = performance.now();

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse request body
    let body: GenerateFollowUpQuestionsRequest;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const {
      aiResponse,
      userQuestion,
      conversationHistory = [],
      calculatorContext,
      maxQuestions = 3,
    } = body;

    // Validate required inputs
    if (!aiResponse || typeof aiResponse !== 'string' || aiResponse.trim().length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'aiResponse is required and must be a non-empty string',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!userQuestion || typeof userQuestion !== 'string' || userQuestion.trim().length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'userQuestion is required and must be a non-empty string',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate maxQuestions
    if (typeof maxQuestions !== 'number' || maxQuestions < 1 || maxQuestions > 4) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'maxQuestions must be a number between 1 and 4',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate conversation history format
    if (!Array.isArray(conversationHistory)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'conversationHistory must be an array',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate follow-up questions
    const questions = await generateFollowUpQuestions(
      aiResponse,
      userQuestion,
      conversationHistory,
      calculatorContext,
      maxQuestions
    );

    const generationTimeMs = Math.round(performance.now() - startTime);

    // Check performance requirement (<2000ms)
    if (generationTimeMs > 2000) {
      console.warn(
        `[ai-advisor/generate-follow-up-questions] slow generation: ${generationTimeMs}ms for question "${userQuestion.substring(0, 50)}..."`
      );
    }

    const response: GenerateFollowUpQuestionsResponse = {
      success: true,
      data: {
        questions,
        generationTimeMs,
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[ai-advisor/generate-follow-up-questions] error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const response: GenerateFollowUpQuestionsResponse = {
      success: false,
      error: errorMessage,
    };

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
