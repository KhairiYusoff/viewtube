'use client';

import { useEffect, useRef, useState } from 'react';
import { CategoryTabs } from '@/components/home/CategoryTabs';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { VideoGrid } from '@/components/video';
import { useVideos } from '@/hooks';

const categoryMap: Record<string, string> = {
  'All': '',
  'Music': '10',
  'Gaming': '20',
  'Science & Tech': '28',
  'Education': '27',
  'Sports': '17',
  'Entertainment': '24',
};

export function HomeShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const sentinelRef = useRef<HTMLDivElement>(null);

  const categoryId = categoryMap[activeCategory];
  const { videos, isLoading, error, loadMore, hasMore } = useVideos(categoryId);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="mx-auto flex w-full max-w-8xl gap-6 px-4 py-6 sm:px-6 md:pl-0">
        <section className="flex-1">
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
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
