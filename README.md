# Nurs Portfolio — Next.js

A macOS-desktop-style portfolio. App Router + TypeScript + `next/font`. No CSS framework, no external runtime.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build && npm start
```

## Deploy

It's a standard Next.js app — deploy to **Vercel** in one step:

```bash
npx vercel        # or push to GitHub and import at vercel.com
```

## Make it yours

Almost everything lives in **`lib/config.ts`**:

| What | Where |
|------|-------|
| Name, role, blurb, email, coordinates, social links | `ME` |
| Projects | `PROJECTS` |
| Reading / watching lists | `BOOKS`, `WATCHLIST` |
| Dock apps (tech stack) | `DOCK` |
| Weather, tracks, awards | `WEATHER`, `TRACKS`, `AWARDS` |
| Wallpaper themes / colors | `THEMES`, `WALLPAPERS` |
| Desktop icon layout | `ICONS`, `WIN_SIZE` |

**Photos** are gradient placeholders. To use real images, drop files in `public/photos/`
and search the codebase for `PHOTO PLACEHOLDER` (in `components/DesktopIcon.tsx` and
`components/WindowView.tsx`) — swap the gradient `<div>` for an `<img>` (or `next/image`).

**Resume:** put `resume.pdf` in `public/` and point the link in `WindowView.tsx` at `/resume.pdf`.

## Structure

```
app/
  layout.tsx      root layout + fonts + metadata
  page.tsx        renders <Portfolio/>
  globals.css     all styles (theme via CSS variables)
components/
  Portfolio.tsx   state, drag logic, lock ↔ desktop switch
  LockScreen.tsx  lock screen + live clock
  Desktop.tsx     menu bar, icons, widget column, dock, footer
  DesktopIcon.tsx a draggable icon
  NowPlaying.tsx  audio widget
  Bricks.tsx      brick-breaker canvas game
  WindowView.tsx  draggable window + per-type body content
  MobileLayout.tsx stacked mobile view
lib/
  config.ts       all data + types
```
