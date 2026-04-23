/**
 * Conversation history API handlers (CAL-1265).
 *
 * GET  /api/conversations          — list (paginated 20/page, ?page=N)
 * POST /api/conversations          — create (auto-title from first 40 chars of question)
 * GET  /api/conversations/:id      — get with messages
 * DELETE /api/conversations/:id    — delete (owner only)
 *
 * All endpoints require a valid session cookie. Row-level security is
 * enforced at the DB layer: users can only access their own conversations.
 */

import { getCurrentUser } from './auth.mjs';
import {
  createConversation,
  listConversations,
  getConversationWithMessages,
  deleteConversation,
} from './db.mjs';

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

function sendJson(res, status, data) {
  res.writeHead(status, JSON_HEADERS);
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

/** GET /api/conversations?page=N */
export async function handleListConversations(req, res, incomingUrl) {
  const user = getCurrentUser(req);
  if (!user) { sendJson(res, 401, { error: 'Authentication required' }); return; }

  const page = Math.max(1, parseInt(incomingUrl.searchParams.get('page') || '1', 10));
  try {
    const result = await listConversations(user.userId, page);
    sendJson(res, 200, result);
  } catch (err) {
    console.error('[conversations] list error:', err.message);
    sendJson(res, 500, { error: 'Internal server error' });
  }
}

/** POST /api/conversations  — body: { question: string } */
export async function handleCreateConversation(req, res) {
  const user = getCurrentUser(req);
  if (!user) { sendJson(res, 401, { error: 'Authentication required' }); return; }

  try {
    const body = await readBody(req);
    const question = String(body.question || body.title || '').trim();
    if (!question) { sendJson(res, 400, { error: '"question" is required' }); return; }

    const title = question.length > 40
      ? question.slice(0, 40) + '…'
      : question;

    const conv = await createConversation(user.userId, title);
    sendJson(res, 201, {
      id: conv.id,
      title: conv.title,
      createdAt: conv.created_at,
      updatedAt: conv.updated_at,
      messages: [],
    });
  } catch (err) {
    console.error('[conversations] create error:', err.message);
    sendJson(res, 500, { error: 'Internal server error' });
  }
}

/** GET /api/conversations/:id */
export async function handleGetConversation(req, res, conversationId) {
  const user = getCurrentUser(req);
  if (!user) { sendJson(res, 401, { error: 'Authentication required' }); return; }

  try {
    const result = await getConversationWithMessages(conversationId, user.userId);
    if (!result) { sendJson(res, 404, { error: 'Conversation not found' }); return; }
    if (result === 'forbidden') { sendJson(res, 403, { error: 'Access denied' }); return; }
    sendJson(res, 200, result);
  } catch (err) {
    console.error('[conversations] get error:', err.message);
    sendJson(res, 500, { error: 'Internal server error' });
  }
}

/** DELETE /api/conversations/:id */
export async function handleDeleteConversation(req, res, conversationId) {
  const user = getCurrentUser(req);
  if (!user) { sendJson(res, 401, { error: 'Authentication required' }); return; }

  try {
    const result = await deleteConversation(conversationId, user.userId);
    if (result === 'not_found') { sendJson(res, 404, { error: 'Conversation not found' }); return; }
    if (result === 'forbidden') { sendJson(res, 403, { error: 'Access denied' }); return; }
    sendJson(res, 200, { ok: true });
  } catch (err) {
    console.error('[conversations] delete error:', err.message);
    sendJson(res, 500, { error: 'Internal server error' });
  }
}
