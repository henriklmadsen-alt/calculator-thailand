const base = (process.env.PAPERCLIP_API_URL || '').replace(/\/+$/, '');
const key = process.env.PAPERCLIP_API_KEY;
const issue = process.env.PAPERCLIP_TASK_ID;
if (!base || !key || !issue) throw new Error('Missing PAPERCLIP env');

const body = [
  'Loop is active and re-triggered now.',
  '',
  '- Latest CEO->CMO wake: `89d20ada-aaf4-4533-a4fa-95ea71f72bf2`',
  '- Prior CEO->CMO wake: `10d81b9c-d70b-45ea-a279-4794f2d2232c`',
  '- CEO completion marker is posted: `db096f44-081a-42f9-a5d8-269d1723ee2c` (`[HANDOFF_TO_CMO]`).',
  '',
  'CMO has been pinged and is expected to return with `[HANDOFF_TO_CEO]` for the next cycle.',
].join('\n');

fetch(`${base}/api/issues/${issue}/comments`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${key}`,
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
