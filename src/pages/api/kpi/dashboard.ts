import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    const configuredToken = process.env.KPI_API_TOKEN?.trim();
    if (!configuredToken) {
      return new Response(
        JSON.stringify({
          error: 'KPI API token not configured',
          message: 'Set KPI_API_TOKEN before using the admin dashboard',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.slice(7);
    if (token !== configuredToken) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get days from query param (default 30)
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30', 10);

    // Parse GSC/GA4 credentials from environment. GSC is required for SEO rankings;
    // GA4 is optional so the dashboard still works while analytics auth is being connected.
    const parseJsonEnv = (name: string) => {
      const value = process.env[name];
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch {
        throw new Error(`${name} contains invalid JSON`);
      }
    };

    const gscKeyJson = parseJsonEnv('GSC_SERVICE_ACCOUNT_JSON');
    const ga4KeyJson = parseJsonEnv('GA4_SERVICE_ACCOUNT_JSON');

    if (!gscKeyJson) {
      return new Response(
        JSON.stringify({
          error: 'GSC credentials not configured',
          message: 'Set GSC_SERVICE_ACCOUNT_JSON to enable ranking and CTR reporting',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const warnings: string[] = [];
    const ga4PropertyId = process.env.GA4_PROPERTY_ID?.trim() || '';
    const hasGa4 = Boolean(ga4KeyJson && ga4PropertyId);
    if (!hasGa4) {
      warnings.push('GA4 service-account access is not configured; organic sessions, users, and revenue are shown as 0.');
    }

    // Dynamically import services (server-side only)
    const { GSCService, GA4Service } = await import('../../../lib/gsc-ga4-service');

    // Initialize services
    const gscService = new GSCService({
      keyFileJson: gscKeyJson,
      gscSiteUrl: process.env.GSC_SITE_URL || 'https://www.kamnuanlek.com/',
    });

    const ga4Service = hasGa4
      ? new GA4Service({
          keyFileJson: ga4KeyJson,
          propertyId: ga4PropertyId,
        })
      : null;

    // Fetch data in parallel
    const [keywords, organicMetrics, pageIndexing] = await Promise.all([
      gscService.getTopKeywords(days).catch(() => []),
      ga4Service
        ? ga4Service.getOrganicMetrics(days).catch(() => {
            warnings.push('GA4 request failed; organic sessions, users, and revenue are shown as 0.');
            return { sessions: 0, users: 0, revenue: 0 };
          })
        : Promise.resolve({ sessions: 0, users: 0, revenue: 0 }),
      gscService.getPageIndexing().catch(() => ({ indexed: 0, notIndexed: 0 })),
    ]);

    const kpiData = {
      timestamp: new Date().toISOString(),
      period: `${days} days`,
      dataSources: {
        gsc: true,
        ga4: hasGa4,
      },
      warnings,
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
