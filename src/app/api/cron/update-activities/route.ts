import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';
import { fetchLanyardData } from '@/lib/api/lanyard';
import { isValidDiscordId } from '@/lib/utils/validation';
import type { LanyardActivity, LanyardSpotify } from '@/lib/types/lanyard';

// Activity data structure stored in Redis
interface ActivityData {
  activities: LanyardActivity[];
  spotify: LanyardSpotify | null;
  updatedAt: number;
}

// Helper function to get Redis key for a user
function getActivityKey(userId: string): string {
  return `discord-activities:${userId}`;
}

// Helper function to get Redis key for tracked users list
function getTrackedUsersKey(): string {
  return 'discord-activities:tracked-users';
}

// Clean up old entries (older than 90 days)
const MAX_AGE = 90 * 24 * 60 * 60 * 1000; // 90 days

// Initialize Redis client
let redis: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (redis && redis.isOpen) {
    return redis;
  }

  try {
    const redisUrl = process.env.KV_URL || process.env.REDIS_URL;
    
    if (!redisUrl) {
      throw new Error('Redis URL not configured. Please set KV_URL or REDIS_URL environment variable.');
    }

    const needsTls = redisUrl.startsWith('rediss://') || redisUrl.includes(':6380');

    const reconnectStrategy = (retries: number) => {
      if (retries > 10) {
        return new Error('Too many reconnection attempts');
      }
      return Math.min(retries * 100, 3000);
    };

    if (needsTls) {
      redis = createClient({
        url: redisUrl,
        socket: {
          tls: true,
          reconnectStrategy,
        },
      });
    } else {
      redis = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy,
        },
      });
    }

    redis.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    await redis.connect();
    return redis;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
}

// Fetch and update activities for a single user
async function updateUserActivities(userId: string): Promise<boolean> {
  try {
    const client = await getRedisClient();
    
    // Fetch fresh data from Lanyard
    const lanyardData = await fetchLanyardData(userId, true);
    
    if (lanyardData) {
      const activities = lanyardData.activities || [];
      const spotify = lanyardData.spotify || null;
      
      // Only update if we have activities or spotify data
      if (activities.length > 0 || spotify) {
        const data: ActivityData = {
          activities,
          spotify,
          updatedAt: Date.now(),
        };
        
        const key = getActivityKey(userId);
        const ttlSeconds = Math.floor(MAX_AGE / 1000);
        await client.setEx(key, ttlSeconds, JSON.stringify(data));
        
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Failed to update activities for user ${userId}:`, error);
    return false;
  }
}

// GET: Cron job endpoint to update activities for all tracked users
// This is called by Vercel Cron Jobs once per day (Hobby plan limitation)
// Note: On Hobby plan, cron jobs can only run once per day and timing is not guaranteed
// The main solution is that /api/activities GET endpoint always fetches fresh data
// This cron job serves as a backup to update activities daily
export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron (optional security check)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await getRedisClient();
    const trackedUsersKey = getTrackedUsersKey();
    
    // Get list of tracked user IDs
    const trackedUsersJson = await client.get(trackedUsersKey);
    const trackedUsers: string[] = trackedUsersJson ? JSON.parse(trackedUsersJson) : [];
    
    if (trackedUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No tracked users to update',
        updated: 0,
      });
    }

    // Update activities for all tracked users in parallel (with concurrency limit)
    const CONCURRENCY_LIMIT = 5; // Process 5 users at a time to avoid rate limits
    const results: { userId: string; success: boolean }[] = [];
    
    for (let i = 0; i < trackedUsers.length; i += CONCURRENCY_LIMIT) {
      const batch = trackedUsers.slice(i, i + CONCURRENCY_LIMIT);
      const batchResults = await Promise.all(
        batch.map(async (userId) => {
          if (!isValidDiscordId(userId)) {
            return { userId, success: false };
          }
          const success = await updateUserActivities(userId);
          return { userId, success };
        })
      );
      results.push(...batchResults);
      
      // Small delay between batches to avoid rate limiting
      if (i + CONCURRENCY_LIMIT < trackedUsers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successCount = results.filter(r => r.success).length;
    
    return NextResponse.json({
      success: true,
      message: `Updated activities for ${successCount} out of ${trackedUsers.length} users`,
      updated: successCount,
      total: trackedUsers.length,
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

