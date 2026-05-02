"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-zinc-200 bg-white/95 px-4 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 sm:px-6">
      <div className="mx-auto flex max-w-8xl items-center justify-between gap-3">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          ViewTube
        </Link>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="hidden md:block">
            <input
              type="search"
              placeholder="Search videos"
              className="h-10 w-80 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
            />
          </div>
          <button
            type="button"
            aria-label="Watchlist"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            ★
          </button>
        </div>
      </div>
    </header>
  );
}
