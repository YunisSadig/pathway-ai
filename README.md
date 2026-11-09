# Pathway AI

Your future deserves more than a guess.

Pathway AI is an international education guide that is **in development**. This repository is a deliberately small **four-page frontend foundation**: Next.js (App Router), TypeScript (strict), Tailwind CSS and accessible Radix primitives. There is no backend, database or account system.

## What exists today

| Route           | Purpose                                                                           |
| --------------- | --------------------------------------------------------------------------------- |
| `/`             | Home: what Pathway AI is, what works now, where it is heading                     |
| `/universities` | Browse destinations by region and by EU member state. Shows an honest empty state |
| `/scholarships` | Browse by degree level and destination. Explains what the directory will contain  |
| `/how-it-works` | The five planned stages, marked Available now, In preparation or Planned          |

Selections are kept in the URL, for example `/universities?region=eu&country=poland`. Unknown or inconsistent parameters are ignored.

## What was removed, and why

Earlier prototypes contained a university catalogue, scholarship records, onboarding, a dashboard, comparisons, a pathway planner and budget tools. They were removed so the foundation can be finished properly before real data exists. **There are no university or scholarship records in the app.** No tuition, requirements, deadlines, rankings or admission figures are shown anywhere.

The previous implementation is kept in Git history and tagged `archive/mvp-workspace-2026-11`.

## Not built yet (planned)

- University database and degree-program database
- Scholarship database
- Individual university and scholarship pages
- Student profiles
- Academic eligibility evaluation
- University comparisons
- Primary and backup pathways
- AI guidance
- A Java (Spring Boot) REST backend with PostgreSQL

None of these are implemented. The frontend only separates pages, components, static configuration (`src/lib/geography.ts`) and types (`src/types`) so that data can be connected later.

## Getting started

```bash
npm install
npx playwright install chromium   # once, for browser tests
npm run dev                        # http://localhost:3000
```

## Scripts

| Command            | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `npm run dev`      | Start the dev server                           |
| `npm run build`    | Production build                               |
| `npm run check`    | Prettier check, ESLint, TypeScript, unit tests |
| `npm test`         | Vitest unit tests                              |
| `npm run test:e2e` | Playwright (desktop and mobile, axe checks)    |
| `npm run format`   | Format with Prettier                           |

## Theme behaviour

Only **Light** and **Dark** are offered. On a first visit the device preference is applied automatically; an explicit choice is then remembered (`pathway-theme` in localStorage). Older prototype data under `pathway-ai:store` is removed on load; no other storage is touched.

## Data integrity

When real data is added, every institutional or scholarship fact must come from an official source and carry a source URL, a checked date and a verification status. Unknown values stay unknown. See [CONTRIBUTING.md](CONTRIBUTING.md).
