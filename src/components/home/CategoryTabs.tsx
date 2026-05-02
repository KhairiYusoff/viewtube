'use client';

import { useState } from 'react';

const categories = [
  'All',
  'Music',
  'Gaming',
  'Science & Tech',
  'Education',
  'Sports',
  'Entertainment',
];

export function CategoryTabs() {
  const [active, setActive] = useState('All');

  return (
    <div className="flex w-full gap-2 overflow-x-auto px-4 pb-4 pt-2 text-sm sm:px-0">
      {categories.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            className={`whitespace-nowrap rounded-full px-4 py-2 transition ${
              isActive
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
