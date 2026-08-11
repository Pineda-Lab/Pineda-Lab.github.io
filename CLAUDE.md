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
- `src/data/translations.json` — every UI string and piece of page copy, keyed `{ en: {...}, es: {...} }` with matching shapes. **All editable content and copy changes go here, not into `.astro` files.** Read it with `getLocale(Astro.currentLocale)` + `useTranslations(locale)` from `src/i18n/utils.ts`.
- `src/data/research.yaml` — the Publications page's own bilingual content (intro copy, per-publication metadata, and a collaboration CTA), kept separate from `translations.json` because it's substantially larger and independently maintained. Shape: top-level `en`/`es`, each with page copy plus `content.publications[]` (type, title, authors, date, journal/event/location/volume/issue/page, url, keywords).
- `src/i18n/utils.ts` — `getLocale`, `useTranslations`, and the `Locale` type. Locale-aware internal links are built per-component with `getRelativeLocaleUrl` from the `astro:i18n` virtual module, not hand-rolled path logic.
- `src/layouts/Layout.astro` — the shared HTML shell (head/meta/OG tags, `<html lang>`, font + global CSS imports, `Navbar` + `Footer`). Takes `title`/`description` props; falls back to the translated default description when `description` is omitted.
- `src/components/` — shared UI: `Navbar.astro` (sticky nav with a vanilla-JS mobile menu and an EN/ES language switcher, no framework), `Footer.astro`, `PageHeader.astro` (interior-page hero banner), `FeatureCard.astro` (icon cards used for the research pillars on Home), `Logo.astro` (renders `/public/images/logos/pinedalab-logo.png`).
- No React/Vue/Svelte — all interactivity (mobile nav toggle) is a plain `<script>` block using `document.querySelector`, kept local to the component that needs it.

## Content and assets

- `public/` assets are organized by category: `images/logos/` (lab and ENES Morelia logos), `images/people/` (PI headshot), `images/campus/` (ENES Morelia campus photo). `favicon.ico` and `apple-touch-icon.png` stay at the `public/` root since browsers/iOS auto-discover them there. No placeholder images remain — all are real.
- The only person represented on the site is the PI, Dr. Arturo López Pineda (ENES Morelia, UNAM). There is no team roster, publications list, or news feed — those were removed as unauthenticated/fictitious content. Don't reintroduce fake team members, papers, or DOIs; add real ones to `translations.json` when they exist.
