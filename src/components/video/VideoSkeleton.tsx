export function VideoSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="h-48 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
