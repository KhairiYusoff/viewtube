'use client';

import useSWRInfinite from 'swr/infinite';
import { fetcher } from '@/lib/fetcher';
import { Video } from '@/types/video';

type VideosResponse = {
  items: Video[];
  nextPageToken?: string;
};

const getKey = (
  category?: string,
  pageIndex?: number,
  previousPageData?: VideosResponse | null,
) => {
  if (previousPageData && !previousPageData.nextPageToken) {
    return null;
  }

  const params = new URLSearchParams();
  if (category) {
    params.set('category', category);
  }

  if (pageIndex && pageIndex > 0) {
    params.set('pageToken', previousPageData?.nextPageToken ?? '');
  }

  const queryString = params.toString();
  return `/api/v1/videos${queryString ? `?${queryString}` : ''}`;
};

export function useVideos(category?: string) {
  const { data, error, size, setSize, isValidating } = useSWRInfinite<VideosResponse>(
    (index, previousPageData) => getKey(category, index, previousPageData),
    fetcher,
  );

  const videos = data?.flatMap((page) => page.items) ?? [];
  const nextPageToken = data?.[data.length - 1]?.nextPageToken;
  const isLoading = !data && !error;
  const hasMore = Boolean(nextPageToken);

  return {
    videos,
    nextPageToken,
    isLoading,
    isValidating,
    error,
    size,
    loadMore: () => setSize(size + 1),
    hasMore,
  };
}
