import { NextResponse } from 'next/server';
import { search } from '@/lib/adapters/youtube';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim();
  const pageToken = url.searchParams.get('pageToken')?.trim() || undefined;

  if (!query) {
    return NextResponse.json({ error: 'Missing q parameter' }, { status: 400 });
  }

  try {
    const data = await search(query, pageToken);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
