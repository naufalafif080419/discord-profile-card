// Cache utilities with localStorage persistence for RAWG API

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class Cache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private storageKey: string | null = null;
  private useLocalStorage: boolean = false;

  constructor(storageKey?: string) {
    if (storageKey && typeof window !== 'undefined') {
      this.storageKey = storageKey;
      this.useLocalStorage = true;
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    if (!this.storageKey || typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        // Only load non-expired entries
        for (const [key, entry] of Object.entries(parsed)) {
          const cacheEntry = entry as CacheEntry<T>;
          const age = now - cacheEntry.timestamp;
          if (age < cacheEntry.ttl) {
            this.cache.set(key, cacheEntry);
          }
        }
      }
    } catch (error) {
      // Ignore storage errors (quota exceeded, etc.)
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to load cache from localStorage:', error);
      }
    }
  }

  private saveToStorage(): void {
    if (!this.storageKey || typeof window === 'undefined') return;
    
    try {
      const toStore: Record<string, CacheEntry<T>> = {};
      const now = Date.now();
      
      // Only save non-expired entries
      for (const [key, entry] of this.cache.entries()) {
        const age = now - entry.timestamp;
        if (age < entry.ttl) {
          toStore[key] = entry;
        }
      }
      
      // Limit storage size to ~2MB (localStorage limit is usually 5-10MB)
      const json = JSON.stringify(toStore);
      if (json.length > 2 * 1024 * 1024) {
        // If too large, remove oldest entries
        const entries = Array.from(this.cache.entries())
          .sort((a, b) => a[1].timestamp - b[1].timestamp);
        
        const toStore2: Record<string, CacheEntry<T>> = {};
        let size = 0;
        for (let i = entries.length - 1; i >= 0 && size < 1.5 * 1024 * 1024; i--) {
          const [key, entry] = entries[i];
          const entryJson = JSON.stringify({ [key]: entry });
          if (size + entryJson.length < 1.5 * 1024 * 1024) {
            toStore2[key] = entry;
            size += entryJson.length;
          }
        }
        localStorage.setItem(this.storageKey!, JSON.stringify(toStore2));
      } else {
        localStorage.setItem(this.storageKey!, json);
      }
    } catch (error) {
      // Ignore storage errors (quota exceeded, etc.)
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to save cache to localStorage:', error);
      }
    }
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // All entries should be in new format with timestamp and ttl
    if (typeof entry === 'object' && 'timestamp' in entry && 'ttl' in entry) {
      const age = Date.now() - entry.timestamp;
      if (age < entry.ttl) {
        return entry.data;
      } else {
        // Cache expired, remove it
        this.cache.delete(key);
        if (this.useLocalStorage) {
          this.saveToStorage();
        }
        return null;
      }
    }
    // If entry exists but doesn't match expected format, remove it
    this.cache.delete(key);
    return null;
  }

  set(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
    
    if (this.useLocalStorage) {
      this.saveToStorage();
    }
  }

  delete(key: string): void {
    this.cache.delete(key);
    if (this.useLocalStorage) {
      this.saveToStorage();
    }
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
    if (this.useLocalStorage && this.storageKey && typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }
}

