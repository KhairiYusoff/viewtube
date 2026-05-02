# ViewTube — Research Phase

> This file documents API research, quota analysis, confirmed endpoints, and constraints
> discovered BEFORE any code is written. Update this file when a curl test confirms or
> contradicts anything below.

---

## YouTube Data API v3 — Quota Model

**Daily free budget: 10,000 units**
Resets midnight Pacific Time. Cannot carry over unused units.

| Operation            | Units         | Notes                                 |
| -------------------- | ------------- | ------------------------------------- |
| `search.list`        | **100 units** | Most expensive. The core search call. |
| `videos.list`        | 1 unit        | Batch up to 50 video IDs in one call  |
| `channels.list`      | 1 unit        | Channel metadata                      |
| `playlistItems.list` | 1 unit        | Videos in a playlist                  |
| Write operations     | 50 units      | Not needed — ViewTube is read-only    |
| Video upload         | 1600 units    | Not needed                            |

### Daily budget math (ViewTube usage)

| Action                                       | Units      | Max per day                    |
| -------------------------------------------- | ---------- | ------------------------------ |
| Category tab load (1 search per tab, 6 tabs) | 100 each   | 6 loads × 6 tabs = 3,600 units |
| Search query                                 | 100 each   | ~60 searches/day               |
| Video detail batch (50 IDs)                  | 1          | 6,400 lookups                  |
| Total safe budget per user session           | ~600 units | ~16 full sessions/day          |

**Conclusion:** 10,000 units supports roughly 16 full sessions or 100 raw searches per day.
For a personal/portfolio app this is fine. For production with many users — needs server-side
caching aggressively.

---

## Key Endpoints

### 1. Search videos

```
GET https://www.googleapis.com/youtube/v3/search
  ?part=snippet
  &q={query}
  &type=video
  &maxResults=20
  &key={API_KEY}
```

**Cost: 100 units per call**

Response fields we need:

- `items[].id.videoId`
- `items[].snippet.title`
- `items[].snippet.channelTitle`
- `items[].snippet.publishedAt`
- `items[].snippet.thumbnails.medium.url`
- `nextPageToken` — for pagination

**Trap:** `search.list` does NOT return view counts or duration. Must call `videos.list` separately.

---

### 2. Video details (batch — up to 50 IDs)

```
GET https://www.googleapis.com/youtube/v3/videos
  ?part=snippet,statistics,contentDetails
  &id={id1},{id2},{id3},...
  &key={API_KEY}
```

**Cost: 1 unit for the entire batch**

Fields we need:

- `items[].statistics.viewCount`
- `items[].contentDetails.duration` — ISO 8601 format e.g. `PT15M51S` (needs parsing)
- `items[].snippet.channelId`

**Pattern:** search.list returns 20 IDs → one videos.list call for all 20 → 100 + 1 = 101 units total per page.

---

### 3. Channel details

```
GET https://www.googleapis.com/youtube/v3/channels
  ?part=snippet
  &id={channelId}
  &key={API_KEY}
```

**Cost: 1 unit**

Fields: channel name, thumbnail (avatar). Used to show channel icon next to video card.

---

### 4. Trending / Popular videos (replaces homepage feed)

```
GET https://www.googleapis.com/youtube/v3/videos
  ?part=snippet,statistics,contentDetails
  &chart=mostPopular
  &regionCode=MY
  &videoCategoryId={id}
  &maxResults=20
  &key={API_KEY}
```

**Cost: 1 unit** — much cheaper than search for homepage tabs!

This is the correct approach for category tabs (Dev, Music, Gaming etc.) — NOT search.
`videoCategoryId` list: 10=Music, 20=Gaming, 25=News, 28=Science&Tech

**Confirmed free, no auth needed for public data.**

---

### 5. Pagination

YouTube uses cursor-based pagination via `nextPageToken`:

```
&pageToken={nextPageToken}
```

Include in subsequent requests to get the next page of results. No offset-based pagination.

---

## Authentication

| Use case             | Auth needed             |
| -------------------- | ----------------------- |
| Search public videos | API key only (no OAuth) |
| Video details        | API key only            |
| Trending/popular     | API key only            |
| User watch history   | OAuth 2.0 required      |
| User playlists       | OAuth 2.0 required      |
| Likes/subscriptions  | OAuth 2.0 required      |

**ViewTube decision: API key only. No OAuth.**
Watchlist/favorites stored in localStorage — zero API calls for user preferences.

---

## Confirmed Curl Examples

> Run these after getting your API key from Google Cloud Console.
> Replace `YOUR_API_KEY` before running.

### Search

```bash
curl "https://www.googleapis.com/youtube/v3/search?part=snippet&q=javascript+tutorial&type=video&maxResults=5&key=YOUR_API_KEY"
```

### Trending (Science & Tech, Malaysia)

```bash
curl "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=MY&videoCategoryId=28&maxResults=5&key=YOUR_API_KEY"
```

### Video detail batch

```bash
curl "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=dQw4w9WgXcQ,9bZkp7q19f0&key=YOUR_API_KEY"
```

---

## Quota Preservation Strategy

These patterns are mandatory to avoid hitting 10,000 units/day:

1. **Never search on every keystroke** — debounce 500ms minimum
2. **SWR cache per query** — same search string never re-fetches within a session
3. **Homepage tabs use `chart=mostPopular`** (1 unit), NOT search (100 units)
4. **Batch video.list calls** — collect all IDs from a search page, one batch call
5. **Cache tab results in memory** — switching tabs doesn't re-fetch if already loaded
6. **Only fetch video details when needed** — lazy load stats on hover or click

---

## Data Viewtube Does NOT Get From Free API

| Feature                               | Why not available                        |
| ------------------------------------- | ---------------------------------------- |
| Personalised feed                     | Requires user's OAuth + watch history    |
| Dislike count                         | Removed from public API in 2021          |
| Real-time trending (minute-by-minute) | Not exposed in free tier                 |
| Comment data at scale                 | Expensive quota-wise, complex pagination |
| YouTube Shorts                        | Restricted endpoint                      |
| Age-restricted content                | Requires OAuth + age verification        |

---

## ISO 8601 Duration Parsing

`contentDetails.duration` returns format like `PT1H27M53S` or `PT9M39S`.

Must parse to human-readable: `1:27:53` or `9:39`.

```ts
// Pattern to implement in utils
function parseDuration(iso: string): string {
  // PT1H27M53S → "1:27:53"
  // PT9M39S → "9:39"
  // PT45S → "0:45"
}
```

---

## Video Category IDs (for tab pre-sets)

| ID  | Category             |
| --- | -------------------- |
| 10  | Music                |
| 20  | Gaming               |
| 22  | People & Blogs       |
| 24  | Entertainment        |
| 25  | News & Politics      |
| 28  | Science & Technology |
| 27  | Education            |
| 17  | Sports               |

---

## Decisions (resolved — feeds into architecture)

- [x] **Channel avatars** — skip. No `channels.list` calls. Saves quota, no DB needed.
- [x] **Pagination** — infinite scroll with lazy load (Intersection Observer pattern)
- [x] **Video player** — navigate to `/watch/[id]` route, just like YouTube
- [x] **Search** — full results page at `/search?q=...`, just like YouTube
- [x] **Region** — hardcoded `MY` for now, config constant so easy to make flexible later
