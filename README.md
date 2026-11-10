# Pathway AI Frontend

Your future deserves more than a guess.

Pathway AI is an international education guide that is **in development**. This repository (`pathway-ai-frontend`) is the web frontend of that product. It is a deliberately small **four-page frontend foundation**: Next.js (App Router), TypeScript (strict), Tailwind CSS and accessible Radix primitives. There is no backend, database or account system.

## What exists today

| Route           | Purpose                                                                           |
| --------------- | --------------------------------------------------------------------------------- |
| `/`             | Home: what Pathway AI is, what works now, where it is heading                     |
| `/universities` | Browse destinations by region and by EU member state. Shows an honest empty state |
| `/scholarships` | Explains why funding differs and what each entry will show. Honest empty state    |
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

## Repositories

Pathway AI is split into two independent repositories:

| Repository                                  | Responsibility                                           | Status                        |
| ------------------------------------------- | -------------------------------------------------------- | ----------------------------- |
| `YunisSadig/pathway-ai-frontend` (this one) | Web UI: pages, navigation, theming, accessibility, tests | Four-page foundation complete |
| `YunisSadig/pathway-ai-backend`             | Data and APIs: Java 21+, Spring Boot, PostgreSQL, REST   | Planned. Not created yet      |

This repository contains no backend code or database client. When the backend exists, the frontend will consume its REST API; until then there is no data in the app.

### Prepared for the backend (not wired to any page)

- `src/types`: contracts for `University`, `DegreeProgram`, `Scholarship` and `Page<T>` (field names mirror Spring Data's `Page`). Every record carries `sourceUrl`, `checkedAt` and `verification`.
- `src/lib/api`: a small typed `apiGet` over `fetch`, plus list and detail functions. It reads `NEXT_PUBLIC_API_BASE_URL` and throws `ApiError` when it is unset, so nothing is requested today.
- `src/components`: `UniversityList`/`UniversityCard` and `ScholarshipList`/`ScholarshipCard` take API data as props; `LoadingState`, `EmptyState` and `ErrorState` cover the other cases. No pages use them until real data exists.

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
