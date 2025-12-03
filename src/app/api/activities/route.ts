import { NextRequest, NextResponse } from 'next/server';
import type { LanyardActivity, LanyardSpotify } from '@/lib/types/lanyard';
import { isValidDiscordId } from '@/lib/utils/validation';

// In-memory store for activities and Spotify data
// Key: userId, Value: { activities: LanyardActivity[], spotify: LanyardSpotify | null, updatedAt: number }
const activityStore = new Map<string, {
  activities: LanyardActivity[];
  spotify: LanyardSpotify | null;
  updatedAt: number;
}>();

// Clean up old entries (older than 7 days)
const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

function cleanupOldEntries() {
  const now = Date.now();
  for (const [userId, data] of activityStore.entries()) {
    if (now - data.updatedAt > MAX_AGE) {
      activityStore.delete(userId);
    }
  }
}

// GET: Retrieve stored activities for a user
export async function GET(request: NextRequest) {
  try {
    // Clean up old entries on each request (lightweight check)
    cleanupOldEntries();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || !isValidDiscordId(userId)) {
      return NextResponse.json(
        { error: 'Invalid or missing userId' },
        { status: 400 }
      );
    }

    const stored = activityStore.get(userId);
    
    if (!stored) {
      return NextResponse.json({
        activities: null,
        spotify: null,
      });
    }

    return NextResponse.json({
      activities: stored.activities,
      spotify: stored.spotify,
      updatedAt: stored.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Store activities for a user
export async function POST(request: NextRequest) {
  try {
    // Clean up old entries on each request (lightweight check)
    cleanupOldEntries();
    
    const body = await request.json();
    const { userId, activities, spotify } = body;

    if (!userId || !isValidDiscordId(userId)) {
      return NextResponse.json(
        { error: 'Invalid or missing userId' },
        { status: 400 }
      );
    }

    // Validate activities array
    if (activities !== undefined && !Array.isArray(activities)) {
      return NextResponse.json(
        { error: 'Invalid activities format' },
        { status: 400 }
      );
    }

    // Store the data
    activityStore.set(userId, {
      activities: activities || [],
      spotify: spotify || null,
      updatedAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: 'Activities stored successfully',
    });
  } catch (error) {
    console.error('Error storing activities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

