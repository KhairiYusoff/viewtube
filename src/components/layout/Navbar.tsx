'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavbarProps {
  onMenuToggle: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [query, router]);

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 sm:px-6">
      <div className="mx-auto flex max-w-8xl items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Open navigation"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 md:hidden"
        >
          <span className="text-xl leading-none">☰</span>
        </button>

        <Link
          href="/"
          className="hidden items-center gap-2 rounded-full px-3 py-2 text-lg font-semibold tracking-tight text-zinc-950 transition hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-900 md:flex"
        >
          ViewTube
        </Link>

        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-2xl">
            <input
              type="search"
              aria-label="Search videos"
              placeholder="Search videos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-full border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
            />
          </div>
        </div>

        <Link
          href="/watchlist"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          aria-label="Watchlist"
        >
          ★
        </Link>
      </div>
    </header>
  );
}
