'use client';

import { useEffect, useRef } from 'react';
import { useRelated } from '@/hooks';
import { VideoCard } from '@/components/video/VideoCard';

interface RelatedVideosProps {
  channelId?: string;
  playlistId?: string;
}

export function RelatedVideos({ channelId, playlistId }: RelatedVideosProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { videos, isLoading, isValidating, error, loadMore, hasMore } = useRelated({
    channelId,
    playlistId,
  });

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isValidating) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
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
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-white">Related videos</h2>
      {error ? (
        <div className="rounded-3xl border border-dashed border-red-700 bg-red-950 p-4 text-sm text-red-400">
          Failed to load related videos.
        </div>
      ) : isLoading && videos.length === 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-video rounded-3xl bg-zinc-100 dark:bg-zinc-900" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
          No related videos found.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      {hasMore && (
        <div ref={sentinelRef} className="mt-5 flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300" />
        </div>
      )}
    </div>
  );
}
