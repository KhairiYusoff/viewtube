import { SearchShell } from '@/components/search/SearchShell';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  return <SearchShell initialQuery={query} />;
}
