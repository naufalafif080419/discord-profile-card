'use client';

import { useState, useEffect, useRef } from 'react';
import { searchGame, getGameImageUrl } from '@/lib/api/rawg';
import type { RawgGameDetails } from '@/lib/types/rawg';

interface UseRawgGameResult {
  game: RawgGameDetails | null;
  imageUrl: string | null;
  loading: boolean;
}

/**
 * Hook to fetch RAWG game data for a Discord activity
 * Optimized to reduce API requests with debouncing and request deduplication
 */
export function useRawgGame(activityName: string | undefined, apiKey: string | undefined): UseRawgGameResult {
  const [game, setGame] = useState<RawgGameDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentRequestRef = useRef<string | null>(null);

  useEffect(() => {
    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (!apiKey || !activityName || activityName.trim() === '') {
      setGame(null);
      setLoading(false);
      currentRequestRef.current = null;
      return;
    }

    // List of non-game applications to exclude from RAWG API search
    const nonGameApps = [
      // Code editors
      'visual studio code', 'vscode', 'code',
      'sublime text', 'atom', 'notepad++', 'notepad',
      'vim', 'neovim', 'emacs', 'nano',
      // Browsers
      'chrome', 'firefox', 'edge', 'safari', 'opera', 'brave',
      // Development tools
      'github desktop', 'git', 'docker', 'kubernetes',
      'postman', 'insomnia', 'fiddler',
      // Music/Streaming apps
      'spotify', 'apple music', 'tidal', 'youtube', 'twitch',
      'discord', 'slack', 'teams', 'zoom',
      // Office/Productivity
      'microsoft word', 'excel', 'powerpoint', 'outlook',
      'google docs', 'sheets', 'slides',
      // Other common apps
      'photoshop', 'illustrator', 'premiere', 'after effects',
      'obs', 'streamlabs', 'xsplit'
    ];
    
    const activityNameLower = activityName.toLowerCase();
    const isNonGameApp = nonGameApps.some(app => activityNameLower.includes(app));
    
    if (isNonGameApp) {
      setGame(null);
      setLoading(false);
      currentRequestRef.current = null;
      return;
    }

    // Debounce: wait 500ms before making request (reduces requests when switching games quickly)
    debounceTimerRef.current = setTimeout(() => {
      // Skip if we're already loading the same game
      if (currentRequestRef.current === activityName) {
        return;
      }

      currentRequestRef.current = activityName;
      setLoading(true);
      
      searchGame(activityName, apiKey)
        .then((gameData) => {
          // Only update if this is still the current request (user hasn't switched games)
          if (currentRequestRef.current === activityName) {
            setGame(gameData);
            setLoading(false);
          }
        })
        .catch((error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching RAWG game:', error);
          }
          // Only update if this is still the current request
          if (currentRequestRef.current === activityName) {
            setGame(null);
            setLoading(false);
          }
        });
    }, 500); // 500ms debounce

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [activityName, apiKey]);

  const imageUrl = getGameImageUrl(game);

  return {
    game,
    imageUrl,
    loading,
  };
}


