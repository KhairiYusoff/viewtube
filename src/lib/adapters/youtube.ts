import { z } from 'zod';
import { YouTubeChannelResponseSchema, YouTubePlaylistItemsResponseSchema, YouTubeSearchListResponseSchema, YouTubeVideoListResponseSchema, YouTubeVideoSchema } from '@/lib/schemas/youtube.schema';
import { parseDuration } from '@/lib/utils/duration';
import { Video } from '@/types/video';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const REGION_CODE = 'MY';

function getApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    throw new Error('Missing YOUTUBE_API_KEY environment variable');
  }
  return key;
}

function throwParseError(result: { success: boolean; error: unknown }, context: string): never {
  const errorMessage = result.success ? 'unknown' : JSON.stringify(result.error, null, 2);
  throw new Error(`YouTube schema validation failed for ${context}: ${errorMessage}`);
}

function normalizeVideo(item: z.infer<typeof YouTubeVideoSchema>): Video {
  const thumbnail =
    item.snippet.thumbnails.medium?.url ??
    item.snippet.thumbnails.high?.url ??
    item.snippet.thumbnails.default?.url ??
    '';

  return {
    id: item.id,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    thumbnail,
    duration: item.contentDetails?.duration ? parseDuration(item.contentDetails.duration) : '0:00',
    viewCount: item.statistics?.viewCount ?? '0',
    publishedAt: item.snippet.publishedAt,
  };
}

async function parseJson<T>(response: Response, schema: z.ZodType<T>, context: string): Promise<T> {
  const json = await response.json();
  const result = schema.safeParse(json);
  if (!result.success) {
    throwParseError(result, context);
  }
  return result.data;
}

function buildUrl(path: string, params: Record<string, string | undefined>): string {
  const url = new URL(`${BASE_URL}/${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });
  url.searchParams.set('key', getApiKey());
  return url.toString();
}

async function fetchVideoList(path: string, params: Record<string, string | undefined>) {
  const response = await fetch(buildUrl(path, params));
  const data = await parseJson(response, YouTubeVideoListResponseSchema, path);
  return {
    items: data.items.map(normalizeVideo),
    nextPageToken: data.nextPageToken,
  };
}

export async function getTrending(categoryId?: string, pageToken?: string) {
  return fetchVideoList('videos', {
    part: 'snippet,statistics,contentDetails',
    chart: 'mostPopular',
    regionCode: REGION_CODE,
    maxResults: '20',
    videoCategoryId: categoryId,
    pageToken,
  });
}

export async function getVideoDetail(id: string) {
  const result = await fetchVideoList('videos', {
    part: 'snippet,statistics,contentDetails',
    id,
  });

  if (result.items.length === 0) {
    throw new Error(`Video not found for id: ${id}`);
  }

  return result.items[0];
}

export async function search(query: string, pageToken?: string) {
  const response = await fetch(buildUrl('search', {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '20',
    pageToken,
  }));

  const data = await parseJson(response, YouTubeSearchListResponseSchema, 'search');
  const ids = data.items.map((item) => item.id.videoId).filter(Boolean);

  if (ids.length === 0) {
    return { items: [], nextPageToken: data.nextPageToken };
  }

  const videos = await fetchVideoList('videos', {
    part: 'snippet,statistics,contentDetails',
    id: ids.join(','),
  });

  const videosById = new Map(videos.items.map((video) => [video.id, video]));
  const ordered = ids.map((id) => videosById.get(id)).filter((video): video is Video => Boolean(video));

  return {
    items: ordered,
    nextPageToken: data.nextPageToken,
  };
}

export async function getChannelUploadsPlaylistId(channelId: string) {
  const response = await fetch(buildUrl('channels', {
    part: 'contentDetails',
    id: channelId,
  }));

  const data = await parseJson(response, YouTubeChannelResponseSchema, 'channels');

  const uploadPlaylistId = data.items?.[0]?.contentDetails.relatedPlaylists.uploads;
  if (!uploadPlaylistId) {
    throw new Error(`Uploads playlist not found for channel ${channelId}`);
  }

  return uploadPlaylistId;
}

export async function getChannelVideos(playlistId: string, pageToken?: string) {
  const response = await fetch(buildUrl('playlistItems', {
    part: 'snippet,contentDetails',
    playlistId,
    maxResults: '20',
    pageToken,
  }));

  const data = await parseJson(response, YouTubePlaylistItemsResponseSchema, 'playlistItems');
  const ids = data.items.map((item) => item.contentDetails.videoId);

  if (ids.length === 0) {
    return { items: [], nextPageToken: data.nextPageToken };
  }

  const videos = await fetchVideoList('videos', {
    part: 'snippet,statistics,contentDetails',
    id: ids.join(','),
  });

  const videosById = new Map(videos.items.map((video) => [video.id, video]));
  const ordered = ids.map((id) => videosById.get(id)).filter((video): video is Video => Boolean(video));

  return {
    items: ordered,
    nextPageToken: data.nextPageToken,
  };
}
