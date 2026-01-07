import { NextRequest, NextResponse } from 'next/server';
import type { createClient } from 'redis';
import type { LanyardActivity, LanyardSpotify } from '@/lib/types/lanyard';
import { isValidDiscordId } from '@/lib/utils/validation';
import { fetchLanyardData } from '@/lib/api/lanyard';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getRedisClient } from '@/lib/redis';

// Activity data structure stored in Redis
interface ActivityData {
  activities: LanyardActivity[];
  spotify: LanyardSpotify | null;
  updatedAt: number;
}

// Clean up old entries (older than 90 days)
const MAX_AGE = 90 * 24 * 60 * 60 * 1000;

// Helper function to get Redis key for a user
function getKey(userId: string): string {
  return `discord-activities:${userId}`;
}

// Helper function to get Redis key for activity history
function getHistoryKey(userId: string): string {
  return `discord-history:${userId}`;
}

// Helper function to get Redis key for tracked users list
function getTrackedUsersKey(): string {
  return 'discord-activities:tracked-users';
}

// Track a user ID for background updates
async function trackUser(userId: string, client: ReturnType<typeof createClient>): Promise<void> {
  try {
    const trackedUsersKey = getTrackedUsersKey();
    const trackedUsersJson = await client.get(trackedUsersKey);
    const trackedUsers: string[] = trackedUsersJson ? JSON.parse(trackedUsersJson) : [];
    
    if (!trackedUsers.includes(userId)) {
      trackedUsers.push(userId);
      const ttlSeconds = Math.floor(MAX_AGE / 1000);
      await client.setEx(trackedUsersKey, ttlSeconds, JSON.stringify(trackedUsers));
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to track user:', error);
    }
  }
}

// GET: Retrieve stored activities for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || !isValidDiscordId(userId)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    // AUTHENTICATION CHECK
    const session = await getServerSession(authOptions);
    // @ts-ignore - session.user.id is added in authOptions
    const isOwner = session?.user?.id === userId;

    // Proceed with Redis connection for everyone (Read-only for public, Write for owner)
    const now = Date.now();
    try {
      const client = await getRedisClient();
      
      const key = getKey(userId);
      const storedJson = await client.get(key);
      const historyKey = getHistoryKey(userId);
      // Public users can see history too
      const historyJsonList = await client.lRange(historyKey, 0, 19);
      const history = historyJsonList.map(item => JSON.parse(item));

      let cachedData: ActivityData | null = null;
      if (storedJson) {
        const parsed = JSON.parse(storedJson) as ActivityData;
        if (parsed && now - parsed.updatedAt <= MAX_AGE) {
          cachedData = parsed;
        }
      }

      // IF NOT OWNER: Return cached data only
      if (!isOwner) {
        if (cachedData) {
          return NextResponse.json({ 
            activities: cachedData.activities, 
            spotify: cachedData.spotify, 
            history, 
            isVerified: false, 
            updatedAt: cachedData.updatedAt 
          });
        }
        return NextResponse.json({
          activities: [],
          spotify: null,
          history, // Return history even if current activity is empty
          isVerified: false,
          updatedAt: now
        });
      }

      // IF OWNER: Fetch fresh data and update cache
      try {
        const lanyardData = await fetchLanyardData(userId, true);
        if (lanyardData) {
          const freshActivities = lanyardData.activities || [];
          const freshSpotify = lanyardData.spotify || null;
          const userStatus = lanyardData.discord_status || 'offline';

          if (freshActivities.length > 0 || freshSpotify) {
            const freshData: ActivityData = { activities: freshActivities, spotify: freshSpotify, updatedAt: now };
            await client.setEx(key, Math.floor(MAX_AGE / 1000), JSON.stringify(freshData));
            await trackUser(userId, client);
            return NextResponse.json({ activities: freshActivities, spotify: freshSpotify, history, isVerified: true, updatedAt: now });
          } else {
            // Online but no activities
            if (userStatus !== 'offline' && userStatus !== 'invisible') {
              const emptyData = { activities: [], spotify: null, updatedAt: now };
              await client.setEx(key, Math.floor(MAX_AGE / 1000), JSON.stringify(emptyData));
              return NextResponse.json({ activities: [], spotify: null, history, isVerified: true, updatedAt: now });
            }
            // Offline - fallback to cache
            if (cachedData && cachedData.activities.length > 0 && now - cachedData.updatedAt < 2 * 60 * 60 * 1000) {
              return NextResponse.json({ activities: cachedData.activities, spotify: cachedData.spotify, history, isVerified: true, updatedAt: cachedData.updatedAt });
            }
            return NextResponse.json({ activities: [], spotify: null, history, isVerified: true, updatedAt: now });
          }
        }
      } catch (lanyardError) {
        if (cachedData) return NextResponse.json({ ...cachedData, history, isVerified: true });
      }
      
      return NextResponse.json({ activities: null, spotify: null, history, isVerified: true, updatedAt: now });

    } catch (redisError) {
      console.warn('Redis error:', redisError);
      return NextResponse.json({ activities: null, spotify: null, history: [], isVerified: true, updatedAt: now });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}