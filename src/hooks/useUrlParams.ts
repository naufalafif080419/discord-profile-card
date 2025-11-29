'use client';

import { useSearchParams } from 'next/navigation';
import { parseUrlParams, type UrlParams } from '@/lib/utils/url';
import { useMemo } from 'react';

export function useUrlParams(): UrlParams {
  const searchParams = useSearchParams();
  
  return useMemo(() => {
    if (!searchParams) {
      return {};
    }
    const params = new URLSearchParams(searchParams.toString());
    return parseUrlParams(params);
  }, [searchParams]);
}

