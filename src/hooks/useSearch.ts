'use client';

import { useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { fetcher } from '@/lib/fetcher';
import { Video } from '@/types/video';

type SearchResponse = {
  items: Video[];
  nextPageToken?: string;
};

const getKey = (query: string, pageIndex: number, previousPageData: SearchResponse | null) => {
  if (!query) {
    return null;
  }

  if (previousPageData && !previousPageData.nextPageToken) {
    return null;
  }

  const params = new URLSearchParams();
  params.set('q', query);

  if (pageIndex > 0) {
    params.set('pageToken', previousPageData?.nextPageToken ?? '');
  }

  return `/api/v1/search?${params.toString()}`;
};

export function useSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query]);

  const { data, error, size, setSize, isValidating } = useSWRInfinite<SearchResponse>(
    (index, previousPageData) => getKey(debouncedQuery.trim(), index, previousPageData),
    fetcher,
  );

  const videos = data?.flatMap((page) => page.items) ?? [];
  const nextPageToken = data?.[data.length - 1]?.nextPageToken;
  const isLoading = !!query && !data && !error;
  const hasMore = Boolean(nextPageToken);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      setSize(1);
    }
  }, [debouncedQuery]);

  return {
    query: debouncedQuery,
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
