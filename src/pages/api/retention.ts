import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

// Phase 5: Retention & Re-engagement

interface UserSegment {
  userId: string;
  segment: 'high_value' | 'active' | 'at_risk' | 'churned' | 'new';
  lastActive: string;
  totalEngagements: number;
  valueScore: number;
  churnRisk: 0 | 1;
  reEngagementCampaigns: string[];
}

const RETENTION_DIR = path.join(process.cwd(), '.retention');
const SEGMENTS_FILE = path.join(RETENTION_DIR, 'segments.jsonl');

function ensureDir() {
  if (!fs.existsSync(RETENTION_DIR)) {
    fs.mkdirSync(RETENTION_DIR, { recursive: true });
  }
}

function calculateSegment(engagements: number, daysSinceActive: number): UserSegment['segment'] {
  if (daysSinceActive > 30) return 'churned';
  if (daysSinceActive > 7) return 'at_risk';
  if (engagements > 10) return 'high_value';
  if (engagements > 0) return 'active';
  return 'new';
}

function calculateChurnRisk(daysSinceActive: number, segment: UserSegment['segment']): 0 | 1 {
  if (segment === 'churned') return 1;
  if (segment === 'at_risk' && daysSinceActive > 14) return 1;
  return 0;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { userId, lastActive, engagements } = body;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    ensureDir();

    const lastActiveDate = new Date(lastActive || Date.now());
    const daysSinceActive = Math.floor(
      (Date.now() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const segment = calculateSegment(engagements || 0, daysSinceActive);
    const churnRisk = calculateChurnRisk(daysSinceActive, segment);

    const userSegment: UserSegment = {
      userId,
      segment,
      lastActive: lastActiveDate.toISOString(),
      totalEngagements: engagements || 0,
      valueScore: Math.min(100, (engagements || 0) * 5),
      churnRisk,
      reEngagementCampaigns: churnRisk === 1 ? ['email_re_engagement', 'push_notification'] : [],
    };

    fs.appendFileSync(SEGMENTS_FILE, JSON.stringify(userSegment) + '\n');

    return new Response(
      JSON.stringify({
        success: true,
        segment: userSegment.segment,
        churnRisk: userSegment.churnRisk,
        campaigns: userSegment.reEngagementCampaigns,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Retention API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const GET: APIRoute = async () => {
  try {
    ensureDir();
    if (!fs.existsSync(SEGMENTS_FILE)) {
      return new Response(
        JSON.stringify({
          status: 'Retention tracking active',
          segments: { high_value: 0, active: 0, at_risk: 0, churned: 0, new: 0 },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const content = fs.readFileSync(SEGMENTS_FILE, 'utf-8');
    const users = content
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line)) as UserSegment[];

    const segments = {
      high_value: users.filter((u) => u.segment === 'high_value').length,
      active: users.filter((u) => u.segment === 'active').length,
      at_risk: users.filter((u) => u.segment === 'at_risk').length,
      churned: users.filter((u) => u.segment === 'churned').length,
      new: users.filter((u) => u.segment === 'new').length,
    };

    const atRisk = users.filter((u) => u.churnRisk === 1);

    return new Response(
      JSON.stringify({
        status: 'Retention tracking active',
        totalUsers: users.length,
        segments,
        atRiskCount: atRisk.length,
        avgValueScore: (users.reduce((sum, u) => sum + u.valueScore, 0) / users.length).toFixed(1),
        reEngagementCampaigns: atRisk.flatMap((u) => u.reEngagementCampaigns).length,
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
