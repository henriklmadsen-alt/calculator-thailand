const fs = require('fs');
const baseUrl = (process.env.PAPERCLIP_API_URL || '').replace(/\/+$/, '');
const apiKey = process.env.PAPERCLIP_API_KEY;
const issueId = process.env.PAPERCLIP_TASK_ID;
if (!baseUrl || !apiKey || !issueId) throw new Error('Missing PAPERCLIP env');
const body = fs.readFileSync('.tmp/t079_handoff_comment.md', 'utf8');
fetch(`${baseUrl}/api/issues/${issueId}/comments`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    ...(process.env.PAPERCLIP_RUN_ID ? { 'x-paperclip-run-id': process.env.PAPERCLIP_RUN_ID } : {}),
  },
  body: JSON.stringify({ body }),
})
  .then(async (res) => {
    if (!res.ok) throw new Error(`POST failed ${res.status}: ${await res.text()}`);
    const data = await res.json();
    console.log(`posted_comment_id=${data.id}`);
  })
  .catch((e) => {
    console.error(e.message || e);
    process.exit(1);
  });
