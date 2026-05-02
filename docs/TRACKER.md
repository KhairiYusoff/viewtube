# ViewTube — Dev Tracker

> One story at a time. Commit after each story. Don't move to the next sprint until all Done When boxes are checked.

**Daily quota:** 10,000 units · resets midnight Pacific  
**Production URL:** TBD

---

## Commit Convention

```
feat(VT-001): add layout shell with navbar, sidebar, category tabs
feat(VT-002): add video card, grid, and skeleton states
chore(VT-003): add YouTube schemas, adapter, and utils
feat(VT-004): add trending videos route handler
fix(VT-010): handle missing thumbnail gracefully
style(VT-013): responsive polish
chore(setup): init Next.js project with Tailwind v4
```

Format: `type(VT-XXX): short description`  
Types: `feat` · `fix` · `chore` · `style` · `refactor`

---

## Sprint 1 — Foundation

**Goal:** Project setup, design system, layout shell. No real data yet.

---

### Day 1 — Project Setup

> `chore(setup): init Next.js project with Tailwind v4 and shadcn/ui`

- [x] node -v shows v20 — run `nvm use 20` if not
- [x] Scaffold with `create-next-app@latest` — TypeScript, App Router, Tailwind
- [x] Verify `package.json` next version and react version
- [x] `"strict": true` in `tsconfig.json`
- [x] Prettier installed, .prettierrc created, `format` script added
- [x] Tailwind v4 confirmed: `@import "tailwindcss"` in `globals.css`
- [ ] `globals.css` — full `@theme {}` with all ViewTube design tokens from `05-DESIGN-TOKENS.md`
- [x] `layout.tsx` — Roboto + Roboto Mono fonts, `dark` class on `<html>`
- [ ] `npx shadcn@latest init --defaults`
- [x] SWR + Zod installed: `npm i swr zod`
- [x] `.env.local` + `.env.example` created with `YOUTUBE_API_KEY`
- [x] `AGENTS.md` + `CLAUDE.md` created
- [ ] `docs/technical/ZOD-PRACTICES.md` copied from SignalDesk
- [ ] `docs/technical/NEXTJS-PRACTICES.md` copied from SignalDesk
- [x] `npm run build` passes — zero TS errors
- [x] Commit: `chore(setup): init Next.js project with Tailwind v4 and shadcn/ui`

---

### Day 2 — Layout Shell

> Stories: `VT-001` shell

- [x] `src/components/layout/Navbar.tsx` — logo + search bar + watchlist icon
- [x] `src/components/layout/Sidebar.tsx` — Home + Watchlist nav links
- [x] `src/components/home/CategoryTabs.tsx` — 7 chips, active state, horizontal scroll on mobile
- [x] `app/layout.tsx` wires Navbar + Sidebar
- [x] `app/page.tsx` renders CategoryTabs + empty grid placeholder
- [x] Responsive check: 375px (1-col, no sidebar), 1280px (sidebar + 3-col grid)
- [x] Commit: `feat(VT-001): add layout shell with navbar, sidebar, category tabs`

---

### Day 3 — Video Card + Grid

> Stories: `VT-002`

- [x] `src/types/video.ts` — define `Video`, `VideoListResult`, `WatchlistItem` types
- [x] `src/components/video/VideoCard.tsx` — thumbnail (16:9) + duration badge + title + channel + views
- [x] `src/components/video/VideoGrid.tsx` — responsive grid, accepts `Video[]`
- [x] `src/components/video/VideoSkeleton.tsx` — skeleton version of VideoCard (pulse animation)
- [x] Wire skeleton grid into home page (no real data yet — shows loading state)
- [x] Thumbnail hover scale animation
- [x] `npm run build` passes
- [x] Commit: `feat(VT-002): add video card, grid, and skeleton states`

### Sprint 1 — Done When ✓

- [x] `npm run dev` shows layout shell with skeleton cards
- [x] Responsive at 375px and 1280px
- [x] `npm run build` passes — zero TS errors
- [ ] Dark theme visible, all design tokens applied

---

## Sprint 2 — Data Integration

**Goal:** All pages show live YouTube data.

---

### Day 4 — Zod Schemas + Adapter

> `chore(VT-003): add YouTube schemas and adapter`

- [x] `src/lib/schemas/youtube.schema.ts` — schemas for videos.list, search.list, channels.list, playlistItems.list responses
- [x] `src/lib/utils/duration.ts` — `parseDuration('PT1H27M53S')` → `'1:27:53'`
- [x] `src/lib/utils/format.ts` — `formatViews('1234567')` → `'1.2M views'`
- [x] `src/lib/adapters/youtube.ts` — `getTrending`, `search`, `getVideoDetail`, `getChannelUploadsPlaylistId`, `getChannelVideos`
- [ ] Test adapter functions locally with `curl` before wiring route handlers
- [ ] Commit: `chore(VT-003): add YouTube schemas, adapter, and utils`

---

### Day 5 — Route Handlers

