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

interface CategoryTabsProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function CategoryTabs({ activeCategory = 'All', onCategoryChange }: CategoryTabsProps) {
  const [internalActive, setInternalActive] = useState('All');
  const currentActive = activeCategory !== undefined ? activeCategory : internalActive;

  const handleClick = (category: string) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    } else {
      setInternalActive(category);
    }
  };

  return (
    <div className="flex w-full gap-2 overflow-x-auto px-4 pb-4 pt-2 text-sm sm:px-0">
      {categories.map((category) => {
        const isActive = category === currentActive;
        return (
          <button
            key={category}
            type="button"
            onClick={() => handleClick(category)}
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
