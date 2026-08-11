# Pineda Lab website

Source for the Pineda Lab website, hosted at [pineda-lab.github.io](https://pineda-lab.github.io) via GitHub Pages.

Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com). Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and deploys it to GitHub Pages automatically.

## Development

```bash
npm install
npm run dev       # start local dev server
npm run build     # build the production site into ./dist
npm run preview   # preview the production build locally
```

## Site structure

Pages, each available in English and Spanish:

- `/` and `/es/` — Home: hero, research pillars, projects, campus map
- `/people` and `/es/people` — People: PI bio
- `/teaching` and `/es/teaching` — Teaching
- `/publications` and `/es/publications` — Publications
- `/privacy`, `/terms` (and `/es/` variants) — linked from the footer only

Each page is a thin route file under `src/pages/` (and its `src/pages/es/` counterpart) that renders a shared body component from `src/views/`. Shared UI lives in `src/components/`, and the base HTML shell is `src/layouts/Layout.astro`.

## Editing content

Most UI strings and page copy live in `src/data/translations.json`, keyed by locale (`en` / `es`). Editing a page's text means editing that file rather than markup.

The Publications page instead reads from `src/data/research.yaml` (also keyed by `en` / `es`) — add or edit a publication by editing that YAML file's `content.publications` list.

Bilingual routing uses Astro's built-in i18n config (see `astro.config.mjs`): English is unprefixed at the root, Spanish is served from `/es/`. Locale-aware internal links are built with `getRelativeLocaleUrl` from `astro:i18n`.
