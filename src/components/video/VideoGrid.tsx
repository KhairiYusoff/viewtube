import { Video } from '@/types/video';
import { VideoCard } from './VideoCard';
import { VideoSkeleton } from './VideoSkeleton';

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
  skeletonCount?: number;
}

export function VideoGrid({ videos, isLoading = false, skeletonCount = 8 }: VideoGridProps) {
    if (isLoading) {
      return (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <VideoSkeleton key={index} />
          ))}
        </div>
      );
    }

  if (videos.length===0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-950 p-10 text-center text-sm text-zinc-400 h-80 flex items-center justify-center">
        No videos available.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
