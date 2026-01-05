import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';
import { isValidDiscordId } from '@/lib/utils/validation';
import { searchGame, getGameImageUrl } from '@/lib/api/rawg';
import { decrypt } from '@/lib/encryption';

// Helper function to get Redis key for a user's RAWG API key
function getKey(userId: string): string {
  return `discord-rawg-key:${userId}`;
}

// Initialize Redis client
let redis: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (redis && redis.isOpen) {
    return redis;
  }

  try {
    const redisUrl = process.env.KV_URL || process.env.REDIS_URL;
    
    if (!redisUrl) {
      throw new Error('Redis URL not configured.');
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

// GET: Fetch game data using server-stored API key
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const gameName = searchParams.get('gameName');

    if (!userId || !isValidDiscordId(userId)) {
      return NextResponse.json(
        { error: 'Invalid or missing userId' },
        { status: 400 }
      );
    }

    if (!gameName || gameName.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid or missing gameName' },
        { status: 400 }
      );
    }

    try {
      // Get API key from Redis
      const client = await getRedisClient();
      const key = getKey(userId);
      const encryptedApiKey = await client.get(key);
      
      if (!encryptedApiKey) {
        return NextResponse.json({
          game: null,
          imageUrl: null,
        });
      }

      // Decrypt the API key
      let apiKey: string;
      try {
        apiKey = decrypt(encryptedApiKey);
      } catch (e) {
        console.error('Failed to decrypt API key for game search, User:', userId, e);
        return NextResponse.json({
          game: null,
          imageUrl: null,
        });
      }

      // Fetch game data using server-side API key (never exposed to client)
      const game = await searchGame(gameName, apiKey);
      const imageUrl = game ? getGameImageUrl(game) : null;

      return NextResponse.json({
        game,
        imageUrl,
      });
    } catch (redisError) {
      console.warn('Redis error:', redisError);
      return NextResponse.json({
        game: null,
        imageUrl: null,
      });
    }
  } catch (error) {
    console.error('Error fetching game data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

