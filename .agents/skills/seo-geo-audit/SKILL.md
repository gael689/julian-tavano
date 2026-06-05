---
name: seo-geo-audit
description: Audit and improve SEO and GEO (Generative Engine Optimization) for this Next.js App Router site. Covers metadata, structured data (JSON-LD), sitemap, robots, hreflang, and content signals for AI-powered search engines. Run when adding major features, new routes, or before deployment.
---

## What this skill does

Audits and implements SEO + GEO (Generative Engine Optimization) for the JT Arquitectura Next.js 15 App Router site. GEO means optimizing for AI-powered search (Perplexity, ChatGPT, Google AI Overviews) via structured data and clear factual content.

## Current architecture (what was already built)

### Files created

| File | Purpose |
|---|---|
| `app/sitemap.ts` | Dynamic XML sitemap — all routes × 2 locales with hreflang alternates |
| `app/robots.ts` | Crawl rules + sitemap pointer |
| `app/manifest.ts` | Web app manifest (name, colors, icon) |
| `components/seo/JsonLd.tsx` | Reusable `<script type="application/ld+json">` component |

### Metadata coverage

| Route | Metadata | OG/Twitter | hreflang | JSON-LD |
|---|---|---|---|---|
| `app/[locale]/layout.tsx` | ✅ metadataBase, title template, robots | ✅ | ✅ es/en/x-default | ✅ Organization + LocalBusiness |
| `app/[locale]/(home)/page.tsx` | ✅ locale-aware | ✅ | (inherited) | ✅ FAQPage + ItemList |
| `app/[locale]/obras/page.tsx` | ✅ | ✅ | ✅ | — |
| `app/[locale]/prototipos/[slug]/page.tsx` | ✅ with proto image | ✅ | ✅ | ✅ BreadcrumbList + Product |

### JSON-LD schemas in use

- **Organization / LocalBusiness / ProfessionalService** — name, address, geo, founder, services, contact. Lives in the layout so it appears on every page.
- **FAQPage** — 5 bilingual Q&As about the service (construction time, shipping, full build includes, custom projects, location). Lives on the home page. Key for GEO.
- **ItemList** — lists all prototipos with name, URL and description. Lives on the home page.
- **BreadcrumbList** — JT Arquitectura → Prototipos → [Proto name]. Lives on each proto page.
- **Product** — prototype specs (area, bedrooms, bathrooms), images, offer. Lives on each proto page.

### Dynamic data sources

The sitemap and JSON-LD schemas read from `PROTOTIPOS_DATA` in `lib/data/prototipos.ts`. **Adding a new prototype to that array automatically updates the sitemap, the home ItemList, and generates a new product page with full metadata and structured data.** No other SEO changes are needed.

---

## Audit checklist — run before each deploy

Go through these in order:

### 1. Metadata completeness
- [ ] Every new route has `generateMetadata` or `export const metadata`
- [ ] Every metadata export has: `title`, `description`, `openGraph` (title, description, url, images), `alternates.canonical`, `alternates.languages`
- [ ] The layout `metadataBase` points to the correct production URL (`NEXT_PUBLIC_SITE_URL` env var)
- [ ] `title.template` in layout is `%s | JT Arquitectura` — page titles should NOT repeat the brand

### 2. Structured data
- [ ] Run any new page through [schema.org validator](https://validator.schema.org/) or [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] If adding a new entity type (blog post, event, person page) — add the appropriate schema: `Article`, `Event`, `Person`
- [ ] FAQ schema on home stays up to date if the service offering changes

### 3. Sitemap
- Verify at `/sitemap.xml` in dev: all new routes appear with correct `hreflang` alternates
- Static routes (non-dynamic) must be added manually to the `staticRoutes` array in `app/sitemap.ts`
- Dynamic routes (prototipos) are auto-generated from `PROTOTIPOS_DATA`

### 4. Content signals (GEO)
- Alt texts on all `<Image>` must be descriptive (not empty, not filename). Format: `"[Subject] — [context]"` e.g. `"Cabaña Brote — exterior con deck en entorno natural"`
- Page descriptions should be factual, specific, and contain key terms (location, materials, dimensions)
- Headings must follow hierarchy: one `<h1>` per page, logical `<h2>` → `<h3>` nesting
- The FAQPage schema answers should mirror real user questions — update when new questions appear

### 5. i18n / hreflang
- Spanish (default locale): no prefix → `jtarquitectura.com/ruta`
- English: `/en` prefix → `jtarquitectura.com/en/ruta`
- Every `alternates` block must include `{ es: '...', en: '...', 'x-default': '...' }` on the Spanish URL
- `<html lang={locale}>` is set in the layout — do not remove

### 6. OG image
- Target: **1200 × 630 px** (Twitter/LinkedIn/WhatsApp preview)
- Current reference: `/about-image.png` — replace with a purpose-made OG image at the correct dimensions
- Per-prototype OG: uses `proto.images[0].src` — make sure the first image of each prototype is landscape and high quality

---

## When to add/update SEO

| Action | What to do |
|---|---|
| Add a prototipo | Only update `PROTOTIPOS_DATA` — everything else is automatic |
| Add a new static route (e.g. `/blog`) | Add to `staticRoutes` in `sitemap.ts` + add `generateMetadata` to the page |
| Change business info (phone, address, services) | Update `organizationSchema` in `app/[locale]/layout.tsx` |
| Add a new service | Update `organizationSchema.serviceType` + add a FAQ entry in `(home)/page.tsx` |
| Change domain | Set `NEXT_PUBLIC_SITE_URL` environment variable — all metadata, sitemap and JSON-LD read from it |
| Pre-deployment check | Run `npm run build` and verify no metadata warnings; check `/sitemap.xml` and `/robots.txt` in production |

---

## Environment variable

```
NEXT_PUBLIC_SITE_URL=https://jtarquitectura.com
```

Set this in Vercel (or `.env.local` for dev). All SEO files fall back to `https://jtarquitectura.com` if unset.
