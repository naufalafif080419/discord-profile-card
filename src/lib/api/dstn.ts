// dstn.to API client

import type { DstnResponse } from '@/lib/types/dstn';
import { Cache } from '@/lib/utils/cache';
import { fetchApiData } from './common';

const DSTN_API = 'https://dcdn.dstn.to/profile';
const cache = new Cache<DstnResponse>();

export async function fetchDstnData(userId: string, bypassCache = false): Promise<DstnResponse | null> {
  const data = await fetchApiData<DstnResponse>(
    `${DSTN_API}/${userId}`,
    cache,
    userId,
    { bypassCache }
  );

  if (!data) return null;

  // Cache successful result with TTL - shorter TTL for faster updates
  // Only cache if not bypassing (for real-time updates, we want fresh data)
  if (!bypassCache) {
    cache.set(userId, data, 5 * 60 * 1000); // 5 minutes cache for initial loads
  }
  return data;
}

