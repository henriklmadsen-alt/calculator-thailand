import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

interface FeedbackPayload {
  rating: number;
  comment: string;
  userAgent?: string;
  pageUrl?: string;
  sessionId?: string;
  userId?: string;
}

interface FeedbackRecord extends FeedbackPayload {
  id: string;
  createdAt: string;
}

const FEEDBACK_DIR = path.join(process.cwd(), '.feedback');
const FEEDBACK_FILE = path.join(FEEDBACK_DIR, 'feedback.jsonl');

// Ensure feedback directory exists
function ensureDir() {
  if (!fs.existsSync(FEEDBACK_DIR)) {
    fs.mkdirSync(FEEDBACK_DIR, { recursive: true });
  }
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Append feedback to JSONL file
function saveFeedback(feedback: FeedbackRecord) {
  ensureDir();
  fs.appendFileSync(FEEDBACK_FILE, JSON.stringify(feedback) + '\n');
}

// Read all feedback
function getAllFeedback(): FeedbackRecord[] {
  ensureDir();
  if (!fs.existsSync(FEEDBACK_FILE)) {
    return [];
  }
  const content = fs.readFileSync(FEEDBACK_FILE, 'utf-8');
  return content
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload: FeedbackPayload = await request.json();

    // Validate required fields
    if (!payload.rating) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: rating' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create feedback record
    const feedback: FeedbackRecord = {
      ...payload,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    // Save feedback
    saveFeedback(feedback);

    return new Response(
      JSON.stringify({
        success: true,
        feedbackId: feedback.id,
        message: 'Feedback recorded successfully',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Feedback API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const GET: APIRoute = async () => {
  try {
    const allFeedback = getAllFeedback();
    const stats = {
      total: allFeedback.length,
      avgRating: allFeedback.length > 0
        ? (allFeedback.reduce((sum, f) => sum + (f.rating || 0), 0) / allFeedback.length).toFixed(1)
        : 0,
      ratingDistribution: {
        1: allFeedback.filter(f => f.rating === 1).length,
        2: allFeedback.filter(f => f.rating === 2).length,
        3: allFeedback.filter(f => f.rating === 3).length,
        4: allFeedback.filter(f => f.rating === 4).length,
        5: allFeedback.filter(f => f.rating === 5).length,
      },
      withComments: allFeedback.filter(f => f.comment).length,
    };

    return new Response(
      JSON.stringify({
        status: 'Feedback collection active',
        stats,
        recent: allFeedback.slice(-10),
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
