import { z } from 'zod';

const ThumbnailSchema = z.object({
  url: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

const ThumbnailsSchema = z.object({
  default: ThumbnailSchema.optional(),
  medium: ThumbnailSchema.optional(),
  high: ThumbnailSchema.optional(),
  standard: ThumbnailSchema.optional(),
  maxres: ThumbnailSchema.optional(),
});

const VideoSnippetSchema = z.object({
  publishedAt: z.string(),
  channelId: z.string(),
  title: z.string(),
  description: z.string(),
  thumbnails: ThumbnailsSchema,
  channelTitle: z.string(),
});

const VideoStatisticsSchema = z.object({
  viewCount: z.string(),
});

const VideoContentDetailsSchema = z.object({
  duration: z.string(),
});

export const YouTubeVideoSchema = z.object({
  id: z.string(),
  snippet: VideoSnippetSchema,
  statistics: VideoStatisticsSchema.optional(),
  contentDetails: VideoContentDetailsSchema.optional(),
});

export const YouTubeVideoListResponseSchema = z.object({
  kind: z.string(),
  etag: z.string(),
  nextPageToken: z.string().optional(),
  prevPageToken: z.string().optional(),
  items: z.array(YouTubeVideoSchema),
});

const SearchResultIdSchema = z.object({
  kind: z.string(),
  videoId: z.string(),
});

export const YouTubeSearchItemSchema = z.object({
  id: SearchResultIdSchema,
  snippet: VideoSnippetSchema,
});

export const YouTubeSearchListResponseSchema = z.object({
  kind: z.string(),
  etag: z.string(),
  nextPageToken: z.string().optional(),
  items: z.array(YouTubeSearchItemSchema),
});

export const YouTubeChannelResponseSchema = z.object({
  kind: z.string(),
  etag: z.string(),
  items: z
    .array(
      z.object({
        id: z.string(),
        contentDetails: z.object({
          relatedPlaylists: z.object({
            uploads: z.string(),
          }),
        }),
      }),
    )
    .optional(),
});

export const YouTubePlaylistItemsResponseSchema = z.object({
  kind: z.string(),
  etag: z.string(),
  nextPageToken: z.string().optional(),
  items: z.array(
    z.object({
      kind: z.string(),
      etag: z.string(),
      contentDetails: z.object({
        videoId: z.string(),
      }),
    }),
  ),
});
