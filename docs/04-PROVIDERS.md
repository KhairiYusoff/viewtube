# ViewTube — API Providers

---

## YouTube Data API v3

**Base URL:** `https://www.googleapis.com/youtube/v3`  
**Auth:** API key only (no OAuth — public data only)  
**Free quota:** 10,000 units/day (resets midnight Pacific Time)  
**Key env var:** `YOUTUBE_API_KEY`  

---

### Endpoint 1 — Trending / Category Feed

```
GET /videos
  ?part=snippet,statistics,contentDetails
  &chart=mostPopular
  &regionCode=MY
  &videoCategoryId={id}        ← omit for "All"
  &maxResults=20
  &pageToken={token}           ← omit for first page
  &key={YOUTUBE_API_KEY}
```

**Cost: 1 unit per call**  
Used for: Home page category tabs (All, Music, Gaming, etc.)  
Returns: `items[]` with snippet + statistics + contentDetails

```bash
# Confirmed curl — All trending MY
curl "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=MY&maxResults=5&key=YOUR_KEY"

# Confirmed curl — Gaming trending MY
curl "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=MY&videoCategoryId=20&maxResults=5&key=YOUR_KEY"
```

---

### Endpoint 2 — Search

```
GET /search
  ?part=snippet
  &q={query}
  &type=video
  &maxResults=20
  &pageToken={token}           ← omit for first page
  &key={YOUTUBE_API_KEY}
```

**Cost: 100 units per call**  
Used for: `/search?q=` page only. Never for category tabs.

⚠️ `search.list` does NOT return `statistics` or `contentDetails`.  
Must follow up with `videos.list?id=...` batch call to get view counts + duration.

```bash
# Confirmed curl
curl "https://www.googleapis.com/youtube/v3/search?part=snippet&q=javascript+tutorial&type=video&maxResults=5&key=YOUR_KEY"
```

---

### Endpoint 3 — Video Detail (batch)

```
GET /videos
  ?part=snippet,statistics,contentDetails
  &id={id1},{id2},{id3},...    ← up to 50 IDs
  &key={YOUTUBE_API_KEY}
```

**Cost: 1 unit per call regardless of how many IDs (up to 50)**  
Used for:
- Enriching search results (view count + duration after search.list)
- Single video detail on `/watch/[id]` page

```bash
# Confirmed curl — batch
curl "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=dQw4w9WgXcQ,9bZkp7q19f0&key=YOUR_KEY"
```

---

### Endpoint 4 — Channel Info (for uploadsPlaylistId)

```
GET /channels
  ?part=contentDetails
  &id={channelId}
  &key={YOUTUBE_API_KEY}
```

**Cost: 1 unit**  
Used for: Watch page — get `contentDetails.relatedPlaylists.uploads` playlist ID  
Only called once per unique channel. Cache result in SWR.

```bash
curl "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=UCVHFbw7woebKtfvug_tvqsA&key=YOUR_KEY"
```

Response path to uploads playlist ID:
```
items[0].contentDetails.relatedPlaylists.uploads
```

---

### Endpoint 5 — Channel Videos (Related / Up Next)

```
GET /playlistItems
  ?part=snippet,contentDetails
  &playlistId={uploadsPlaylistId}
  &maxResults=20
  &pageToken={token}
  &key={YOUTUBE_API_KEY}
```

**Cost: 1 unit per call**  
Used for: Related videos sidebar on `/watch/[id]` — shows more from the same channel  
Supports infinite scroll via `nextPageToken`

```bash
curl "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=UUVHFbw7woebKtfvug_tvqsA&maxResults=5&key=YOUR_KEY"
```

Note: `playlistItems.list` returns `contentDetails.videoId` — must batch `videos.list` for stats.

---

## Response Fields We Use

### From `videos.list` (trending + detail)

| Field | Path |
|-------|------|
| Video ID | `items[].id` |
| Title | `items[].snippet.title` |
| Channel name | `items[].snippet.channelTitle` |
| Channel ID | `items[].snippet.channelId` |
| Thumbnail (medium) | `items[].snippet.thumbnails.medium.url` |
| Thumbnail (high) | `items[].snippet.thumbnails.high.url` |
| Published date | `items[].snippet.publishedAt` |
| View count | `items[].statistics.viewCount` |
| Duration (ISO) | `items[].contentDetails.duration` |
| Next page token | `nextPageToken` |

### From `search.list`

| Field | Path |
|-------|------|
| Video ID | `items[].id.videoId` |
| Title | `items[].snippet.title` |
| Channel name | `items[].snippet.channelTitle` |
| Channel ID | `items[].snippet.channelId` |
| Thumbnail | `items[].snippet.thumbnails.medium.url` |
| Published date | `items[].snippet.publishedAt` |
| Next page token | `nextPageToken` |

⚠️ No `viewCount` or `duration` — must enrich with `videos.list` batch.

---

## Duration Parsing

YouTube returns ISO 8601 duration: `PT1H27M53S`, `PT9M39S`, `PT45S`

Must parse to display format:

| Raw | Display |
|-----|---------|
| `PT1H27M53S` | `1:27:53` |
| `PT9M39S` | `9:39` |
| `PT45S` | `0:45` |

Parser lives in `src/lib/utils/duration.ts`.

---

## View Count Formatting

YouTube returns raw string: `"1234567"`

Must format for display:

| Raw | Display |
|-----|---------|
| `"1234567"` | `1.2M views` |
| `"234567"` | `234K views` |
| `"5678"` | `5.6K views` |
| `"234"` | `234 views` |

Formatter lives in `src/lib/utils/format.ts`.

---

## Known Limits & Gotchas

| Gotcha | Detail |
|--------|--------|
| Quota resets midnight Pacific (UTC-8) | Not midnight local time |
| `search.list` has no stats | Always follow with `videos.list` batch |
| `pageToken` is opaque | Never construct it manually — use exactly as returned |
| `maxResults` max is 50 | Default is 5 — always set explicitly |
| `regionCode` affects trending | Use `MY` — omitting gives US results |
| Duration field is ISO 8601 | Must parse — never display raw |
| viewCount is a string | `"1234567"` not a number — parse before math |
| Thumbnails may be missing | `medium` is usually safe, `high` sometimes absent |
| Deleted/private videos | May appear in playlist but `videos.list` returns empty — handle gracefully |
