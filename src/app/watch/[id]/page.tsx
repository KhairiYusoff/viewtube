import { WatchShell } from '@/components/watch/WatchShell';

interface WatchPageProps {
  params: {
    id: string;
  };
}

export default function WatchPage({ params }: WatchPageProps) {
  return <WatchShell videoId={params.id} />;
}
