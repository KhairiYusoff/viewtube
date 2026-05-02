export type Video = {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  thumbnail: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
};

export type WatchlistItem = Pick<Video, 'id' | 'title' | 'thumbnail' | 'channelTitle' | 'duration'>;
