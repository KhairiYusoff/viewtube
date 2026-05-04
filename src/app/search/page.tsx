import { SearchShell } from '@/components/search/SearchShell';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';

  return <SearchShell initialQuery={query} />;
}
