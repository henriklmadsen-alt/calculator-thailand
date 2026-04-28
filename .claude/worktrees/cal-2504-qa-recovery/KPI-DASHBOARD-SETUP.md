# KPI Dashboard Setup Guide — CAL-2124

**Status:** Ready for deployment (infrastructure code complete, waiting for credentials)  
**Estimated setup time:** 30 minutes (after credentials arrival)  
**Components:** GSC API, GA4 API, Dashboard UI, Real-time ranking tracking, Automated position exports

## Overview

The KPI dashboard provides real-time visibility into:
- **Keyword rankings** — Top 100 Thai calculator keywords, sorted by search volume
- **Position distribution** — #1, #1-5, #1-10 ranking breakdowns
- **Organic traffic** — Sessions, users, revenue from organic search (GA4)
- **Page indexing** — Indexed/non-indexed page count (GSC)
- **Hourly exports** — Automated daily keyword position snapshots

## Architecture

```
KPI Dashboard
├── Frontend: /admin/kpi-dashboard (Astro page)
├── Backend API: /api/kpi/dashboard (GET — fetch data, POST — trigger exports)
├── Services:
│   ├── GSCService — Google Search Console API integration
│   ├── GA4Service — Google Analytics 4 API integration
│   └── PositionExportJob — Scheduled hourly position captures
└── Storage: PostgreSQL (for position export history)
```

## Prerequisites

1. **Google Cloud Project** with:
   - Google Search Console API enabled
   - Google Analytics Data API enabled
   - Service account with appropriate permissions
   - JSON key downloaded

2. **GSC property** already registered at console.google.com/webmasters
   - Property URL: `https://www.kamnuanlek.com/`

3. **GA4 property** with organic search tracking enabled
   - Property ID from GA4 Admin panel

4. **PostgreSQL database** (auto-provisioned on Railway)

5. **Environment variables** set on Railway or local `.env.local`

## Step-by-Step Setup

### 1. Create Service Account in Google Cloud

```bash
# Login to Google Cloud Console
# Project: Select or create a project for Kamnuanlek

# Enable required APIs:
# - Google Search Console API
# - Google Analytics Data API

# Create Service Account:
# 1. Go to: console.cloud.google.com → APIs & Services → Credentials
# 2. Click "Create Credentials" → "Service Account"
# 3. Fill in service account name (e.g., "kamnuanlek-kpi-service")
# 4. Grant roles:
#    - "Search Console Editor" (for GSC)
#    - "Analytics Editor" (for GA4)
# 5. Click "Create Key" → JSON
# 6. Download JSON key file
```

### 2. Grant Service Account Access to Properties

**Google Search Console:**
```
1. Go to: search.google.com/search-console
2. Select property: kamnuanlek.com
3. Settings → Users and permissions
4. Add service account email as "Editor"
```

**Google Analytics 4:**
```
1. Go to: analytics.google.com
2. Select property: Kamnuanlek
3. Admin → Property access management
4. Add service account email with "Editor" role
```

### 3. Configure Environment Variables

On Railway or local `.env.local`:

```bash
# GSC Configuration
GSC_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"your-project","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"kpi-service@your-project.iam.gserviceaccount.com",...}'
GSC_SITE_URL=https://www.kamnuanlek.com/

# GA4 Configuration
GA4_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
GA4_PROPERTY_ID=123456789

# API Security
KPI_API_TOKEN=$(openssl rand -hex 32)
WEBHOOK_SECRET=$(openssl rand -hex 32)
```

**Note on JSON formatting:**
- If using Railway dashboard: Use the JSON editor (copy-paste raw JSON, Railway handles escaping)
- If using `.env.local`: Escape newlines as `\n` in the JSON string, or use a JSON heredoc

### 4. Install Dependencies

```bash
npm install
```

This installs:
- `googleapis` — Google APIs client
- `google-auth-library` — JWT authentication

### 5. Deploy

```bash
# Local testing
npm run dev
# Access dashboard at: http://localhost:3000/admin/kpi-dashboard

# Production deploy
npm run build
# Deploy to Railway or your hosting provider
```

## API Endpoints

### GET /api/kpi/dashboard

Fetch KPI data for a given period.

**Request:**
```bash
curl -H "Authorization: Bearer $KPI_API_TOKEN" \
  "https://www.kamnuanlek.com/api/kpi/dashboard?days=30"
```

**Response:**
```json
{
  "timestamp": "2026-04-26T14:00:00Z",
  "period": "30 days",
  "keywords": {
    "top100": [
      {
        "query": "เครื่องคิดเลขโดยรวม",
        "position": 1.5,
        "impressions": 1234,
        "clicks": 234,
        "ctr": 19.0
      },
      ...
    ],
    "total": 487,
    "avgPosition": 14.3
  },
  "organic": {
    "sessions": 45000,
    "users": 28000,
    "revenue": 1250.50
  },
  "pages": {
    "indexed": 900,
    "notIndexed": 12
  },
  "queriesAt1": 24,
  "queriesAt1To5": 89,
  "queriesAt1To10": 187
}
```

