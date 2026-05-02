import { NextResponse } from 'next/server';
import { getTrending } from '@/lib/adapters/youtube';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category')?.trim() || undefined;
  const pageToken = url.searchParams.get('pageToken')?.trim() || undefined;

  try {
    const data = await getTrending(category, pageToken);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
