// Common API fetch utilities

interface FetchOptions {
  bypassCache?: boolean;
  timeout?: number;
}

export async function fetchApiData<T>(
  url: string,
  cache: { get: (key: string) => T | null; set: (key: string, data: T, ttl: number) => void },
  cacheKey: string,
  options: FetchOptions = {}
): Promise<T | null> {
  const { bypassCache = false, timeout = 10000 } = options;

  // Check cache first (unless bypassing for real-time updates)
  if (!bypassCache) {
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      mode: 'cors',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Cache null result with shorter TTL
      cache.set(cacheKey, null as any, 60000); // 1 minute for failed requests
      return null;
    }

    const data: T = await response.json();

    // Cache successful result with TTL
    // Only cache if not bypassing (for real-time updates, we want fresh data)
    if (!bypassCache) {
      // TTL will be set by the caller
      return data;
    }
    return data;
  } catch (error) {
    // Cache null result with shorter TTL
    cache.set(cacheKey, null as any, 60000);
    return null;
  }
}

