# Pathway AI Frontend

Your future deserves more than a guess.

Pathway AI is an international education guide that is **in development**. This repository (`pathway-ai-frontend`) is the web frontend: Next.js (App Router), TypeScript (strict), Tailwind CSS and accessible Radix primitives. It talks to the separate Spring Boot API in [`pathway-ai-backend`](https://github.com/YunisSadig/pathway-ai-backend). There is no auth, account system or database client here.

## What exists today

| Route           | Purpose                                                                                |
| --------------- | -------------------------------------------------------------------------------------- |
| `/`             | Home: what Pathway AI is, what works now, where it is heading                          |
| `/universities` | **Live** university discovery: destination, name search, sorting, pagination (backend) |
| `/scholarships` | Explains why funding differs. Honest empty state: there is no scholarship backend yet  |
| `/how-it-works` | The five planned stages, marked Available now, In preparation or Planned               |

## Backend integration (implemented)

`/universities` fetches in the browser from `GET {NEXT_PUBLIC_API_BASE_URL}/api/v1/universities` through `src/lib/api`. The URL is the single source of state, so every view is shareable and works with the back button:

| URL parameter       | Meaning                                           | API parameter        |
| ------------------- | ------------------------------------------------- | -------------------- |
| `region`, `country` | Destination. `country` is an EU member-state slug | `country` (ISO code) |
| `q`                 | Name search (max 100 characters)                  | `q`                  |
| `sort`, `direction` | `name` or `city`; `asc` or `desc`                 | `sort`, `direction`  |
| `page`              | One-based page (12 per page)                      | `page` (zero-based)  |

- The API filters by **one** country. A single-country region (US, Canada, China, South Korea, Japan) sends its ISO code. The EU alone asks you to choose a member state; with nothing selected, all universities are listed.
- States: loading skeleton, empty (honest, with a way back), and error with **Try again** (unreachable, 4xx/5xx, malformed response, not configured). **The app never falls back to mock data.**
- The API returns no tuition, admission requirements, id or source/verification information, so none is modelled or shown. Unknown stays unknown.
- `GET /api/v1/universities/{slug}` is typed (`getUniversity`) but not used: there is no detail page yet.
- Types in `src/types/university.ts` mirror the backend JSON exactly (`UniversitySummary`, `UniversityDetail`, `ProgramSummary`, upper-case `ProgramDegreeLevel`; `ApiErrorBody` with `violations`).

### Backend URL configuration

| Variable                   | Example                 | Notes                                                                         |
| -------------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080` | Origin only. **Public and inlined at build time**: rebuild after changing it. |

Copy `.env.example` to `.env.local`. The browser calls the backend directly (cross-origin), so the backend must allow the frontend origin: set its `CORS_ALLOWED_ORIGINS` to the exact frontend origin (default `http://localhost:3000`; wildcards are refused). A wrong origin appears as "could not be reached", because browsers hide CORS failures from scripts. Never put a secret in a `NEXT_PUBLIC_*` variable; the API is public and read-only.

### Run both locally

```bash
# 1. Backend repo (JDK 21, Docker): see its README
docker compose up -d && ./mvnw spring-boot:run        # http://localhost:8080

# 2. This repo
cp .env.example .env.local
npm install
npm run dev                                           # http://localhost:3000
```

The backend database ships empty, so `/universities` shows "No universities have been added yet." until real, source-cited data is imported on the backend side.

## Product direction

Pathway AI is becoming a global, program-first discovery platform for all disciplines and for bachelor and master degrees. See [docs/product/MVP_SPEC.md](docs/product/MVP_SPEC.md). What is described above is what exists today.

## Repositories

| Repository                                  | Responsibility                                           |
| ------------------------------------------- | -------------------------------------------------------- |
| `YunisSadig/pathway-ai-frontend` (this one) | Web UI: pages, navigation, theming, accessibility, tests |
| `YunisSadig/pathway-ai-backend`             | Data and APIs: Java 21, Spring Boot, PostgreSQL, REST    |

Backend changes are requested, never made from this repo.

## Remaining limitations

- No data yet: the backend has no verified university records, so real runs show the empty state.
- No university detail page, program browsing, tuition, requirements or verification badges (the API does not expose them).
- No scholarship backend, student profiles, eligibility evaluation, comparisons, pathways or AI guidance.
- Search is name-only and sorting is by name or city, exactly what the API supports.
- Nothing is deployed. CI runs checks only (see [docs/deployment.md](docs/deployment.md)).

## Getting started

```bash
npm install
npx playwright install chromium   # once, for browser tests
npm run dev                        # http://localhost:3000
```

## Scripts

| Command            | Purpose                                                                     |
| ------------------ | --------------------------------------------------------------------------- |
| `npm run dev`      | Start the dev server                                                        |
| `npm run build`    | Production build                                                            |
| `npm run check`    | Prettier check, ESLint, TypeScript, unit tests                              |
| `npm test`         | Vitest unit tests                                                           |
| `npm run test:e2e` | Playwright (desktop and mobile, axe). Intercepts the API: no backend needed |
| `npm run format`   | Format with Prettier                                                        |

E2E tests build the app with `NEXT_PUBLIC_API_BASE_URL=http://api.pathway.test` and fulfil that origin inside the browser with obviously synthetic fixtures (`tests/e2e/helpers/api.ts`). Those fixtures never ship in the app.

## Theme behaviour

Only **Light** and **Dark** are offered. On a first visit the device preference is applied automatically; an explicit choice is then remembered (`pathway-theme` in localStorage). Older prototype data under `pathway-ai:store` is removed on load; no other storage is touched.

## Data integrity

Every institutional or scholarship fact must come from an official source and carry a source URL, a checked date and a verification status. Unknown values stay unknown. See [CONTRIBUTING.md](CONTRIBUTING.md).
