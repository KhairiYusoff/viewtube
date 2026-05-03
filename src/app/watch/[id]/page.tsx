import { WatchShell } from '@/components/watch/WatchShell';

interface WatchPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;
  return <WatchShell videoId={id} />;
}
