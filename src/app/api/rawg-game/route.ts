import { NextRequest, NextResponse } from 'next/server';
import { isValidDiscordId } from '@/lib/utils/validation';
import { searchGame, getGameImageUrl } from '@/lib/api/rawg';
import { decrypt } from '@/lib/encryption';
import { getRedisClient, RedisKeys } from '@/lib/redis';

// GET: Fetch game data using server-stored API key
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const gameName = searchParams.get('gameName');

    // Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    // Limit to 10 requests per minute per IP
    const RATE_LIMIT_WINDOW = 60; 
    const MAX_REQUESTS = 10;
    
    try {
      const client = await getRedisClient();
      const rateLimitKey = `rate-limit:rawg:${ip}`;
      const currentRequests = await client.incr(rateLimitKey);
      
      if (currentRequests === 1) {
        await client.expire(rateLimitKey, RATE_LIMIT_WINDOW);
      }
      
      if (currentRequests > MAX_REQUESTS) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
    } catch (e) {
      // Fail open if Redis fails for rate limiting (to avoid breaking functionality)
      console.warn('Rate limiting failed:', e);
    }

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
      const key = RedisKeys.rawgKey(userId);
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

