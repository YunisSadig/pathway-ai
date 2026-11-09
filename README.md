# Pathway AI

Your future deserves more than a guess.

Pathway AI is a personalized international education planning platform. This repository holds the **frontend prototype**: Next.js (App Router), TypeScript (strict), Tailwind CSS and accessible Radix primitives. Student data is kept in the browser only; there is no backend yet.

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
| `npm test`         | Vitest unit and component tests                |
| `npm run test:e2e` | Playwright (desktop + mobile, axe checks)      |
| `npm run format`   | Format with Prettier                           |

## Theme behaviour

Only **Light** and **Dark** are offered in the UI. On a first visit the device preference is applied automatically; an explicit choice is then remembered (`pathway-theme` in localStorage).

## Data integrity

Institutional and scholarship facts must come from official sources and carry a source URL, a checked date and a verification status. Unknown values are shown as unknown, never invented. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Roadmap

Backend (Java, Spring Boot, PostgreSQL) and AI services are planned later; the frontend keeps data access behind a small layer so it can be swapped for REST calls.
