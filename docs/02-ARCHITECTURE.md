# ViewTube — Architecture

---

## Routes

```
/                          — Home feed (category tabs, trending videos)
/search?q={query}          — Search results page
/watch/[id]                — Video player + related videos
```

---

## Page → Component Tree

```
app/
├── page.tsx                        — Home (Server Component)
│   └── HomeShell (client)
│       ├── CategoryTabs            — All · Music · Gaming · Science&Tech · Education · Sports · Entertainment
│       └── VideoGrid               — infinite scroll grid
│           └── VideoCard[]         — thumbnail + title + channel + views + duration
│
├── search/page.tsx                 — Search Results (Server Component, reads ?q= param)
│   └── SearchShell (client)
│       ├── SearchBar               — pre-filled with current query
│       └── VideoGrid               — same component as home, different data source
│           └── VideoCard[]
│
└── watch/[id]/page.tsx             — Watch Page (Server Component)
    └── WatchShell (client)
        ├── VideoPlayer             — YouTube iframe embed
        ├── VideoMeta               — title + channel + view count + publish date
        ├── WatchlistButton         — add/remove from localStorage watchlist
        └── RelatedVideos           — sidebar list of related VideoCard[]

components/
├── layout/
│   ├── Navbar.tsx                  — logo + SearchBar + WatchlistIcon
│   └── Sidebar.tsx                 — Home · Watchlist nav links
├── video/
│   ├── VideoCard.tsx               — reused across home, search, related
│   ├── VideoGrid.tsx               — infinite scroll wrapper
│   ├── VideoPlayer.tsx             — iframe embed
│   └── VideoMeta.tsx               — title, channel, stats
├── search/
│   └── SearchBar.tsx               — input with debounce, navigates to /search?q=
├── home/
│   └── CategoryTabs.tsx            — chip row, controls active category
└── watchlist/
    └── WatchlistButton.tsx         — heart/bookmark toggle, reads/writes localStorage
```

---

## Data Flow

```
Browser
  │
  ├── SWR hook (client)
  │     useVideos(category)       — home feed, polls /api/v1/videos?category=X
  │     useSearch(query, page)    — search results, /api/v1/search?q=X&pageToken=Y
  │     useVideoDetail(id)        — watch page, /api/v1/videos/[id]
  │     useRelated(id)            — related sidebar, /api/v1/related?videoId=X
  │
  └── Next.js Route Handler (server — hides API key)
        /api/v1/videos             → YouTubeAdapter.getTrending(category)
        /api/v1/search             → YouTubeAdapter.search(query, pageToken)
        /api/v1/videos/[id]        → YouTubeAdapter.getVideoDetail(id)         — also returns channelId
        /api/v1/related            → YouTubeAdapter.getChannelVideos(channelId, uploadsPlaylistId)
              │
              └── YouTube Data API v3
                    videos.list?chart=mostPopular      — home tabs (1 unit)
                    search.list?q=                     — search only (100 units)
                    videos.list?id=                    — detail batch (1 unit)
                    channels.list?id={channelId}       — get uploadsPlaylistId (1 unit, once)
                    playlistItems.list?playlistId=     — related/channel videos (1 unit per page)

Watchlist
  localStorage only ("viewtube-watchlist")
  Stores: [{ id, title, thumbnail, channelTitle, duration }]
  Zero API calls — read/write happens entirely in browser
```

---

## Infinite Scroll Pattern

```
VideoGrid
  ├── renders current items[]
  ├── <div ref={sentinelRef} /> — invisible div at bottom
  └── Intersection Observer watches sentinelRef
        → when visible: call loadMore()
        → loadMore() fetches next page using nextPageToken from last response
        → appends new items to existing list
        → updates nextPageToken (null = end of results)
```

SWR is used for the first page. Subsequent pages are appended manually via `useState`.

---

## Category Tabs → API Mapping

| Tab            | API call                                           | Category ID | Units |
| -------------- | -------------------------------------------------- | ----------- | ----- |
| All            | `videos.list?chart=mostPopular`                    | none        | 1     |
| Music          | `videos.list?chart=mostPopular&videoCategoryId=10` | 10          | 1     |
| Gaming         | `videos.list?chart=mostPopular&videoCategoryId=20` | 20          | 1     |
| Science & Tech | `videos.list?chart=mostPopular&videoCategoryId=28` | 28          | 1     |
| Education      | `videos.list?chart=mostPopular&videoCategoryId=27` | 27          | 1     |
| Sports         | `videos.list?chart=mostPopular&videoCategoryId=17` | 17          | 1     |
| Entertainment  | `videos.list?chart=mostPopular&videoCategoryId=24` | 24          | 1     |

All tabs: **1 unit each**. Not search. SWR caches per tab — switching back costs 0 units.

---

## Folder Structure

```
src/
├── app/
│   ├── page.tsx
│   ├── search/
│   │   └── page.tsx
│   ├── watch/
│   │   └── [id]/
│   │       └── page.tsx
│   └── api/
│       └── v1/
│           ├── videos/
│           │   ├── route.ts          — GET ?category=
│           │   └── [id]/
│           │       └── route.ts      — GET single video detail
│           ├── search/
│           │   └── route.ts          — GET ?q=&pageToken=
│           └── related/
│               └── route.ts          — GET ?videoId=
├── components/
│   ├── layout/
│   ├── video/
│   ├── search/
│   ├── home/
│   └── watchlist/
├── hooks/
│   ├── useVideos.ts
│   ├── useSearch.ts
│   ├── useVideoDetail.ts
│   ├── useRelated.ts
│   └── useWatchlist.ts
├── lib/
│   ├── adapters/
│   │   └── youtube.ts
│   └── schemas/
│       └── youtube.schema.ts
├── types/
│   └── video.ts
└── config/
    └── categories.ts               — category tab definitions (id, label, categoryId)
```

---

## Key Types (to define before coding)

```ts
type Video = {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  thumbnail: string; // medium quality URL
  duration: string; // parsed: "12:34" or "1:23:45"
  viewCount: string; // raw string from API e.g. "1234567"
  publishedAt: string; // ISO string
};

type SearchResult = {
  items: Video[];
  nextPageToken: string | null;
};

type WatchlistItem = Pick<
  Video,
  "id" | "title" | "thumbnail" | "channelTitle" | "duration"
>;
```

---

## Quota Budget Per User Session

| Action                                                         | Units          |
| -------------------------------------------------------------- | -------------- |
| Home tab load (videos.list batch)                              | 1              |
| Switch category tab (cached)                                   | 0              |
| Infinite scroll load more (videos.list)                        | 1              |
| Search query                                                   | 100            |
| Watch page load (video detail + channel info + playlist items) | 3              |
| Related — infinite scroll load more (playlistItems.list)       | 1              |
| **Typical session total**                                      | **~300 units** |

10,000 unit daily budget ÷ 300 = ~33 full sessions per day before hitting limit.
