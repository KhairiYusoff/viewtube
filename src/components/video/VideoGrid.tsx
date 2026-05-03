import type { ReactNode } from 'react';
import { Video } from '@/types/video';
import { VideoCard } from './VideoCard';
import { VideoSkeleton } from './VideoSkeleton';

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
  error?: unknown;
  skeletonCount?: number;
  action?: (video: Video) => ReactNode;
}

export function VideoGrid({ videos, isLoading = false, error, skeletonCount = 8, action }: VideoGridProps) {
  if (error) {
    return (
      <div className="rounded-3xl border border-dashed border-red-700 bg-red-950 p-10 text-center text-sm text-red-400 h-80 flex flex-col items-center justify-center gap-4">
        <div className="text-lg font-medium">Failed to load videos</div>
        <div className="text-xs text-red-500">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full bg-red-800 px-4 py-2 text-xs text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading && videos.length === 0) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <VideoSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-950 p-10 text-center text-sm text-zinc-400 h-80 flex items-center justify-center">
        No videos available.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} action={action ? action(video) : undefined} />
      ))}
    </div>
  );
}