- [x] `app/api/v1/videos/route.ts` — GET `?category=` → calls `getTrending`
- [ ] Commit: `feat(VT-004): add trending videos route handler`

- [x] `app/api/v1/videos/[id]/route.ts` — GET → calls `getVideoDetail`
- [ ] Commit: `feat(VT-005): add video detail route handler`

- [x] `app/api/v1/search/route.ts` — GET `?q=&pageToken=` → calls `search`
- [ ] Commit: `feat(VT-006): add search route handler`

- [x] `app/api/v1/related/route.ts` — GET `?channelId=&playlistId=&pageToken=` → calls `getChannelVideos`
- [ ] Commit: `feat(VT-007): add related videos route handler`

- [ ] Test all 4 routes with `curl http://localhost:3000/api/v1/...` before moving on

---

### Day 6 — SWR Hooks

> `feat(VT-008): add SWR data hooks`

- [x] `src/hooks/useVideos.ts` — trending by category, SWR cache per category
- [x] `src/hooks/useSearch.ts` — search with debounce 500ms
- [x] `src/hooks/useVideoDetail.ts` — single video detail
- [x] `src/hooks/useRelated.ts` — channel videos for related sidebar
- [x] `src/hooks/useWatchlist.ts` — localStorage read/write, max 500 items
- [x] Commit: `feat(VT-008): add SWR data hooks`

---

### Day 7 — Wire Home Page

> `feat(VT-009): wire home page with live data and infinite scroll`

- [ ] `HomeShell` (client) calls `useVideos(activeCategory)`
- [ ] Category tab switch triggers refetch via SWR key change
- [ ] `VideoGrid` renders real `Video[]` data
- [ ] Infinite scroll: `IntersectionObserver` on sentinel div → load next page → append
- [ ] Loading: skeleton grid shown
- [ ] Error: error state with retry
- [ ] Empty: empty state message
- [ ] Commit: `feat(VT-009): wire home page with live trending data and infinite scroll`

---

### Day 8 — Search Page

> `feat(VT-010): wire search page`

- [ ] `SearchBar` debounces input 500ms, navigates to `/search?q=`
- [ ] `app/search/page.tsx` reads `searchParams.q`
- [ ] `SearchShell` calls `useSearch(query)`
- [ ] Results shown in `VideoGrid` — same component as home
- [ ] Infinite scroll works on search results
- [ ] No results state
- [ ] Commit: `feat(VT-010): wire search page with debounced query`

---

### Day 9 — Watch Page

> `feat(VT-011): wire watch page`

- [ ] `app/watch/[id]/page.tsx` reads `params.id`
- [ ] `VideoPlayer` — YouTube iframe embed, 16:9 aspect ratio
- [ ] `VideoMeta` — title + channel + view count + publish date
- [ ] `WatchlistButton` — add/remove toggle, reads/writes `useWatchlist`
- [ ] `RelatedVideos` sidebar — calls `useRelated`, infinite scroll
- [ ] Responsive: player full-width on mobile, sidebar below player
- [ ] Commit: `feat(VT-011): wire watch page with player, meta, and related videos`

---

### Day 10 — Watchlist Page

> `feat(VT-012): add watchlist page`

- [ ] `app/watchlist/page.tsx` — reads from `useWatchlist`
- [ ] Shows saved `WatchlistItem[]` in same `VideoGrid`
- [ ] Remove item button on each card
- [ ] Empty state: "Your watchlist is empty"
- [ ] Commit: `feat(VT-012): add watchlist page`

### Sprint 2 — Done When ✓

- [ ] Home page shows trending videos with category tabs
- [ ] Search returns results, infinite scroll works
- [ ] Watch page plays video, shows related
- [ ] Watchlist saves/removes across page reloads
- [ ] Zero TS errors (`npm run build` passes)
- [ ] All API calls go through `/api/v1/` — no key exposed to browser

---

## Sprint 3 — Polish + Deploy

---

### Day 11 — Polish

> `style(VT-013): responsive and visual polish`

- [ ] 375px: no overflow, tap targets ≥44px, sidebar hidden (hamburger or bottom nav)
- [ ] 1280px: 3-col grid, sidebar visible
- [ ] Thumbnail hover scale animation working
- [ ] Duration badge legible on all thumbnails
- [ ] Category chips scroll horizontally on mobile without scrollbar showing
- [ ] Commit: `style(VT-013): responsive polish`

---

### Day 12 — Deploy

> `chore(VT-014): deploy to Vercel`

- [ ] Push to GitHub
- [ ] Create Vercel project linked to repo
- [ ] Set `YOUTUBE_API_KEY` in Vercel env vars
- [ ] Deploy — verify all pages load
- [ ] Check browser console — zero errors
- [ ] Update README: description + live URL + screenshot + local setup

### Sprint 3 — Done When ✓

- [ ] Deployed URL works — home, search, watch, watchlist all functional
- [ ] Watchlist persists on hard refresh
- [ ] Zero console errors on production
- [ ] README has live link + screenshot
- [ ] Looks portfolio-ready on mobile and desktop
