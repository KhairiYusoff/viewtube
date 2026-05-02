import { NextResponse } from 'next/server';
import { getChannelUploadsPlaylistId, getChannelVideos } from '@/lib/adapters/youtube';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const playlistId = url.searchParams.get('playlistId')?.trim();
  const channelId = url.searchParams.get('channelId')?.trim();
  const pageToken = url.searchParams.get('pageToken')?.trim() || undefined;

  if (!playlistId && !channelId) {
    return NextResponse.json(
      { error: 'Missing playlistId or channelId parameter' },
      { status: 400 },
    );
  }

  try {
    const resolvedPlaylistId = playlistId || (await getChannelUploadsPlaylistId(channelId!));
    const data = await getChannelVideos(resolvedPlaylistId, pageToken);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
