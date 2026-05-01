/**
 * AI Advisor endpoint — CAL-1262 / CAL-1263
 * POST /api/ai-advisor/message
 * Auth-gated, tier-enforced (server-side per-question log), Claude streaming internally,
 * returns JSON { reply, questionsUsed }.
 */

import Anthropic from '@anthropic-ai/sdk';
import { getCurrentUser } from './auth.mjs';
import { getUserById, getQuestionCount, recordQuestion, TIER_LIMITS } from './db.mjs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `คุณคือที่ปรึกษาทางการเงินส่วนตัวสำหรับคนไทย ผู้ช่วยอัจฉริยะของ kamnuanlek.com

คุณช่วยผู้ใช้เกี่ยวกับ:
- ภาษีเงินได้บุคคลธรรมดาและนิติบุคคลในประเทศไทย
- การคำนวณเงินเดือน เงินสุทธิ และหักลดหย่อนต่างๆ
- ประกันสังคมและกองทุนสำรองเลี้ยงชีพ
- สินเชื่อบ้าน รถยนต์ และการผ่อนชำระ
- ดอกเบี้ย เงินออม และการลงทุน
- การคำนวณ BMI สุขภาพ และแคลอรี่
- หน่วยและการแปลงค่าต่างๆ

กฎการตอบ:
- ตอบเป็นภาษาไทยเสมอ เว้นแต่ผู้ใช้ถามเป็นภาษาอังกฤษ
- ให้ข้อมูลถูกต้องตามกฎหมายและอัตราภาษีของประเทศไทยปัจจุบัน
- อธิบายการคำนวณให้ชัดเจน พร้อมตัวเลขและขั้นตอน
- หากไม่แน่ใจ ให้แนะนำให้ปรึกษาผู้เชี่ยวชาญด้านภาษีหรือการเงิน
- ตอบกระชับ ชัดเจน และเป็นประโยชน์`;

// Thai financial keyword context for RAG-style augmentation
const CONTEXT_TOPICS = [
  {
    keywords: ['ภาษี', 'tax', 'ลดหย่อน', 'หักลดหย่อน', 'เสียภาษี', 'คืนภาษี', 'ภาษีเงินได้'],
    context: 'อัตราภาษีเงินได้บุคคลธรรมดาไทย 2567: 0-150,000 บาท = 0%, 150,001-300,000 = 5%, 300,001-500,000 = 10%, 500,001-750,000 = 15%, 750,001-1,000,000 = 20%, 1,000,001-2,000,000 = 25%, 2,000,001-5,000,000 = 30%, 5,000,001+ = 35% ค่าลดหย่อนพื้นฐาน: ส่วนตัว 60,000 บาท, คู่สมรส 60,000 บาท, บุตร 30,000 บาทต่อคน (สูงสุด 3 คน)',
  },
  {
    keywords: ['เงินเดือน', 'salary', 'รายได้', 'income', 'ค่าจ้าง', 'โบนัส'],
    context: 'การคำนวณเงินเดือนสุทธิ: หักประกันสังคม 5% (สูงสุด 750 บาท/เดือน), หักภาษีหัก ณ ที่จ่าย ตามอัตราก้าวหน้า ค่าใช้จ่ายได้รับการหักเหมา 50% แต่ไม่เกิน 100,000 บาท/ปี',
  },
  {
    keywords: ['ประกันสังคม', 'social security', 'กองทุน', 'ประกัน'],
    context: 'ประกันสังคม 2567: ผู้ประกันตน มาตรา 33 ส่งสมทบ 5% ของค่าจ้าง สูงสุด 750 บาท/เดือน (ฐานค่าจ้างสูงสุด 15,000 บาท) นายจ้างส่งสมทบอีก 5% รัฐส่งสมทบ 2.75%',
  },
  {
    keywords: ['สินเชื่อ', 'loan', 'บ้าน', 'mortgage', 'ผ่อน', 'ดอกเบี้ย', 'รถ', 'กู้'],
    context: 'การคำนวณสินเชื่อ: ใช้สูตร PMT = PV × [r(1+r)^n] / [(1+r)^n - 1] โดย PV = เงินต้น, r = อัตราดอกเบี้ยต่อเดือน, n = จำนวนงวด อัตราดอกเบี้ยบ้านทั่วไป 3-7% ต่อปี สินเชื่อรถยนต์ 2-4% ต่อปี',
  },
  {
    keywords: ['BMI', 'น้ำหนัก', 'ส่วนสูง', 'สุขภาพ', 'แคลอรี่', 'ออกกำลังกาย'],
    context: 'BMI = น้ำหนัก(กก.) / ส่วนสูง(ม.)² เกณฑ์: < 18.5 = ผอม, 18.5-22.9 = ปกติ, 23-27.4 = น้ำหนักเกิน, ≥ 27.5 = อ้วน (เกณฑ์เอเชีย)',
  },
  {
    keywords: ['ดอกเบี้ย', 'interest', 'เงินออม', 'ฝาก', 'ธนาคาร', 'ลงทุน', 'savings'],
    context: 'ดอกเบี้ยทบต้น: A = P(1 + r/n)^(nt) โดย P = เงินต้น, r = อัตราดอกเบี้ยต่อปี, n = ครั้งที่ทบต้นต่อปี, t = เวลา(ปี) ดอกเบี้ยเงินฝากออมทรัพย์ประมาณ 0.5-1.5% ต่อปี',
  },
];

function buildRagContext(userMessage) {
  const lowerMsg = userMessage.toLowerCase();
  const matched = CONTEXT_TOPICS.filter(topic =>
    topic.keywords.some(kw => lowerMsg.includes(kw.toLowerCase()))
  );
  if (matched.length === 0) return '';
  return '\n\nข้อมูลอ้างอิง:\n' + matched.map(t => t.context).join('\n');
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(raw)); }
      catch { reject(new Error('invalid json')); }
    });
    req.on('error', reject);
  });
}

export async function handleAiAdvisorMessage(req, res) {
  // Auth check
  const jwtUser = getCurrentUser(req);
  if (!jwtUser || !jwtUser.userId) {
    res.writeHead(401, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'not_authenticated' }));
    return;
  }

  // Parse body
  let body;
  try {
    body = await parseBody(req);
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'invalid_request' }));
    return;
  }

  const userMessage = (body.message || '').trim();
  if (!userMessage) {
    res.writeHead(400, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'message_required' }));
    return;
  }
  if (userMessage.length > 2000) {
    res.writeHead(400, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'message_too_long' }));
    return;
  }

  // Fetch full user from DB to get current questionsUsed (JWT does not include it)
  let dbUser;
  try {
    dbUser = await getUserById(jwtUser.userId);
  } catch (err) {
    console.error('[ai-advisor] DB error fetching user:', err.message);
    res.writeHead(500, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'server_error' }));
    return;
  }

  if (!dbUser) {
    res.writeHead(401, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'user_not_found' }));
    return;
  }

  // Server-side tier enforcement (CAL-1263):
  //   free  → lifetime limit (SELECT COUNT(*) FROM questions WHERE user_id=?)
  //   paid  → monthly limit, reset on billing anniversary date
  const tier = dbUser.tier || 'free';
  const limit = TIER_LIMITS[tier] ?? TIER_LIMITS.free;
  const billingRef = dbUser.billingStartedAt || dbUser.createdAt;

  let questionsUsed;
  try {
    questionsUsed = await getQuestionCount(dbUser.id, tier, billingRef);
  } catch (err) {
    console.error('[ai-advisor] DB error counting questions:', err.message);
    res.writeHead(500, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'server_error' }));
    return;
  }

  if (questionsUsed >= limit) {
    res.writeHead(402, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({
      error: 'upgrade_required',
      tier,
      questionsUsed,
      limit,
    }));
    return;
  }

  // Check API key configured
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[ai-advisor] ANTHROPIC_API_KEY not set');
    res.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'ai_not_configured' }));
    return;
  }

  // Build system prompt with RAG context
  const ragContext = buildRagContext(userMessage);
  const fullSystem = SYSTEM_PROMPT + ragContext;

  // Stream Claude response to client via SSE (word-by-word, mandatory quality bar)
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  let fullReply = '';
  let streamAborted = false;

  // Cleanup handler: if client closes connection, abort the stream and cleanup
  const onClientClose = () => {
    console.log('[ai-advisor] Client disconnected, aborting stream');
    streamAborted = true;
    if (stream?.abort) stream.abort();
  };
  res.on('close', onClientClose);

  // Timeout: if stream takes >60s, end it to prevent hanging
  const streamTimeout = setTimeout(() => {
    if (!res.headersSent || !res.writableEnded) {
      console.warn('[ai-advisor] Stream timeout (60s), closing connection');
      if (stream?.abort) stream.abort();
      streamAborted = true;
    }
  }, 60000);

  let stream = null;
  try {
    stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: [{ type: 'text', text: fullSystem, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userMessage }],
    });

    for await (const event of stream) {
      // Stop processing if client disconnected
      if (streamAborted) break;

      if (
        event.type === 'content_block_delta' &&
        event.delta?.type === 'text_delta'
      ) {
        const chunk = event.delta.text;
        fullReply += chunk;
        res.write(`data: ${JSON.stringify({ type: 'delta', text: chunk })}\n\n`);
      }
    }
  } catch (err) {
    // Only report error if client is still connected
    if (!streamAborted && !res.writableEnded) {
      console.error('[ai-advisor] Claude API error:', err.message);
      res.write(`data: ${JSON.stringify({ type: 'error', code: 'ai_error' })}\n\n`);
    }
    clearTimeout(streamTimeout);
    res.removeListener('close', onClientClose);
    if (!res.writableEnded) res.end();
    return;
  } finally {
    clearTimeout(streamTimeout);
    res.removeListener('close', onClientClose);
  }

  // Record question in the per-question log (source of truth for tier enforcement)
  if (!streamAborted && !res.writableEnded) {
    try {
      await recordQuestion(dbUser.id);
    } catch (err) {
      console.error('[ai-advisor] DB error recording question:', err.message);
      // Non-fatal — reply is already generated
    }

    res.write(`data: ${JSON.stringify({ type: 'done', questionsUsed: questionsUsed + 1 })}\n\n`);
  }

  if (!res.writableEnded) res.end();
}
