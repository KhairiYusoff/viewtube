import Image from 'next/image';
import Link from 'next/link';
import { Video } from '@/types/video';

export function VideoCard({ video }: { video: Video }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/watch/${video.id}`} className="block">
        <div className="relative overflow-hidden rounded-t-3xl bg-zinc-900">
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
        <Link href={`/watch/${video.id}`}>
          <h2 className="line-clamp-2 text-base font-medium leading-6 text-white transition-colors hover:text-red-400">
            {video.title}
          </h2>
        </Link>
        <p className="text-sm text-zinc-400">{video.channelTitle}</p>
        <p className="text-xs text-zinc-500">
          {video.viewCount} views · {new Date(video.publishedAt).toLocaleDateString()}
        </p>
      </div>
    </article>
  );
}
