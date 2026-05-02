# ViewTube — Tech Stack

---

## Core

| Layer | Choice | Version | Why |
|-------|--------|---------|-----|
| Framework | Next.js | 16+ | App Router, Server Components, route handlers as API proxy |
| Language | TypeScript | 5 | strict mode — no `any` |
| Styling | Tailwind CSS | v4 | `@theme {}` design tokens, no CSS files per component |
| Components | shadcn/ui | latest | accessible primitives, works with Tailwind v4 |

## Data & State

| Layer | Choice | Version | Why |
|-------|--------|---------|-----|
| Client fetching | SWR | 2+ | cache per SWR key, revalidation, stale-while-revalidate |
| Validation | Zod | v4 | schema validation at adapter boundary only |
| Watchlist | localStorage | — | no DB needed, persists across sessions |

## Infrastructure

| Layer | Choice | Why |
|-------|--------|-----|
| Deployment | Vercel | zero-config Next.js deploy |
| API | YouTube Data API v3 | free 10,000 units/day, no OAuth for public data |
| Fonts | Roboto + Roboto Mono via `next/font/google` | matches YouTube's type feel |

## Not Used (and why)

| Skipped | Reason |
|---------|--------|
| Database | No user data — watchlist is localStorage |
| OAuth / NextAuth | No auth needed — public YouTube data only |
| Redux / Zustand | SWR + useState is sufficient — no global client state |
| tRPC | Overkill for simple API proxy pattern |
| React Query | SWR is lighter and sufficient for this use case |
