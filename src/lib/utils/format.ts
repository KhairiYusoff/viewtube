export function formatViews(count: string): string {
  const parsed = Number(count);
  if (Number.isNaN(parsed)) {
    return '0 views';
  }

  if (parsed >= 1_000_000) {
    return `${(parsed / 1_000_000).toFixed(1).replace(/\.0$/, '')}M views`;
  }

  if (parsed >= 1_000) {
    return `${(parsed / 1_000).toFixed(1).replace(/\.0$/, '')}K views`;
  }

  return `${parsed.toLocaleString()} views`;
}
