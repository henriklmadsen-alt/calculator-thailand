#!/usr/bin/env node

const LOOP_TAG = '[ceo-cmo-loop]';
const CEO_AGENT_ID = process.env.CEO_AGENT_ID || '0ce56a9a-46f0-4020-b8dd-b95326c8988f';
const CMO_AGENT_ID = process.env.CMO_AGENT_ID || 'de543246-0a6e-4e59-a448-1583433fb5a3';
const CEO_MENTION = process.env.CEO_MENTION || '[@CEO](agent://0ce56a9a-46f0-4020-b8dd-b95326c8988f)';
const CMO_MENTION =
  process.env.CMO_MENTION || '[@CMO](agent://de543246-0a6e-4e59-a448-1583433fb5a3?i=target)';

const HANDOFF_TO_CMO = '[HANDOFF_TO_CMO]';
const HANDOFF_TO_CEO = '[HANDOFF_TO_CEO]';

function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.value)) return payload.value;
  return [];
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function apiRequest({ baseUrl, apiKey, method, endpoint, body }) {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (process.env.PAPERCLIP_RUN_ID) {
    headers['x-paperclip-run-id'] = process.env.PAPERCLIP_RUN_ID;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${method} ${endpoint} failed (${response.status}): ${text}`);
  }

  return response.json();
}

function findLatestTrigger(comments) {
  for (let i = comments.length - 1; i >= 0; i -= 1) {
    const comment = comments[i];
    const body = String(comment.body || '');
    const author = comment.authorAgentId || '';

    if (author === CEO_AGENT_ID && body.includes(HANDOFF_TO_CMO)) {
      return { comment, target: 'CMO' };
    }

    if (author === CMO_AGENT_ID && body.includes(HANDOFF_TO_CEO)) {
      return { comment, target: 'CEO' };
    }
  }
  return null;
}

function alreadyPostedWake(comments, sourceCommentId) {
  return comments.some((comment) => {
    const body = String(comment.body || '');
    return body.includes(LOOP_TAG) && body.includes(`source:${sourceCommentId}`);
  });
}

function buildWakeBody({ sourceCommentId, target }) {
  const mention = target === 'CMO' ? CMO_MENTION : CEO_MENTION;
  const tokenReminder = target === 'CMO' ? HANDOFF_TO_CEO : HANDOFF_TO_CMO;

  return [
    `## CEO-CMO Handoff Loop ${LOOP_TAG}`,
    `<!-- source:${sourceCommentId} -->`,
    '',
    `${mention} handoff received. Take the next task now, execute, and when done post your completion marker.`,
    '',
    `Required completion marker for your next handoff: \`${tokenReminder}\``,
    '',
    'Keep this loop value-focused: no meta-process updates, only deliverable outcomes.',
  ].join('\n');
}

async function main() {
  const baseUrl = requiredEnv('PAPERCLIP_API_URL').replace(/\/+$/, '');
  const apiKey = requiredEnv('PAPERCLIP_API_KEY');
  const issueId = process.env.LOOP_ISSUE_ID || process.env.PAPERCLIP_TASK_ID;
  if (!issueId) {
    throw new Error('Missing LOOP_ISSUE_ID or PAPERCLIP_TASK_ID');
  }

  const dryRun = process.argv.includes('--dry-run');

  const commentsPayload = await apiRequest({
    baseUrl,
    apiKey,
    method: 'GET',
    endpoint: `/api/issues/${issueId}/comments?order=asc`,
  });
  const comments = normalizeCollection(commentsPayload);
  if (comments.length === 0) {
    console.log('No comments found. Nothing to do.');
    return;
  }

  const trigger = findLatestTrigger(comments);
  if (!trigger) {
    console.log(`No handoff trigger found. Waiting for ${HANDOFF_TO_CMO} or ${HANDOFF_TO_CEO}.`);
    return;
  }

  const sourceCommentId = trigger.comment.id;
  const commentsAfterTrigger = comments.filter(
    (comment) => new Date(comment.createdAt).getTime() >= new Date(trigger.comment.createdAt).getTime(),
  );

  if (alreadyPostedWake(commentsAfterTrigger, sourceCommentId)) {
    console.log(`Wake already posted for source comment ${sourceCommentId}.`);
    return;
  }

  const body = buildWakeBody({ sourceCommentId, target: trigger.target });
  if (dryRun) {
    console.log('Dry run: would post wake comment:');
    console.log(body);
    return;
  }

  const posted = await apiRequest({
    baseUrl,
    apiKey,
    method: 'POST',
    endpoint: `/api/issues/${issueId}/comments`,
    body: { body },
  });

  console.log(`Posted wake comment ${posted.id} for trigger ${sourceCommentId} -> ${trigger.target}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

