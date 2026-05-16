const base = (process.env.PAPERCLIP_API_URL || '').replace(/\/+$/, '');
const key = process.env.PAPERCLIP_API_KEY;
const issue = process.env.PAPERCLIP_TASK_ID;
if (!base || !key || !issue) throw new Error('missing PAPERCLIP env');
const headers = {
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  ...(process.env.PAPERCLIP_RUN_ID ? { 'x-paperclip-run-id': process.env.PAPERCLIP_RUN_ID } : {}),
};
const body = [
  'Status update: not all 100 are done yet.',
  '',
  '- Completed and QA/deploy verified through `T064`.',
  '- Progress: `64/100` complete, `36` remaining.',
  '- I am continuing immediately on the next P0 handoff items to close the remaining set as fast as possible without relaxing quality gates.',
].join('\n');

fetch(`${base}/api/issues/${issue}/comments`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ body }),
})
  .then(async (r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
    const d = await r.json();
    console.log(`posted_comment_id=${d.id}`);
  })
  .catch((e) => {
    console.error(e.message || e);
    process.exit(1);
  });
