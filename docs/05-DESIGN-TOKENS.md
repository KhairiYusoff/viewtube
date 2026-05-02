# ViewTube — Design Tokens & Visual System

> Single source of truth for all colors, spacing, typography, and motion.
> All values defined as CSS custom properties in `globals.css` under `@theme {}`.
> Never use raw Tailwind colors (e.g. `bg-gray-900`) — always use token classes.

---

## Color Palette

Inspired by YouTube's dark UI — near-black background, white text, red accent.

### Background & Surface

| Token               | Value     | Usage                                     |
| ------------------- | --------- | ----------------------------------------- |
| `--color-bg`        | `#0f0f0f` | Page background (YouTube's exact dark bg) |
| `--color-surface`   | `#212121` | Card / sidebar background                 |
| `--color-surface-2` | `#272727` | Hover states, elevated surfaces           |
| `--color-border`    | `#3f3f3f` | Dividers, card borders                    |

### Text

| Token            | Value     | Usage                               |
| ---------------- | --------- | ----------------------------------- |
| `--color-text`   | `#f1f1f1` | Primary text                        |
| `--color-dim`    | `#aaaaaa` | Secondary text (channel name, date) |
| `--color-subtle` | `#717171` | Tertiary text, placeholders         |

### Accent

| Token                  | Value     | Usage                                    |
| ---------------------- | --------- | ---------------------------------------- |
| `--color-accent`       | `#ff0000` | YouTube red — logo, active tab indicator |
| `--color-accent-hover` | `#cc0000` | Hover state for accent elements          |

### Semantic

| Token              | Value     | Usage                          |
| ------------------ | --------- | ------------------------------ |
| `--color-positive` | `#2ba640` | Positive delta, success states |
| `--color-negative` | `#f44336` | Error, negative delta          |
| `--color-warning`  | `#f5a623` | Stale data, warnings           |

---

## Typography

| Token         | Value                      | Usage                  |
| ------------- | -------------------------- | ---------------------- |
| `--font-sans` | `Roboto, Inter, system-ui` | All body text          |
| `--font-mono` | `Roboto Mono, Geist Mono`  | View counts, durations |

### Scale

| Class                   | Size | Weight | Usage                           |
| ----------------------- | ---- | ------ | ------------------------------- |
| `text-xl font-semibold` | 20px | 600    | Page titles                     |
| `text-base font-medium` | 16px | 500    | Video card title (2-line clamp) |
| `text-sm`               | 14px | 400    | Channel name, metadata          |
| `text-xs`               | 12px | 400    | Duration badge, view count      |

---

## Spacing System

Tailwind default scale. Preferred values:

| Usage                   | Value                  |
| ----------------------- | ---------------------- |
| Page horizontal padding | `px-4 sm:px-6 lg:px-8` |
| Card padding            | `p-3`                  |
| Card gap (grid)         | `gap-4`                |
| Section gap             | `gap-6`                |
| Navbar height           | `h-14`                 |
| Sidebar width           | `w-60`                 |
| Thumbnail border radius | `rounded-xl`           |

---

## Video Card

```
┌─────────────────────────────┐
│  [thumbnail 16:9]      9:39 │  ← duration badge: bottom-right overlay
├─────────────────────────────┤
│  Video title (2 line clamp) │  ← text-base font-medium
│  Channel Name               │  ← text-sm text-dim
│  1.2M views · 3 days ago    │  ← text-xs text-subtle
└─────────────────────────────┘
```

- Thumbnail: `aspect-video` (16:9), `rounded-xl overflow-hidden`, `object-cover`
- Duration badge: absolute positioned, bottom-right, `bg-black/80 text-white text-xs px-1 rounded`
- Title: `line-clamp-2` — never truncate to 1 line
- No channel avatar (quota reason — documented in RESEARCH.md)

---

## Layout

### Home / Search page

```
┌────────────────────────────────────────────────────────┐
│  Navbar (h-14, sticky top-0)                           │
├──────────┬─────────────────────────────────────────────┤
│ Sidebar  │  CategoryTabs (sticky, below navbar)        │
│ (w-60)   ├─────────────────────────────────────────────┤
│          │  VideoGrid (3-col desktop, 2-col tablet,    │
│          │             1-col mobile)                    │
└──────────┴─────────────────────────────────────────────┘
```

Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`

### Watch page

```
┌────────────────────────────────────────────────────────┐
│  Navbar                                                 │
├────────────────────────────┬───────────────────────────┤
│  VideoPlayer (flex-1)      │  Related Videos sidebar   │
│  VideoMeta                 │  (w-96, scrollable)       │
└────────────────────────────┴───────────────────────────┘
```

---

## Motion

| Token               | Value      | Usage                 |
| ------------------- | ---------- | --------------------- |
| `--duration-fast`   | `150ms`    | Hover transitions     |
| `--duration-normal` | `200ms`    | Tab switches, reveals |
| `--ease-default`    | `ease-out` | All transitions       |

Standard hover: `transition-colors duration-150`  
Thumbnail hover: `group-hover:scale-105 transition-transform duration-200`

---

## Navbar

- Height: `h-14`, `sticky top-0 z-50`
- Background: `bg-[var(--color-bg)]/95 backdrop-blur`
- Left: ViewTube logo (red play icon + wordmark)
- Center: SearchBar (max-w-xl)
- Right: Watchlist icon button

---

## Category Chips

- Active: `bg-white text-black`
- Inactive: `bg-[var(--color-surface-2)] text-[var(--color-text)] hover:bg-[var(--color-border)]`
- Shape: `rounded-lg px-3 py-1 text-sm font-medium`
- Row: `sticky` below navbar, `overflow-x-auto` for mobile scroll, no scrollbar visible
