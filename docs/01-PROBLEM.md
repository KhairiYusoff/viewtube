# ViewTube — Problem & Product Brief

---

## Problem

YouTube's homepage is a black box — personalised by an algorithm you can't control.
For someone who wants to browse by topic (dev, gaming, news) without being locked into a
feed shaped by their watch history, there's no clean tool that just shows trending content by category with a minimal, distraction-free UI.

**Who has this problem:** developers, hobbyists, anyone who wants to browse YouTube content intentionally without the recommendation rabbit hole.

**Why now:** YouTube Data API v3 is free, stable, and returns all the data needed to build a fully functional discovery surface without auth.

---

## What We're Building

A YouTube-inspired video discovery app.

- Browse trending videos by category (Music, Gaming, Tech, Education, Sports, Entertainment)
- Search any topic
- Watch videos via YouTube's embedded player
- Save to a personal watchlist (no account needed)
- No auth, no database, deployed to Vercel

---

## Features (MVP)

| Feature    | Description                                                |
| ---------- | ---------------------------------------------------------- |
| Home feed  | Trending videos by category, infinite scroll               |
| Search     | Full results page, debounced, infinite scroll              |
| Watch page | Embedded YouTube player + related videos from same channel |
| Watchlist  | Save/remove videos, persists via localStorage              |

## Out of Scope (MVP)

- User accounts / OAuth
- Comments
- Subscriptions
- Personalised recommendations
- Video upload
- Shorts
