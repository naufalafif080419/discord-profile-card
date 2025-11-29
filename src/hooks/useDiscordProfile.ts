'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchLanyardData } from '@/lib/api/lanyard';
import { fetchDstnData } from '@/lib/api/dstn';
import { fetchLanternData } from '@/lib/api/lantern';
import type { LanyardResponse } from '@/lib/types/lanyard';
import type { DstnResponse } from '@/lib/types/dstn';
import type { LanternResponse } from '@/lib/types/lantern';
import { isValidDiscordId } from '@/lib/utils/validation';

export interface ProfileData {
  lanyard: LanyardResponse['data'] | null;
  dstn: DstnResponse | null;
  lantern: LanternResponse | null;
  loading: boolean;
  error: Error | null;
}

export function useDiscordProfile(userId: string | null, autoUpdate = false, updateInterval = 10000) {
  const [profile, setProfile] = useState<ProfileData>({
    lanyard: null,
    dstn: null,
    lantern: null,
    loading: true,
    error: null,
  });

  const fetchProfile = useCallback(async (id: string) => {
    if (!isValidDiscordId(id)) {
      setProfile(prev => ({ ...prev, loading: false, error: new Error('Invalid Discord ID') }));
      return;
    }

    setProfile(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [lanyardData, dstnData, lanternData] = await Promise.all([
        fetchLanyardData(id),
        fetchDstnData(id),
        fetchLanternData(id),
      ]);

      setProfile({
        lanyard: lanyardData,
        dstn: dstnData,
        lantern: lanternData,
        loading: false,
        error: null,
      });
    } catch (error) {
      setProfile(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to fetch profile'),
      }));
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setProfile(prev => ({ ...prev, loading: false }));
      return;
    }

    fetchProfile(userId);

    if (autoUpdate) {
      const interval = setInterval(() => {
        fetchProfile(userId);
      }, updateInterval);

      return () => clearInterval(interval);
    }
  }, [userId, autoUpdate, updateInterval, fetchProfile]);

  return { ...profile, refetch: () => userId && fetchProfile(userId) };
}

