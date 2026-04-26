# Google Search Console (GSC) Access

## Credential Location

**File:** `.env.gsc` (in project root, never commit to git)

**Status:** ✅ Stored securely since 2026-04-26 09:37 UTC

**Service Account:** `seo-reporting-bot@kamnuanlek-seo-api.iam.gserviceaccount.com`

**Project:** `kamnuanlek-seo-api`

## How to Query Rankings

### Method 1: Node.js Script (Easiest)

```bash
node scripts/gsc-rankings.mjs
```

Output: Top 100 keywords by clicks (last 30 days)
- Query name
- Click count
- Impressions
- CTR %
- Average position

### Method 2: Manual API Call

```javascript
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.gsc' });

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const webmasters = google.webmasters({ version: 'v3', auth });
const response = await webmasters.searchanalytics.query({
  siteUrl: 'https://www.kamnuanlek.com/',
  requestBody: {
    startDate: '2026-04-01',
    endDate: '2026-04-26',
    dimensions: ['query'],
    rowLimit: 100,
  },
});

console.log(response.data.rows);
```

## Available Metrics

- **Position:** Average ranking position in Google (1 = top)
- **Impressions:** Times the site appeared in search results
- **Clicks:** Users who clicked through to the site
- **CTR:** Click-through rate (clicks / impressions)

## Key Thai Calculators to Track

| Calculator | Target Keyword | Goal Position |
|---|---|---|
| Mortgage | คำนวณผ่อนบ้าน | #1 |
| Car Loan | คำนวณผ่อนรถ | #1 |
| Net Salary | คำนวณเงินเดือนสุทธิ | #1 |
| Income Tax | คำนวณภาษีเงินได้ | Top 5 |
| General Loan | คำนวณผ่อนกู้ | #1 |

## Troubleshooting

**Error: "GSC_SERVICE_ACCOUNT_JSON not found"**
- Make sure `.env.gsc` exists in the project root
- Restart your Node process to reload environment variables

**Error: "Invalid credentials"**
- Check that `.env.gsc` hasn't been corrupted
- Verify the file is readable: `cat .env.gsc | head -1`

**No data returned**
- GSC takes 24-48 hours to show new data after site changes
- Check that the site is verified in Google Search Console
- Data is typically 2-3 days behind current date

## Security Notes

- 🔒 `.env.gsc` is in `.gitignore` - never committed to git
- 🔒 Service account has READ-ONLY access to GSC
- 🔒 Do not share this file outside the team
- 🔒 If compromised, contact Google Cloud to rotate credentials

---

**Updated:** 2026-04-26 09:37 UTC  
**Board Note:** "HARDCODE IT IN SOMEHOW WHERE YOU CAN FIND IT AGAIN, I AM TIRED TO SHARE IT OVER AND OVER"  
✅ Done. It's stored here now. Stop asking.
