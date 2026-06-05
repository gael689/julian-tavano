# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page for **JT Arquitectura**, an architecture studio by Julián Tavano based in Monte Hermoso, Argentina. The site showcases residential projects, a portfolio of built works on an interactive map, and pre-designed housing prototypes.

## Commands

```bash
npm run dev      # Start dev server on 0.0.0.0 (all interfaces)
npm run build    # Production build
npm run lint     # ESLint check
```

## Architecture

**Stack:** Next.js 15 (App Router) · React 19 RC · Tailwind CSS v4 · next-intl · Framer Motion · Lenis · Leaflet

### Route Structure

All pages live under `app/[locale]/` — the locale segment is managed by `next-intl` middleware (`middleware.ts`). The default locale is `es`; the `en` prefix is omitted for Spanish (see `routing.ts` `localePrefix: 'as-needed'`).

```
app/[locale]/
  (home)/page.tsx          # Landing page — assembles all home sections
  obras/page.tsx           # Interactive map page
  prototipos/[slug]/page.tsx
```

### Home Page Section Order

`LetterboxIntro` → `Hero` → `Prototipos` → `CustomProjects` → `About` → `Contact`

All sections live in `components/sections/`. The `(home)` route group means `/` resolves without a path segment.

### i18n

- Translations: `messages/es.json` and `messages/en.json`
- Config entry point: `i18n.ts` (registered in `next.config.ts` via `createNextIntlPlugin`)
- Use `useTranslations()` in Client Components, `getTranslations()` in Server Components

### Leaflet / Map

Leaflet cannot run on the server. The pattern used in `components/map/ObrasMap.tsx` is **100% imperative instantiation inside `useEffect` with `useRef`** — React must never touch the Leaflet DOM. `ObrasClient.tsx` imports `ObrasMap` via `dynamic(..., { ssr: false })`.

When the `/obras` page is mounted, Lenis is stopped (`lenis.stop()`) and `document.body.style.overflow = 'hidden'` is set so only the sidebar and map scroll natively. Both are restored on unmount.

### Smooth Scroll

`SmoothScrollProvider` (`components/layout/SmoothScrollProvider.tsx`) wraps the entire app with Lenis. To prevent Lenis from intercepting scroll inside a specific element, add `data-lenis-prevent="true"` to that element.

### Styling

- **Tailwind v4** — config is in `app/globals.css` inside `@theme {}` (no `tailwind.config.ts`).
- Custom colors: `olive-deep` (`#3A4A2A`), `olive` (`#4A5A3A`), `olive-soft` (`#6B7A5A`), `cream` (`#F5F0E8`), `charcoal`, `charcoal-soft`, `wood`, `concrete`.
- Custom utility classes defined via `@utility` in `globals.css`: `text-display-xl`, `text-display-l`, `text-h1`, `text-h2`, `text-h3`, `text-body-l`, `text-body`, `text-eyebrow`, `container-layout`, `section-padding`.
- **Fonts:** `--font-display` = Century Gothic (system font, no import needed); `--font-body` = Montserrat loaded via `next/font/google` in `app/[locale]/layout.tsx`.
- Display headings use `style={{ fontFamily: "'Century Gothic', sans-serif" }}` inline or the `text-display-*`/`text-h*` utility classes.

### Data

Static data lives in `lib/data/`:
- `obras.ts` — `OBRAS: Obra[]` — list of built works with coordinates (`[lng, lat]`) and optional images/description.
- `prototipos.ts` — prototype housing models.

To add a new obra, append an entry to the `OBRAS` array in `lib/data/obras.ts`. Coordinates follow `[longitude, latitude]` order (not the standard lat/lng).

## Pending Work

- **Contact form email sending** — `components/sections/Contact.tsx` has UI but no submission logic. Needs a Route Handler or third-party service (Resend, EmailJS, Formspree).
- **Vercel deployment** — not yet configured.
- **Mobile audit** — final pass across all views on small screens.
