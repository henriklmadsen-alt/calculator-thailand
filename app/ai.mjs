/**
 * Claude API streaming for AI Advisor chat.
 * Streams word-by-word responses for a smooth ChatGPT-like experience.
 *
 * Requires: ANTHROPIC_API_KEY env var
 */

import Anthropic from '@anthropic-ai/sdk';
import { createConversation, addMessage, getConversationWithMessages, TIER_LIMITS } from './db.mjs';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt — Thai financial advisor personality ("เล็กแนะนำ" Lek Naenam)
const SYSTEM_PROMPT = `คุณคือ "เล็กแนะนำ" (Lek Naenam) ที่ปรึกษาการเงินแบบเป็นมิตร ของเว็บไซต์ Kamnuanlek.com

**บุคลิกภาพของคุณ:**
- เป็นเพื่อนที่เข้าใจ ให้คำแนะนำแบบไม่เต็มเอิดแต่จริงจัง
- พูดภาษาไทยอย่างธรรมชาติและสมัยใจ ใช้เเสลง ชีวิตจริง
- มีความรู้ลึก: ภาษี สินเชื่อ การลงทุน ประกัน เงินออม
- เสนอคำแนะนำที่เป็นประโยชน์ต่อคนไทยโดยเฉพาะ

**ในการตอบ:**
- ตอบสั้นแต่ชัดเจน (เว้นแต่คำถามซับซ้อน)
- ใช้ตัวอย่างจากสถานการณ์ในไทย (เช่น ใบเสร็จ สูตรภาษี ปีภาษี)
- ขอข้อมูลเพิ่มเติมถ้าจำเป็น แทนที่จะสมมติ
- ท้ายคำตอบ ถาม "มีอะไรให้ช่วยอีกไหม?" เพื่อเชื่อมสนทนา
- หลีกเลี่ยง: ตัวเลขปลายแหลม (คำนวณ; ส่งต่อเครื่องคำนวณแทน) ขอคำแนะนำกฎหมาย ข้อมูล GDPR`;

const MODEL = 'claude-3-5-sonnet-20241022';
const MAX_TOKENS = 1024;

export async function streamAiMessage(req, res, userId, messageText, conversationId) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'AI not configured' }));
      return;
    }

    // Get or create conversation
    let conv = conversationId ? await getConversationWithMessages(conversationId, userId) : null;
    if (!conv) {
      conv = await createConversation(userId, `Chat ${new Date().toLocaleString('th-TH')}`);
      conversationId = conv.id;
    } else if (conv === 'forbidden') {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'forbidden' }));
      return;
    }

    // Add user message to conversation
    await addMessage(conversationId, 'user', messageText);

    // Build context from conversation history (last 10 messages for context window)
    const contextMessages = (conv.messages || []).slice(-10).map(m => ({
      role: m.role,
      content: m.content,
    }));
    contextMessages.push({ role: 'user', content: messageText });

    // Stream Claude response
    let fullResponse = '';
    const stream = await anthropic.messages.stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: contextMessages,
    });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    // Stream text deltas as they arrive
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        const text = event.delta.text;
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ type: 'text', text })}\n\n`);
      }
    }

    // Save final response to conversation
    await addMessage(conversationId, 'assistant', fullResponse);

    // Send final metadata
    res.write(`data: ${JSON.stringify({
      type: 'end',
      conversationId,
      fullResponse,
      tokensUsed: fullResponse.split(/\s+/).length,
    })}\n\n`);
    res.end();
  } catch (err) {
    console.error('[ai] stream error:', err.message);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'streaming failed' }));
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
      res.end();
    }
  }
}

export async function validateQuestionsUsed(tier, questionsUsed) {
  const limit = TIER_LIMITS[tier] || 3;
  return questionsUsed < limit;
}
