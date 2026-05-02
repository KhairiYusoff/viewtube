'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Video } from '@/types/video';

export function useVideoDetail(id?: string) {
  const { data, error, isValidating } = useSWR<Video>(id ? `/api/v1/videos/${id}` : null, fetcher);

  return {
    video: data,
    isLoading: !data && !error,
    isValidating,
    error,
  };
}
