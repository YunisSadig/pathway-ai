# Pathway AI Frontend

Your future deserves more than a guess.

Pathway AI is an international education guide that is **in development**. This repository (`pathway-ai-frontend`) is the web frontend: Next.js (App Router), TypeScript (strict), Tailwind CSS and accessible Radix primitives. It talks to the separate Spring Boot API in [`pathway-ai-backend`](https://github.com/YunisSadig/pathway-ai-backend). There is no auth, account system or database client here.

## What exists today

| Route                    | Purpose                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `/`                      | Home: what Pathway AI is, what works now, where it is heading                                                                  |
| `/universities`          | **Program-first discovery** (live): destination, then programs (default) or universities; filters, search, sorting, pagination |
| `/universities/[slug]`   | University details and the programs it offers (live)                                                                           |
| `/programs/[identifier]` | Program details: tuition, deadlines, admission requirements, official links and sources (live)                                 |
| `/scholarships`          | Explains why funding differs. Honest empty state: there is no scholarship backend yet                                          |
| `/how-it-works`          | The five stages, marked Available now, In preparation or Planned                                                               |

The primary navigation is still exactly Home, Universities, Scholarships and How It Works. Program pages sit under the
Universities experience (Universities stays highlighted).

## Backend integration (implemented)

The browser calls the Spring Boot API in `pathway-ai-backend` directly, through `src/lib/api`
(`{NEXT_PUBLIC_API_BASE_URL}`):

| Endpoint                            | Used for                                                          |
| ----------------------------------- | ----------------------------------------------------------------- |
| `GET /api/v1/programs`              | program list, filter choices (first 100 programs for the country) |
| `GET /api/v1/programs/{identifier}` | program detail: tuition, intakes, requirements, sources           |
| `GET /api/v1/universities`          | university list                                                   |
| `GET /api/v1/universities/{slug}`   | university detail with its programs                               |

Scholarships have **no** API yet; that page stays an honest empty state and nothing is requested for it.

Every filter lives in the URL, so views are shareable and the back button works:

| URL parameter            | Meaning                                                               | API parameter                   |
| ------------------------ | --------------------------------------------------------------------- | ------------------------------- |
| `view`                   | `programs` (default) or `universities`                                | which endpoint                  |
| `region`, `country`      | Destination. `country` is an EU member-state slug                     | `country` (ISO code)            |
| `q`                      | Name search (max 100 characters)                                      | `q`                             |
| `level`                  | `bachelor`, `master`, `doctorate`, `diploma`, `certificate`           | `level`                         |
| `field`                  | Discipline (academic-field slug; the API includes child fields)       | `field`                         |
| `language`               | Teaching language code                                                | `language`                      |
| `tuitionMax`, `currency` | Maximum yearly tuition and its currency                               | `tuitionMax`, `tuitionCurrency` |
| `sort`, `direction`      | programs: `name`, `university`, `level`; universities: `name`, `city` | `sort`, `direction`             |
| `page`                   | One-based page (12 per page)                                          | `page` (zero-based)             |

Invalid values are ignored, never forwarded.

- The API filters by **one** country. A single-country region (US, Canada, China, South Korea, Japan) sends its ISO code. The EU alone asks you to choose a member state.
- States: loading skeleton, empty (honest, with a way back), and error with **Try again** (unreachable, 4xx/5xx, malformed response, not configured). **The app never falls back to mock data.**
- Types in `src/types` mirror the backend DTOs exactly. `npm run contract:check` compares them with a running backend (it passed against the local backend: 8 programs, 3 universities).

### How facts are presented

- **Unknown stays unknown:** a missing value reads "Not stated"; no placeholder, no `0`, no guess.
- **Every changing fact cites its official source** and the date it was read. A program shows when it was last verified.
- **Year-specific facts** (tuition, deadlines, requirements) carry the backend's `temporalStatus`: **Current**, **Outdated** (the period ended; shown muted with an explicit warning, never as today's price) or **Period not stated** (confirm independently). Tuition shows the currency code, the unit (per year, per semester, whole program), the applicant group as the university defines it, and the period in the source's own words.
- **Links:** "Official program page" and "Official admissions information" are informational. An **Apply** button appears **only** when the API returns a verified active application link; otherwise the page says no verified link exists. No admissions probabilities, rankings, tuition savings or scholarship awards are shown or implied.
- **Funding:** there is no scholarship data, so each program page says so instead of implying any.

