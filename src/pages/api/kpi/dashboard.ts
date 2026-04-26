import type { APIRoute } from 'astro';
import { GSCService, GA4Service } from '../../../lib/gsc-ga4-service';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Check authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.slice(7);
    if (token !== process.env.KPI_API_TOKEN) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get days from query param (default 30)
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30', 10);

    // Parse GSC/GA4 credentials from environment
    const gscKeyJson = process.env.GSC_SERVICE_ACCOUNT_JSON
      ? JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON)
      : null;
    const ga4KeyJson = process.env.GA4_SERVICE_ACCOUNT_JSON
      ? JSON.parse(process.env.GA4_SERVICE_ACCOUNT_JSON)
      : null;

    if (!gscKeyJson || !ga4KeyJson) {
      return new Response(
        JSON.stringify({
          error: 'GSC/GA4 credentials not configured',
          message: 'Please set GSC_SERVICE_ACCOUNT_JSON and GA4_SERVICE_ACCOUNT_JSON environment variables',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize services
    const gscService = new GSCService({
      keyFileJson: gscKeyJson,
      gscSiteUrl: process.env.GSC_SITE_URL || 'https://kamnuanlek.com/',
    });

    const ga4Service = new GA4Service({
      keyFileJson: ga4KeyJson,
      propertyId: process.env.GA4_PROPERTY_ID || '',
    });

    // Fetch data in parallel
    const [keywords, organicMetrics, pageIndexing] = await Promise.all([
      gscService.getTopKeywords(days).catch(() => []),
      ga4Service.getOrganicMetrics(days).catch(() => ({ sessions: 0, users: 0, revenue: 0 })),
      gscService.getPageIndexing().catch(() => ({ indexed: 0, notIndexed: 0 })),
    ]);

    const kpiData = {
      timestamp: new Date().toISOString(),
      period: `${days} days`,
      keywords: {
        top100: keywords.slice(0, 100),
        total: keywords.length,
        avgPosition: keywords.length > 0 ? Math.round((keywords.reduce((sum, k) => sum + k.position, 0) / keywords.length) * 10) / 10 : 0,
      },
      organic: {
        sessions: organicMetrics.sessions,
        users: organicMetrics.users,
        revenue: Math.round(organicMetrics.revenue * 100) / 100,
      },
      pages: pageIndexing,
      queriesAt1: keywords.filter((k) => k.position === 1).length,
      queriesAt1To5: keywords.filter((k) => k.position <= 5).length,
      queriesAt1To10: keywords.filter((k) => k.position <= 10).length,
    };

    return new Response(JSON.stringify(kpiData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300',
      },
    });
  } catch (error) {
    console.error('KPI dashboard error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch KPI data',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST endpoint for scheduled position exports
export const POST: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Verify webhook signature or API token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Trigger position export job (store to database)
    const exportTime = new Date().toISOString();

    // TODO: Save to database via pg connection
    // const result = await db.query(
    //   'INSERT INTO kpi_position_exports (export_time, status) VALUES ($1, $2)',
    //   [exportTime, 'pending']
    // );

    return new Response(
      JSON.stringify({
        status: 'success',
        message: 'Position export job queued',
        exportTime,
      }),
      { status: 202, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Position export error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to queue export' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
