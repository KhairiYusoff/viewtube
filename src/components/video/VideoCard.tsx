import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Video } from '@/types/video';

interface VideoCardProps {
  video: Video;
  action?: ReactNode;
}

export function VideoCard({ video, action }: VideoCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-200/60 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800/60 dark:bg-zinc-950">
      <Link href={`/watch/${video.id}`} className="block">
        <div className="relative overflow-hidden rounded-t-3xl bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={video.thumbnail}
            alt={video.title}
            width={320}
            height={180}
            loading="lazy"
            className="aspect-video w-full object-cover transition duration-200 group-hover:scale-105"
          />
          <span className="absolute right-3 bottom-3 rounded-full bg-black/80 px-2 py-1 text-xs font-semibold text-white">
            {video.duration}
          </span>
        </div>
      </Link>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/watch/${video.id}`} className="min-w-0">
            <h2 className="line-clamp-2 text-base font-medium leading-6 text-zinc-950 transition-colors hover:text-red-400 dark:text-white">
              {video.title}
            </h2>
          </Link>
          {action && <div className="shrink-0">{action}</div>}
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{video.channelTitle}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          {video.viewCount} views · {new Date(video.publishedAt).toLocaleDateString()}
        </p>
      </div>
    </article>
  );
}
