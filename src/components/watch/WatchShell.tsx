'use client';

import { useMemo, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { VideoPlayer } from '@/components/watch/VideoPlayer';
import { WatchlistButton } from '@/components/watch/WatchlistButton';
import { RelatedVideos } from '@/components/watch/RelatedVideos';
import { useVideoDetail, useWatchlist } from '@/hooks';

interface WatchShellProps {
  videoId: string;
}

export function WatchShell({ videoId }: WatchShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { video, isLoading, error } = useVideoDetail(videoId);
  const { isInWatchlist, toggleItem } = useWatchlist();

  const watchlistItem = useMemo(
    () =>
      video
        ? {
            id: video.id,
            title: video.title,
            thumbnail: video.thumbnail,
            channelTitle: video.channelTitle,
            duration: video.duration,
          }
        : null,
    [video],
  );

  const isSaved = video ? isInWatchlist(video.id) : false;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="mx-auto flex w-full max-w-8xl flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row md:pl-0">
        <section className="flex-1 space-y-6">
          {isLoading ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center text-sm text-zinc-400">
              Loading video...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-dashed border-red-700 bg-red-950 p-10 text-center text-sm text-red-400">
              <div className="text-lg font-medium">Failed to load video</div>
              <div className="mt-2 text-xs">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </div>
            </div>
          ) : video ? (
            <>
              <VideoPlayer videoId={video.id} title={video.title} />
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold text-white">{video.title}</h1>
                    <p className="mt-2 text-sm text-zinc-400">{video.channelTitle}</p>
                  </div>
                  <WatchlistButton
                    isSaved={isSaved}
                    onToggle={() => watchlistItem && toggleItem(watchlistItem)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl bg-zinc-900 p-4 text-sm text-zinc-300">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Views</div>
                    <div className="mt-2 text-base font-medium text-white">{video.viewCount}</div>
                  </div>
                  <div className="rounded-3xl bg-zinc-900 p-4 text-sm text-zinc-300">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Published
                    </div>
                    <div className="mt-2 text-base font-medium text-white">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-zinc-900 p-4 text-sm text-zinc-300">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Duration</div>
                    <div className="mt-2 text-base font-medium text-white">{video.duration}</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-950 p-10 text-center text-sm text-zinc-400">
              Video not found.
            </div>
          )}
        </section>

        <aside className="w-full md:w-[360px]">
          <RelatedVideos channelId={video?.channelId} />
        </aside>
      </main>
    </div>
  );
}
