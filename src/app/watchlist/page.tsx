'use client';

import { useWatchlist } from '@/hooks';
import { VideoGrid } from '@/components/video';

export default function WatchlistPage() {
  const { items, count, removeItem } = useWatchlist();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 md:pl-0">
        <div className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h1 className="text-2xl font-semibold text-white">Watchlist</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {count > 0
              ? `You have ${count} saved video${count === 1 ? '' : 's'}.`
              : 'Your watchlist is empty.'}
          </p>
        </div>

        {count === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-950 p-10 text-center text-sm text-zinc-400">
            Your watchlist is empty. Save videos from the watch page to view them here.
          </div>
        ) : (
          <VideoGrid
            videos={items}
            action={(video) => (
              <button
                type="button"
                onClick={() => removeItem(video.id)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                Remove
              </button>
            )}
          />
        )}
      </main>
    </div>
  );
}
