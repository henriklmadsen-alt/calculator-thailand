const base = (process.env.PAPERCLIP_API_URL || '').replace(/\/+$/, '');
const key = process.env.PAPERCLIP_API_KEY;
const issue = process.env.PAPERCLIP_TASK_ID;
if (!base || !key || !issue) throw new Error('missing env');
const headers = { Authorization: `Bearer ${key}` };
if (process.env.PAPERCLIP_RUN_ID) headers['x-paperclip-run-id'] = process.env.PAPERCLIP_RUN_ID;
fetch(`${base}/api/issues/${issue}/comments?order=desc&limit=8`, { headers })
  .then(async (r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
    return r.json();
  })
  .then((d) => {
    const arr = Array.isArray(d) ? d : (Array.isArray(d.value) ? d.value : []);
    for (const c of arr) {
      console.log('---');
      console.log(c.id);
      console.log(c.authorAgentId || c.authorUserId || 'unknown-author');
      console.log(c.body);
    }
  })
  .catch((e) => {
    console.error(e.message || e);
    process.exit(1);
  });
