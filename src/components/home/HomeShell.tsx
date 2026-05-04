'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CategoryTabs } from '@/components/home/CategoryTabs';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { VideoGrid } from '@/components/video';
import { useVideos } from '@/hooks';

const categoryMap: Record<string, string> = {
  All: '',
  Music: '10',
  Gaming: '20',
  'Science & Tech': '28',
  Education: '27',
  Sports: '17',
  Entertainment: '24',
};

export function HomeShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const categoryId = categoryMap[activeCategory];
  const { videos, isLoading, isValidating, error, loadMore, hasMore } = useVideos(categoryId);

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

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex gap-6">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 md:pl-0">
          <CategoryTabs activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
          <VideoGrid videos={videos} isLoading={isLoading} error={error} />
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
