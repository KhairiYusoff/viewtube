<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:dry-agent-rules -->

# DRY check — mandatory before writing any new file

If a second file would have the same structure as the first with only 1–3 values changing, build the abstraction (factory, HOF, shared util) BEFORE writing the second file. Never write duplicates and refactor after being called out.

<!-- END:dry-agent-rules -->

<!-- BEGIN:zod-agent-rules -->

# This project uses Zod v4 — not v3

Zod v4 has breaking changes. Read `docs/technical/ZOD-PRACTICES.md` before writing any schema code. Key traps: `message` → `error`, `z.record()` requires 2 args, string validators moved to top-level (`z.email()` not `z.string().email()`), `.merge()` deprecated, `.errors` removed (use `.issues`).

<!-- END:zod-agent-rules -->

<!-- BEGIN:youtube-quota-rules -->

# YouTube API quota is precious — 10,000 units/day

Read `docs/04-PROVIDERS.md` before writing any YouTube API call. Key rules:
- Home category tabs use `videos.list?chart=mostPopular` (1 unit) — NEVER `search.list` (100 units)
- Related videos use `playlistItems.list` via channel uploads (1 unit) — NEVER `search.list`
- Always batch `videos.list` — collect all IDs, one call, up to 50 IDs
- Debounce all search inputs 500ms minimum before triggering API call
- Never call YouTube API directly from components or hooks — always via `/api/v1/` route handlers

<!-- END:youtube-quota-rules -->

<!-- BEGIN:constraints-rules -->

# Read constraints before writing any code

Read `docs/03-CONSTRAINTS.md` before creating any file. Key rules:
- No fetch calls in components — hooks only
- No business logic in route handlers — adapters only
- `'use client'` only when component uses useState/useEffect/hooks
- Watchlist is localStorage only — zero API calls
- Infinite scroll uses IntersectionObserver — no scroll event listeners

<!-- END:constraints-rules -->
