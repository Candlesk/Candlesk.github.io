# Haithem Aissa — Portfolio

Personal portfolio, built with [Astro](https://astro.build), TailwindCSS and DaisyUI,
based on the [Astrofy](https://github.com/manuelernestog/astrofy) template.

## Pages

| Route             | What it is                                              |
| ----------------- | ------------------------------------------------------- |
| `/`               | Hero, intro and featured projects                       |
| `/projects`       | All projects, linked to their project pages             |
| `/projects/<project>` | Individual project pages (no public listing)         |
| `/cv`             | Resume: experience, education, projects, skills, certs  |

## Development

```bash
pnpm install
pnpm dev
```

The site runs at `http://localhost:4321`.

```bash
pnpm build     # production build in dist/
pnpm preview   # preview the production build
```

## Adding a project page

Each project page is a Markdown file in `src/content/projects/`. The **file name becomes
the URL slug**, so keep it lowercase with hyphens.

```md
---
title: "My Project Name"
description: "One or two sentences shown on the project cards."
pubDate: "Nov 01 2026"
heroImage: "/cover-my-project.webp"
badge: "Security"
tags: ["security", "networking"]
---

Project details go here.
```

- Put cover images in `public/` and reference them as `/filename.webp`.
- Tags are displayed as labels on the project page and project cards.
- The project automatically appears on `/` and `/projects`, sorted by `pubDate`, and gets
  its own page at `/projects/<file-name>`.

The five existing project pages are scaffolded with sections to fill in: overview,
architecture, implementation, testing/results, challenges and screenshots.

## Customising

- **Site details, email and social links** — `src/config.ts`
- **Deployment URL** — `site` in `astro.config.mjs`, plus `public/robots.txt`
- **Navigation** — `src/components/SideBarMenu.astro`
- **Home page** — `src/pages/index.astro`
- **Resume** — `src/pages/cv.astro`
- **Colors/theme** — `data-theme` in `src/layouts/BaseLayout.astro` (currently `night`)

## Deployment

Any static host works. On Netlify or Vercel, use:

- Build command: `pnpm build`
- Output directory: `dist`

### GitHub Pages

The repository includes `.github/workflows/deploy.yml`, which builds the site and deploys
it whenever `main` is pushed.

1. Create a GitHub repository named **`Candlesk.github.io`** (this makes it a user site at
   `https://candlesk.github.io`, so no base path is needed).
2. Push this project to it:
   ```bash
   git remote add origin git@github.com:Candlesk/Candlesk.github.io.git
   git push -u origin main
   ```
3. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for the “Deploy to GitHub Pages” workflow to finish.

The site will be available at `https://candlesk.github.io`.

If you use a normal repository name instead (for example `portfolio`), the URL becomes
`https://candlesk.github.io/portfolio`. That requires setting `base: "/portfolio"` in
`astro.config.mjs` and prefixing all internal links and public asset paths with the base
path. The user-site setup above avoids that extra work.

## Credits

Template by [Manuel Ernesto](https://github.com/manuelernestog/astrofy) (MIT license).
Content and customisation for Haithem Aissa.
