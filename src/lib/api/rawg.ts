// RAWG API client

import type { RawgSearchResponse, RawgGameDetails } from '@/lib/types/rawg';
import { Cache } from '@/lib/utils/cache';
import { fetchApiData } from './common';

const RAWG_API = 'https://api.rawg.io/api';
// Use localStorage for persistent cache across page refreshes (reduces API calls significantly)
const searchCache = new Cache<RawgSearchResponse>('rawg_search_cache');
const gameCache = new Cache<RawgGameDetails | null>('rawg_game_cache');

/**
 * Search for a game by name
 */
export async function searchGame(gameName: string, apiKey: string | undefined): Promise<RawgGameDetails | null> {
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }

  // Clean and normalize game name - remove common suffixes and prefixes
  // This helps avoid duplicate requests for the same game with different formatting
  const cleanName = gameName
    .replace(/\s*-\s*.*$/, '') // Remove everything after dash
    .replace(/\s*\(.*?\)/g, '') // Remove parentheses content
    .replace(/\s*:\s*.*$/, '') // Remove everything after colon
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .trim()
    .toLowerCase(); // Normalize to lowercase for better cache hits

  const cacheKey = `rawg_search_${cleanName}`;
  
  // Check cache first
  const cached = gameCache.get(cacheKey);
  if (cached !== null) return cached;

  try {
    const searchUrl = `${RAWG_API}/games?search=${encodeURIComponent(cleanName)}&key=${apiKey}&page_size=1`;
    
    // Use a temporary cache wrapper for search results
    const tempSearchCache = {
      get: (key: string) => searchCache.get(key),
      set: (key: string, data: RawgSearchResponse, ttl: number) => searchCache.set(key, data, ttl),
    };
    
    const searchData = await fetchApiData<RawgSearchResponse>(
      searchUrl,
      tempSearchCache,
      cacheKey,
      { timeout: 5000 }
    );

    if (!searchData || !searchData.results || searchData.results.length === 0) {
      // Cache negative result for 7 days (game won't be found later either)
      gameCache.set(cacheKey, null, 7 * 24 * 60 * 60 * 1000);
      return null;
    }

    // Get the first result (most relevant)
    const game = searchData.results[0];
    
    // Fetch detailed game information
    const gameDetails = await fetchGameDetails(game.id, apiKey);
    
    if (gameDetails) {
      // Cache for 7 days (game data rarely changes)
      gameCache.set(cacheKey, gameDetails, 7 * 24 * 60 * 60 * 1000);
      return gameDetails;
    }

    // If details fetch fails, return basic game info
    const basicGame: RawgGameDetails = {
      ...game,
      description: '',
      description_raw: '',
    };
    // Cache basic game info for 7 days too
    gameCache.set(cacheKey, basicGame, 7 * 24 * 60 * 60 * 1000);
    return basicGame;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('RAWG API error:', error);
    }
    // Cache error for 1 hour (to avoid hammering API on repeated failures)
    gameCache.set(cacheKey, null, 60 * 60 * 1000);
    return null;
  }
}

/**
 * Fetch detailed game information by ID
 */
export async function fetchGameDetails(gameId: number, apiKey: string): Promise<RawgGameDetails | null> {
  if (!apiKey || apiKey.trim() === '') return null;

  const cacheKey = `rawg_game_${gameId}`;
  
  // Check cache first
  const cached = gameCache.get(cacheKey);
  if (cached !== null) return cached;

  try {
    const gameUrl = `${RAWG_API}/games/${gameId}?key=${apiKey}`;
    
    // Use a temporary cache wrapper for game details
    const tempGameCache = {
      get: (key: string) => {
        const cached = gameCache.get(key);
        return cached;
      },
      set: (key: string, data: RawgGameDetails, ttl: number) => {
        gameCache.set(key, data, ttl);
      },
    };
    
    const gameData = await fetchApiData<RawgGameDetails>(
      gameUrl,
      tempGameCache,
      cacheKey,
      { timeout: 5000 }
    );

    if (gameData) {
      // Cache for 24 hours
      gameCache.set(cacheKey, gameData, 86400000);
      return gameData;
    }

    // Cache negative result for 1 hour
    gameCache.set(cacheKey, null, 60 * 60 * 1000);
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('RAWG API error:', error);
    }
    // Cache error for 1 hour
    gameCache.set(cacheKey, null, 60 * 60 * 1000);
    return null;
  }
}

/**
 * Get game image URL (prefers background_image, falls back to screenshots)
 */
export function getGameImageUrl(game: RawgGameDetails | null): string | null {
  if (!game) return null;
  
  // Prefer background_image (usually higher quality)
  if (game.background_image) {
    return game.background_image;
  }
  
  // Fall back to first screenshot
  if (game.short_screenshots && game.short_screenshots.length > 0) {
    return game.short_screenshots[0].image;
  }
  
  return null;
}


