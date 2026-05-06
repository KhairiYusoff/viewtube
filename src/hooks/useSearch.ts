'use client';

import { useState, useCallback } from 'react';
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

export function useSearch(query?: string) {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(query);
  const [shouldSearch, setShouldSearch] = useState(false);

  const { data, error, size, setSize, isValidating } = useSWRInfinite<SearchResponse>(
    (index, previousPageData) =>
      shouldSearch && searchQuery?.trim()
        ? getKey(searchQuery.trim(), index, previousPageData)
        : null,
    fetcher,
  );

  const videos = data?.flatMap((page) => page.items) ?? [];
  const nextPageToken = data?.[data.length - 1]?.nextPageToken;
  const isLoading = shouldSearch && !!searchQuery && !data && !error;
  const hasMore = Boolean(nextPageToken);

  const executeSearch = useCallback(
    (newQuery: string) => {
      setSearchQuery(newQuery);
      setShouldSearch(true);
      setSize(1);
    },
    [setSize],
  );

  return {
    query: searchQuery,
    videos,
    nextPageToken,
    isLoading,
    isValidating,
    error,
    size,
    loadMore: () => setSize(size + 1),
    hasMore,
    executeSearch,
  };
}
