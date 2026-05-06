'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { VideoGrid } from '@/components/video';
import { useSearch } from '@/hooks';

interface SearchShellProps {
  initialQuery: string;
}

export function SearchShell({ initialQuery }: SearchShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { videos, isLoading, isValidating, error, loadMore, hasMore, query, executeSearch } =
    useSearch();

  // Only execute search if there's an initial query
  const handleInitialSearch = useCallback(() => {
    if (initialQuery && !query) {
      executeSearch(initialQuery);
    }
  }, [initialQuery, query, executeSearch]);

  useEffect(() => {
    handleInitialSearch();
  }, [handleInitialSearch]);

  useEffect(() => {
    // Always disconnect and reset on effect re-run
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    const sentinel = sentinelRef.current;
    // Guard: only observe if we have more data and not currently loading
    if (!sentinel || !hasMore || isValidating) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Double-check guards before loading more (prevent race conditions)
        if (entries[0].isIntersecting && hasMore && !isValidating) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    observerRef.current.observe(sentinel);
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [hasMore, isValidating, loadMore]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="mx-auto flex w-full max-w-8xl gap-6 px-4 py-6 sm:px-6 md:pl-0">
        <section className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white">
              {query ? `Results for "${query}"` : 'Search Videos'}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              {videos.length > 0 && `Found ${videos.length}+ videos`}
            </p>
          </div>
          <VideoGrid videos={videos} isLoading={isLoading} error={error} />
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300" />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
