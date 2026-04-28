/**
 * API Endpoint: /api/ai-advisor/followups
 *
 * Generates follow-up question chips to display below AI responses.
 * Called after the AI answers a user question in the chat.
 *
 * Request:
 *   POST /api/ai-advisor/followups
 *   Content-Type: application/json
 *   {
 *     "question": "User's original question",
 *     "answer": "AI's full response text",
 *     "calculatorSlug": "ai-advisor" (context identifier)
 *   }
 *
 * Response:
 *   {
 *     "success": true,
 *     "followups": [
 *       "ถ้าดอกเบี้ยปรับขึ้นแล้วจะเป็นอย่างไร?",
 *       "ฉันสามารถแก้ไขการจ่ายชำระได้ไหม?",
 *       "วิธีนี้เปรียบเทียบกับธนาคารอื่นอย่างไร?"
 *     ]
 *   }
 */

import type { APIRoute } from 'astro';
import { Anthropic } from '@anthropic-ai/sdk';

interface FollowupsRequest {
  question: string;
  answer: string;
  calculatorSlug?: string;
}

interface FollowupsResponse {
  success: boolean;
  followups?: string[];
  error?: string;
}

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable not set');
  }
  return new Anthropic({ apiKey });
}

function hasThaiCharacters(text: string): boolean {
  const thaiRegex = /[฀-๿]/;
  return thaiRegex.test(text);
}

function validateFollowupQuestion(q: string, originalQuestion: string): boolean {
  // Must have Thai characters
  if (!hasThaiCharacters(q)) {
    return false;
  }

  const trimmed = q.trim();

  // Length: 15-50 characters (shorter for chip display, max 40 per spec)
  if (trimmed.length < 10 || trimmed.length > 50) {
    return false;
  }

  // Must be a question (end with ?)
  if (!trimmed.endsWith('?') && !trimmed.endsWith('？')) {
    return false;
  }

  // Don't repeat original question
  const normalized = (s: string) => s.toLowerCase().replace(/\s+/g, '');
  if (normalized(trimmed) === normalized(originalQuestion)) {
    return false;
  }

  return true;
}

async function generateFollowups(question: string, answer: string): Promise<string[]> {
  const client = getAnthropicClient();

  const prompt = `คุณสร้างคำถามติดตามแบบสั้น ๆ 3 ข้อสำหรับแชทการเงินไทย

คำถามเดิม: "${question}"

คำตอบของ AI:
${answer}

สร้าง 3 คำถามติดตามที่:
1. เกี่ยวข้องโดยตรง ลึกขึ้น ไม่ซ้ำ
2. ภาษาไทยธรรมชาติ
3. 15-40 ตัวอักษร
4. จบด้วย ?

ห้าม: ทำซ้ำคำถามเดิม ใช้คำศัพท์ซับซ้อน นอกหัวข้อ

ส่งคืน JSON เท่านั้น:
\`\`\`json
{
  "followups": ["คำถาม 1?", "คำถาม 2?", "คำถาม 3?"]
}
\`\`\``;

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    // Parse JSON
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[ai-advisor/followups] Failed to parse JSON:', textContent.text);
      return [];
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const followups = (parsed.followups || []) as string[];

    // Validate and return top 3
    const validated = followups
      .filter((q: string) => validateFollowupQuestion(q, question))
      .slice(0, 3)
      .map((q: string) => q.trim());

    return validated;
  } catch (error) {
    console.error('[ai-advisor/followups] Error generating followups:', error);
    return [];
  }
}

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  // Verify authentication
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = (await request.json()) as FollowupsRequest;
    const { question, answer } = body;

    // Validate inputs
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'question is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!answer || typeof answer !== 'string' || answer.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'answer is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate followup questions (non-blocking failure)
    const followups = await generateFollowups(question, answer);

    const response: FollowupsResponse = {
      success: true,
      followups,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[ai-advisor/followups] error:', error);

    // Return empty followups instead of error (non-critical feature)
    return new Response(
      JSON.stringify({ success: true, followups: [] }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
