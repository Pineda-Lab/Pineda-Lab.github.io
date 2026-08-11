# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is the source for the Pineda Lab website, hosted at `pineda-lab.github.io` via GitHub Pages. It is an [Astro](https://astro.build) static site styled with Tailwind CSS v4 (via `@tailwindcss/vite`, CSS-first config — there is no `tailwind.config.js`). GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys the site to GitHub Pages on every push to `main`; there is no manual deploy step.

Since this repo is `<org>.github.io`, the site is served from the domain root — `astro.config.mjs` sets `site` but intentionally has no `base` path.

The lab is directed by Dr. Arturo López Pineda at ENES Morelia, UNAM, with research spanning AI in Health, Digital Health, and Clinical Genomics.

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to ./dist — must succeed before pushing
npm run preview   # serve the production build locally
```

There is no test suite or linter configured.

## Architecture

The site is a minimal page structure, each page available in English and Spanish via Astro's built-in i18n routing (English unprefixed at `/`, Spanish under `/es/`):

- Home (`/`, `/es/`) — hero, research pillars, projects (DIABETIA, MOWI), and a campus map at the bottom. There is no separate Projects or Contact page — projects and the map live here since they were the only content those pages had beyond what's already elsewhere on the site.
- People (`/people`, `/es/people`) — PI bio (Dr. Arturo López Pineda), moved off Home to keep the front page shorter
- Teaching (`/teaching`, `/es/teaching`) — courses grouped by undergraduate program at ENES Morelia (Licenciatura en Tecnologías para la Información en Ciencias; Licenciatura en Administración)
- Publications (`/publications`, `/es/publications`) — full publication list (journal articles, posters, preprints, etc.) sourced from `src/data/research.yaml`, each entry expandable via a native `<details>` disclosure for authors/venue/keywords
- Privacy Policy (`/privacy`, `/es/privacy`) and Terms & Conditions (`/terms`, `/es/terms`) — linked from the footer only, not the main nav

Nav order (both the header and how pages are listed here) is: Home, People, Teaching, Publications.

Structure:
- `astro.config.mjs` — declares `i18n: { defaultLocale: 'en', locales: ['en', 'es'], routing: { prefixDefaultLocale: false } }`, and registers `@rollup/plugin-yaml` as a Vite plugin so `.yaml` files can be `import`ed directly as parsed JS objects (see `src/env.d.ts` for the ambient `*.yaml` module type).
- `src/pages/*.astro` and `src/pages/es/*.astro` — thin per-locale route files. Each just imports and renders the matching component from `src/views/` (e.g. `src/pages/index.astro` and `src/pages/es/index.astro` both render `src/views/Home.astro`). Locale is detected inside components via `Astro.currentLocale`, not passed as a prop.
- `src/views/` — the actual page bodies (`Home.astro`, `People.astro`, `Teaching.astro`, `Publications.astro`, `Privacy.astro`, `Terms.astro`), one per page regardless of language. **Add a new page by creating a view here plus one route file per locale**, not by duplicating markup per language.
- `src/data/*.yaml` — every UI string and piece of page copy, one file per domain rather than one giant file: `common.yaml` (site meta, nav, footer), `home.yaml`, `projects.yaml`, `teaching.yaml`, `people.yaml`, `visit.yaml` (the ENES Morelia/map section on Home), `publications.yaml` (Publications page UI strings — filters, empty state), `legal.yaml` (Privacy/Terms). Each file is shaped `{ en: {...}, es: {...} }` with matching keys. **All editable content and copy changes go here, not into `.astro` files.** `src/i18n/utils.ts` imports all of them and merges each locale into one object, so every view still just does `t.home.title`, `t.people.piName`, etc. — **add a new page's copy as a new sibling `.yaml` file** (merge it in `utils.ts`), don't grow an existing file with an unrelated namespace.
- `src/data/research.yaml` — the Publications page's actual publication *records* (intro copy, per-publication metadata, and a collaboration CTA) — kept apart from `publications.yaml` (which only holds the filter-bar UI strings) because it's substantially larger and independently maintained. Shape: top-level `en`/`es`, each with page copy plus `content.publications[]` (type, title, authors, date, journal/event/location/volume/issue/page, url, keywords). Read directly via `import research from "../data/research.yaml"` in `Publications.astro`, not through `useTranslations`.
- `src/i18n/utils.ts` — `getLocale`, `useTranslations` (merges the `src/data/*.yaml` files above), and the `Locale` type. Locale-aware internal links are built per-component with `getRelativeLocaleUrl` from the `astro:i18n` virtual module, not hand-rolled path logic.
- `src/layouts/Layout.astro` — the shared HTML shell (head/meta/OG tags, `<html lang>`, font + global CSS imports, `Navbar` + `Footer`). Takes `title`/`description` props; falls back to the translated default description when `description` is omitted.
- `src/components/` — shared UI: `Navbar.astro` (sticky nav with a vanilla-JS mobile menu and an EN/ES language switcher, no framework), `Footer.astro`, `PageHeader.astro` (interior-page banner — light surface with a subtle radial slate-blue gradient tint, echoing the Home hero's gradient without its dark background), `FeatureCard.astro` (icon cards used for the research pillars on Home), `Logo.astro` (renders `/public/images/logos/pinedalab-logo.png`).
- No React/Vue/Svelte — all interactivity (mobile nav toggle) is a plain `<script>` block using `document.querySelector`, kept local to the component that needs it.

## Design system

Small presentational components in `src/components/` exist specifically to keep repeated UI patterns from drifting out of sync across pages — **use these instead of re-typing their class strings**:
- `Eyebrow.astro` — small-caps `text-ice` overline label above a heading (`as="h3"` when it needs to be a real heading rather than a `<p>`).
- `Button.astro` — pill CTA (`variant="primary"` filled ice / `variant="outline"` for a bordered button on a dark background; `external` adds `target="_blank" rel="noopener noreferrer"`).
- `Pill.astro` — static rounded tag chip (`tone="tint"` default / `tone="solid"` for emphasis, `uppercase` for a category-label look vs. a plain keyword tag).
- `IconBadge.astro` — bordered pill **link** with an icon + label (used for the contact/social links on People); pass the icon `<svg>` and label text as children.
- `Card.astro` — the standard `rounded-2xl border border-slate-200 bg-white p-6` grid-item card (Teaching courses, Home projects).

Conventions these encode, followed everywhere in `src/views/`:
- **Section rhythm**: hero sections use `py-24 sm:py-32`; every other content section uses `py-16 sm:py-20`. Don't introduce a third value.
- **Radius tiers**: `rounded-2xl` for list/grid-item cards, `rounded-3xl` reserved for larger showcase panels (the People bio card, the Home campus-photo frame), `rounded-full` for pills/badges/buttons.
- **Color roles** are documented at the top of `src/styles/global.css`'s `@theme` block — pull from `--color-navy`/`--color-slate-blue`/`--color-surface`/`--color-ice` rather than introducing new colors.
- All five icon badges on People deliberately share one visual style (24×24 `stroke="currentColor"`, `stroke-width="1.8"`, round caps/joins) — match that when adding new icons anywhere on the site, brand marks included, rather than dropping in an official multi-color logo.

## SEO

- `astro.config.mjs` registers `@astrojs/sitemap` (i18n-aware — each URL's sitemap entry gets `hreflang` alternates for `en`/`es`) and filters out `/privacy` and `/terms` from the sitemap since those pages are `noindex`.
- `src/layouts/Layout.astro` emits per-page `hreflang`/`x-default` `<link>` tags, OG/Twitter meta (including `og:image` pointing at `public/images/og/og-image.jpg`, a 1200×630 crop of the campus photo), `og:locale`/`og:locale:alternate`, and a site-wide `ResearchOrganization` JSON-LD block. Pass `noindex` as a `Layout` prop to opt a page out of indexing (used by Privacy/Terms).
- `src/views/People.astro` additionally emits a `Person` JSON-LD block for the PI.
- `public/robots.txt` allows all crawlers and points at `/sitemap-index.xml`.

## Content and assets

- `public/` assets are organized by category: `images/logos/` (lab and ENES Morelia logos), `images/people/` (PI headshot), `images/campus/` (ENES Morelia campus photo). `favicon.ico` and `apple-touch-icon.png` stay at the `public/` root since browsers/iOS auto-discover them there. No placeholder images remain — all are real.
- The only person represented on the site is the PI, Dr. Arturo López Pineda (ENES Morelia, UNAM). There is no team roster, publications list, or news feed — those were removed as unauthenticated/fictitious content. Don't reintroduce fake team members, papers, or DOIs; add real ones to the relevant `src/data/*.yaml` file when they exist.