### POST /api/kpi/dashboard

Trigger a manual keyword position export.

**Request:**
```bash
curl -X POST -H "Authorization: Bearer $WEBHOOK_SECRET" \
  "https://www.kamnuanlek.com/api/kpi/dashboard"
```

**Response:**
```json
{
  "status": "success",
  "message": "Position export job queued",
  "exportTime": "2026-04-26T14:00:00Z"
}
```

## Dashboard UI

**Access:** `https://www.kamnuanlek.com/admin/kpi-dashboard`  
**Auth:** Requires valid session (TODO: implement auth check)  

**Features:**
- Real-time KPI cards (queries at #1, #1-5, organic sessions, avg position)
- Ranking distribution breakdown
- Top 20 keywords table with positions, impressions, clicks, CTR
- 5-minute auto-refresh
- Mobile responsive

## Monitoring & Alerts

### Real-time Alerts (Recommended Future Enhancement)

Set up automated alerts for:
- Position drops > 5 spots on top 10 keywords
- Impressions decline > 20% day-over-day
- Click-through rate decline > 2% day-over-day
- New keywords entering top 100

### Scheduled Position Exports

Hourly exports automatically save keyword positions to PostgreSQL table `kpi_position_exports` for historical analysis and trend reporting.

**Table schema (TODO: create migration):**
```sql
CREATE TABLE kpi_position_exports (
  id SERIAL PRIMARY KEY,
  export_date DATE NOT NULL,
  keyword VARCHAR(255) NOT NULL,
  position DECIMAL(5,2),
  impressions INTEGER,
  clicks INTEGER,
  ctr DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_keyword_date ON kpi_position_exports(keyword, export_date);
```

## Troubleshooting

### "GSC/GA4 credentials not configured"
- Check that `GSC_SERVICE_ACCOUNT_JSON` and `GA4_SERVICE_ACCOUNT_JSON` environment variables are set
- Verify JSON is valid (test with `echo $GSC_SERVICE_ACCOUNT_JSON | jq .`)
- Ensure service account email has proper permissions in Google properties

### "Unauthorized" on dashboard access
- Implement authentication (check session, validate JWT token)
- Currently dashboard is open if env vars are set

### "Invalid property ID"
- Verify `GSC_SITE_URL` matches the exact property registered in GSC
- Verify `GA4_PROPERTY_ID` matches the numeric property ID (not the data stream ID)

### API timeout
- GSC API can be slow with large keyword sets
- Consider caching responses for 5-10 minutes
- Implement streaming if response > 50MB

## Future Enhancements

1. **Authentication layer** — Restrict dashboard to admin users
2. **Custom date ranges** — Allow users to select different period (7d, 30d, 90d, custom)
3. **Competitor tracking** — Add keywords for competitor sites for benchmarking
4. **Email reports** — Automated daily/weekly digest emailed to CMO/CEO
5. **Slack integration** — Post significant ranking changes to Slack
6. **A/B testing dashboard** — Track impact of title/meta changes on CTR
7. **Historical trend analysis** — 30/60/90-day ranking improvement charts
8. **Recommendation engine** — Auto-flag keywords to optimize based on position+volume

## Testing

### Local Testing (with mock data)
```bash
npm run dev
# Dashboard will show placeholder data if env vars not set
```

### Production Testing (with real GSC/GA4)
```bash
# Set env vars in Railway
# Deploy
# Access dashboard at https://www.kamnuanlek.com/admin/kpi-dashboard
# Verify top keywords match GSC search console
# Verify organic sessions match GA4
```

## Deployment Checklist

- [ ] Service account created and JSON key downloaded
- [ ] Service account permissions granted in GSC and GA4
- [ ] Environment variables set on Railway dashboard
- [ ] Dependencies installed (`npm install`)
- [ ] Build successful (`npm run build`)
- [ ] Dashboard accessible at `/admin/kpi-dashboard`
- [ ] KPI data loads correctly (no API errors)
- [ ] Top keywords match GSC console manually
- [ ] Organic metrics match GA4 manually
- [ ] Set up hourly position export job (cron or scheduled function)
- [ ] Email alert setup (optional)

## Support

For issues or questions:
- CTO: Check KPI infrastructure logs on Railway
- CMO: Use KPI dashboard for keyword prioritization
- SEO Specialist: Use top 100 keywords list for optimization targeting

**CAL-2124 Issue Link:** [Click to access](/CAL/issues/CAL-2124)  
**Last Updated:** 2026-04-26
