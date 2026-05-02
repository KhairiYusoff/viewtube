'use client';

import { useCallback, useState } from 'react';
import { WatchlistItem } from '@/types/video';

const STORAGE_KEY = 'viewtube_watchlist';
const MAX_ITEMS = 500;

const getInitialItems = (): WatchlistItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>(getInitialItems);

  const addItem = useCallback((item: WatchlistItem) => {
    setItems((current) => {
      if (current.some((entry) => entry.id === item.id)) {
        return current;
      }

      const nextItems = [item, ...current].slice(0, MAX_ITEMS);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
      } catch {
        // ignore write errors
      }
      return nextItems;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => {
      const nextItems = current.filter((item) => item.id !== id);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
      } catch {
        // ignore write errors
      }
      return nextItems;
    });
  }, []);

  const isInWatchlist = useCallback((id: string) => items.some((item) => item.id === id), [items]);

  const toggleItem = useCallback(
    (item: WatchlistItem) => {
      if (items.some((entry) => entry.id === item.id)) {
        removeItem(item.id);
      } else {
        addItem(item);
      }
    },
    [addItem, items, removeItem],
  );

  return {
    items,
    count: items.length,
    addItem,
    removeItem,
    toggleItem,
    isInWatchlist,
  };
}
