import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

// Phase 4: Event logging for BigQuery
interface Event {
  eventId: string;
  eventType: string;
  userId?: string;
  sessionId: string;
  timestamp: string;
  properties: Record<string, any>;
  pageUrl: string;
  userAgent?: string;
}

const EVENTS_DIR = path.join(process.cwd(), '.events');
const EVENTS_FILE = path.join(EVENTS_DIR, 'events.jsonl');

function ensureDir() {
  if (!fs.existsSync(EVENTS_DIR)) {
    fs.mkdirSync(EVENTS_DIR, { recursive: true });
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function logEvent(event: Event) {
  ensureDir();
  fs.appendFileSync(EVENTS_FILE, JSON.stringify(event) + '\n');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      eventType,
      userId,
      sessionId,
      properties = {},
      pageUrl,
    } = body;

    if (!eventType || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const event: Event = {
      eventId: generateId(),
      eventType,
      userId,
      sessionId,
      timestamp: new Date().toISOString(),
      properties,
      pageUrl,
      userAgent: request.headers.get('user-agent') || undefined,
    };

    logEvent(event);

    return new Response(
      JSON.stringify({ success: true, eventId: event.eventId }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Events API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    ensureDir();
    if (!fs.existsSync(EVENTS_FILE)) {
      return new Response(
        JSON.stringify({ status: 'Event logging active', eventCount: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const content = fs.readFileSync(EVENTS_FILE, 'utf-8');
    const events = content
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line));

    // Aggregated stats
    const eventTypes = {};
    events.forEach((e: Event) => {
      eventTypes[e.eventType] = (eventTypes[e.eventType] || 0) + 1;
    });

    return new Response(
      JSON.stringify({
        status: 'Event logging active',
        eventCount: events.length,
        eventTypes,
        recentEvents: events.slice(-50),
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
