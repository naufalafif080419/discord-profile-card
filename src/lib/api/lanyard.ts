// Lanyard API client

import type { LanyardResponse } from '@/lib/types/lanyard';
import { Cache } from '@/lib/utils/cache';
import { fetchApiData } from './common';

const LANYARD_API = 'https://api.lanyard.rest/v1/users';
const dataCache = new Cache<LanyardResponse['data']>();
const responseCache = new Cache<LanyardResponse>();

export async function fetchLanyardData(userId: string, bypassCache = false): Promise<LanyardResponse['data'] | null> {
  // Create a wrapper cache for fetchApiData that stores full responses
  const wrapperCache = {
    get: (key: string) => responseCache.get(key),
    set: (key: string, data: LanyardResponse, ttl: number) => {
      responseCache.set(key, data, ttl);
      // Also cache the data portion separately for direct access
      if (data && data.success && data.data) {
        dataCache.set(key, data.data, ttl);
      }
    },
  };

  const data = await fetchApiData<LanyardResponse>(
    `${LANYARD_API}/${userId}`,
    wrapperCache,
    userId,
    { bypassCache }
  );

  if (!data) return null;

  if (!data.success || !data.data) {
    dataCache.set(userId, null as any, 60000);
    return null;
  }

  // Cache successful result with TTL - shorter TTL for faster updates
  // Only cache if not bypassing (for real-time updates, we want fresh data)
  if (!bypassCache) {
    dataCache.set(userId, data.data, 5000); // 5 seconds cache for initial loads
  }
  return data.data;
}