### Backend URL configuration

| Variable                   | Example                 | Notes                                                                         |
| -------------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080` | Origin only. **Public and inlined at build time**: rebuild after changing it. |

Copy `.env.example` to `.env.local`. The browser calls the backend directly (cross-origin), so the backend must allow the frontend origin: set its `CORS_ALLOWED_ORIGINS` to the exact frontend origin (default `http://localhost:3000`; wildcards are refused). A wrong origin appears as "could not be reached", because browsers hide CORS failures from scripts. Never put a secret in a `NEXT_PUBLIC_*` variable; the API is public and read-only.

### Run both locally

```bash
# 1. Backend repo (JDK 21, Docker): see its README
docker compose up -d
IMPORT_REFERENCE_DATA=true ./mvnw spring-boot:run     # http://localhost:8080 ; imports the 8 source-cited programs

# 2. This repo
cp .env.example .env.local
npm install
npm run dev                                           # http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 npm run contract:check   # optional: types vs the real API
```

Without the reference-data import the database is empty and the pages show honest empty states.

## Product direction

Pathway AI is becoming a global, program-first discovery platform for all disciplines and for bachelor and master degrees. See [docs/product/MVP_SPEC.md](docs/product/MVP_SPEC.md).

## Repositories

| Repository                                  | Responsibility                                           |
| ------------------------------------------- | -------------------------------------------------------- |
| `YunisSadig/pathway-ai-frontend` (this one) | Web UI: pages, navigation, theming, accessibility, tests |
| `YunisSadig/pathway-ai-backend`             | Data and APIs: Java 21, Spring Boot, PostgreSQL, REST    |

Backend changes are requested, never made from this repo.

## Remaining limitations

- **The data set is tiny** (8 source-cited programs, 3 universities in 2 countries). Most filters will return few results.
- **No scholarships backend**, so no scholarship pages, eligibility or funding amounts.
- **Filter choices** (disciplines, languages) are derived from the first 100 programs for the chosen destination, because the API has no facets endpoint (requested backend task: `GET /api/v1/fields`). Level and currency lists are static.
- **No active Apply links yet:** the backend has no verified application portal URLs, so no Apply button is shown anywhere.
- **No eligibility filter:** the API has no structured eligibility data to filter on.
- **Nothing is deployed** and the backend is not hosted, so no full-stack production integration exists. See [docs/deployment.md](docs/deployment.md).
- No student profiles, comparisons, pathways or AI guidance.

## Getting started

```bash
npm install
npx playwright install chromium   # once, for browser tests
npm run dev                        # http://localhost:3000
```

## Scripts

| Command                     | Purpose                                                                     |
| --------------------------- | --------------------------------------------------------------------------- |
| `npm run dev`               | Start the dev server                                                        |
| `npm run build`             | Production build                                                            |
| `npm run check`             | Prettier check, ESLint, TypeScript, unit tests                              |
| `npm test`                  | Vitest unit tests                                                           |
| `npm run test:e2e`          | Playwright (desktop and mobile, axe). Intercepts the API: no backend needed |
| `npm run contract:check`    | Compare the TypeScript types with a running backend's real responses        |
| `npm run verify:deployment` | Health-check a deployed site and its API (pages, build wiring, CORS)        |
| `npm run format`            | Format with Prettier                                                        |

E2E tests build the app with `NEXT_PUBLIC_API_BASE_URL=http://api.pathway.test` and fulfil that origin inside the browser with obviously synthetic fixtures (`tests/e2e/helpers/api.ts`). Those fixtures never ship in the app.

## Theme behaviour

Only **Light** and **Dark** are offered. On a first visit the device preference is applied automatically; an explicit choice is then remembered (`pathway-theme` in localStorage). Older prototype data under `pathway-ai:store` is removed on load; no other storage is touched.

## Data integrity

Every institutional or scholarship fact must come from an official source and carry a source URL, a checked date and a verification status. Unknown values stay unknown. See [CONTRIBUTING.md](CONTRIBUTING.md).
