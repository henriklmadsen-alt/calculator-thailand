import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

interface ABTestEvent {
  testId: string;
  variant: 'control' | 'variant_a' | 'variant_b';
  event: 'view' | 'click' | 'submit' | 'conversion';
  pageUrl: string;
  sessionId: string;
  userId?: string;
  value?: number;
  createdAt: string;
}

const TEST_DIR = path.join(process.cwd(), '.ab-tests');
const EVENTS_FILE = path.join(TEST_DIR, 'events.jsonl');

function ensureDir() {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }
}

function saveEvent(event: ABTestEvent) {
  ensureDir();
  fs.appendFileSync(EVENTS_FILE, JSON.stringify(event) + '\n');
}

function getAllEvents(): ABTestEvent[] {
  ensureDir();
  if (!fs.existsSync(EVENTS_FILE)) {
    return [];
  }
  const content = fs.readFileSync(EVENTS_FILE, 'utf-8');
  return content
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { testId, variant, event, pageUrl, sessionId, userId, value } = body;

    if (!testId || !variant || !event || !pageUrl || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const abEvent: ABTestEvent = {
      testId,
      variant,
      event,
      pageUrl,
      sessionId,
      userId,
      value,
      createdAt: new Date().toISOString(),
    };

    saveEvent(abEvent);

    return new Response(
      JSON.stringify({ success: true, eventId: `${testId}-${sessionId}-${Date.now()}` }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AB Test API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const testId = url.searchParams.get('testId');
    const allEvents = getAllEvents();

    const events = testId
      ? allEvents.filter((e) => e.testId === testId)
      : allEvents;

    // Calculate stats
    const stats = {
      total: events.length,
      byVariant: {
        control: events.filter((e) => e.variant === 'control').length,
        variant_a: events.filter((e) => e.variant === 'variant_a').length,
        variant_b: events.filter((e) => e.variant === 'variant_b').length,
      },
      byEvent: {
        view: events.filter((e) => e.event === 'view').length,
        click: events.filter((e) => e.event === 'click').length,
        submit: events.filter((e) => e.event === 'submit').length,
        conversion: events.filter((e) => e.event === 'conversion').length,
      },
      conversionRates: {
        control: calculateConversionRate(events, 'control'),
        variant_a: calculateConversionRate(events, 'variant_a'),
        variant_b: calculateConversionRate(events, 'variant_b'),
      },
    };

    return new Response(
      JSON.stringify({
        status: 'A/B testing framework active',
        stats,
        recentEvents: events.slice(-20),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Stats API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

function calculateConversionRate(
  events: ABTestEvent[],
  variant: 'control' | 'variant_a' | 'variant_b'
): string {
  const variantEvents = events.filter((e) => e.variant === variant);
  if (variantEvents.length === 0) return '0.00%';

  const conversions = variantEvents.filter((e) => e.event === 'conversion').length;
  const views = variantEvents.filter((e) => e.event === 'view').length;

  if (views === 0) return '0.00%';
  const rate = (conversions / views) * 100;
  return `${rate.toFixed(2)}%`;
}
