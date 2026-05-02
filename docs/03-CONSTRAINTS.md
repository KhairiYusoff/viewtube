# ViewTube — Constraints

> These rules are non-negotiable. The AI must follow them without being asked.
> If a pattern here conflicts with a tutorial or example online, this file wins.

---

## Folder & File Naming

| Rule | Example |
|------|---------|
| Components: PascalCase | `VideoCard.tsx`, `CategoryTabs.tsx` |
| Hooks: camelCase with `use` prefix | `useVideos.ts`, `useWatchlist.ts` |
| Adapters: camelCase | `youtube.ts` |
| Schemas: camelCase + `.schema.ts` suffix | `youtube.schema.ts` |
| Types: camelCase + `.ts` | `video.ts` |
| Config: camelCase | `categories.ts` |
| Every component folder has `index.ts` barrel | `components/video/index.ts` |

---

## Folder Structure Rules

```
src/
├── app/              — Next.js App Router pages + route handlers ONLY. No logic here.
├── components/       — UI only. No fetch calls. No business logic.
├── hooks/            — SWR hooks only. One hook per data concern.
├── lib/
│   ├── adapters/     — One file per API provider. Pure fetch + Zod parse + normalize.
│   ├── schemas/      — Zod schemas for raw API responses only.
│   └── utils/        — Pure utility functions (formatDuration, formatViews, etc.)
├── types/            — TypeScript types shared across the app.
└── config/           — Static constants (category definitions, region code, etc.)
```

**Never put fetch calls inside components.** Components receive data as props or via hooks.  
**Never put business logic inside route handlers.** Route handlers call adapters only.

---

## Server vs Client Boundary

| Location | Server or Client | Rule |
|----------|-----------------|------|
| `app/page.tsx` | Server Component (default) | No hooks, no useState |
| `app/search/page.tsx` | Server Component | Reads `searchParams` prop |
| `app/watch/[id]/page.tsx` | Server Component | Reads `params.id` prop |
| `app/api/v1/**/route.ts` | Server only | Injects API key, calls adapter |
| `components/**` that use hooks | `'use client'` | Must declare at top |
| `components/**` that are pure display | Server Component (default) | No directive needed |

**Rule:** Mark `'use client'` only when the component uses `useState`, `useEffect`, browser APIs, or SWR hooks. Everything else is a Server Component by default.

---

## API Proxy Pattern (mandatory)

The YouTube API key is **never exposed to the browser**.

```
Browser → /api/v1/videos?category=gaming → route.ts (injects key) → YouTube API
```

All YouTube calls go through `src/app/api/v1/` route handlers.  
No direct `fetch('https://googleapis.com/...')` calls in components or hooks.  
Hooks always call `/api/v1/...` (relative URL).

---

## Adapter Pattern

Every adapter file must:
1. Accept normalized parameters (not raw query strings)
2. Build the YouTube API URL internally
3. Validate the response with Zod `safeParse`
4. Return a normalized type (never raw API shape)
5. Throw a descriptive error on parse failure

```ts
// ✅ correct
export async function getTrending(categoryId?: string): Promise<VideoListResult> { ... }

// ❌ wrong — leaking API concerns
export async function getTrending(url: string): Promise<unknown> { ... }
```

---

## Zod Usage

- Schemas live in `src/lib/schemas/youtube.schema.ts` only
- Validate at the **adapter boundary** — raw API response → Zod → normalized type
- Use `safeParse`, never `parse` (no uncaught throws)
- This project uses **Zod v4** — read `docs/technical/ZOD-PRACTICES.md` before writing any schema
- Key v4 traps: `message` → `error`, `z.record()` requires 2 args, use `.issues` not `.errors`

---

## SWR Hook Rules

- One hook per data concern: `useVideos`, `useSearch`, `useVideoDetail`, `useRelated`, `useWatchlist`
- Hooks call `/api/v1/` endpoints only — never YouTube directly
- `refreshInterval` must be explicit — no silent auto-polling on video data
- SWR key must encode all parameters that affect the response:
  ```ts
  // ✅ — category change triggers refetch
  const key = `/api/v1/videos?category=${categoryId}`
  
  // ❌ — static key won't refetch on category change
  const key = `/api/v1/videos`
  ```

---

## Quota Protection Rules (mandatory)

1. **Debounce search input** — minimum 500ms before triggering search API call
2. **Never search on category tab switch** — tabs use `videos.list` not `search.list`
3. **Batch video detail calls** — collect all IDs, one `videos.list?id=id1,id2,...` call
4. **SWR caches per key** — same tab/query never re-fetches within a session
5. **Infinite scroll appends** — new pages append to existing list, don't replace

---

## Infinite Scroll Pattern

Use `IntersectionObserver` on a sentinel `<div>` at the bottom of the list.  
Do NOT use scroll event listeners.  
Do NOT use a "Load More" button (unless as fallback for accessibility).

```ts
// Pattern — hook owns the page state
const [pages, setPages] = useState<Video[][]>([initialData])
const [nextPageToken, setNextPageToken] = useState<string | null>(token)

// On intersection: fetch next page, append to pages[]
```

---

## Watchlist Rules

- Stored in `localStorage` key: `viewtube-watchlist`
- Type: `WatchlistItem[]` — only `{ id, title, thumbnail, channelTitle, duration }`
- Max 500 items (enforce in `useWatchlist` toggle)
- Zero API calls for watchlist reads/writes
- `useWatchlist` hook is the only place that reads/writes localStorage

---

## Comments Policy

- WHY comments only — explain non-obvious decisions, not what the code does
- No section dividers (`// ---- section ----`)
- No JSDoc on every function — only on public adapter functions

---

## TypeScript Rules

- `strict: true` — no exceptions
- No `any` — use `unknown` + type guard if shape is uncertain
- Types defined in `src/types/video.ts` — not inline in components
- Zod infer pattern for schema-derived types:
  ```ts
  export type YouTubeVideoRaw = z.infer<typeof YouTubeVideoSchema>
  ```
