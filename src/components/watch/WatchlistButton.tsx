'use client';

interface WatchlistButtonProps {
  isSaved: boolean;
  onToggle: () => void;
}

export function WatchlistButton({ isSaved, onToggle }: WatchlistButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-11 items-center gap-2 rounded-full bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-400"
    >
      <span>{isSaved ? 'Saved' : 'Save'}</span>
      <span aria-hidden="true">★</span>
    </button>
  );
}
