# Next.js Practices

This app uses Next.js App Router with TypeScript and Tailwind v4.

## Core rules

- Use server components by default.
- Add `use client` only when a component needs hooks, state, or browser APIs.
- Do not fetch data directly from components; use route handlers and client-side hooks instead.
- Keep business logic out of API routes; route handlers should call adapters or services.
- Use `metadata` in `app/layout.tsx` for document title and description.

## API and routing

- API routes live under `src/app/api/v1/`.
- Client components use SWR hooks to call the app API, not the YouTube API directly.
- Use `dynamic = 'force-dynamic'` when an API route must always fetch fresh data.
- Route params are typed in page components using `params` or `searchParams` interfaces.

## Image and environment handling

- Use `next/image` for thumbnails with `loading="lazy"`.
- Keep secrets in `.env.local` and never expose API keys to browser code.
- Use `router.push()` from client components only.
