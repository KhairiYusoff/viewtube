'use client';

import useSWRInfinite from 'swr/infinite';
import { fetcher } from '@/lib/fetcher';
import { Video } from '@/types/video';

type RelatedResponse = {
  items: Video[];
  nextPageToken?: string;
};

const getKey = (
  playlistId?: string,
  channelId?: string,
  pageIndex?: number,
  previousPageData?: RelatedResponse | null,
) => {
  if (!playlistId && !channelId) {
    return null;
  }

  if (previousPageData && !previousPageData.nextPageToken) {
    return null;
  }

  const params = new URLSearchParams();
  if (playlistId) {
    params.set('playlistId', playlistId);
  } else if (channelId) {
    params.set('channelId', channelId);
  }

  if (pageIndex && pageIndex > 0) {
    params.set('pageToken', previousPageData?.nextPageToken ?? '');
  }

  return `/api/v1/related?${params.toString()}`;
};

export function useRelated(params: { playlistId?: string; channelId?: string }) {
  const { playlistId, channelId } = params;

  const { data, error, size, setSize, isValidating } = useSWRInfinite<RelatedResponse>(
    (index, previousPageData) => getKey(playlistId, channelId, index, previousPageData),
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
