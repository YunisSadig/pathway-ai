# Pathway AI Frontend: agent notes

@AGENTS.md

- Scope: exactly four pages (`/`, `/universities`, `/scholarships`, `/how-it-works`). Do not re-add the student workspace, detail pages or mock data until a real database exists.
- Frontend only. No backend, auth, payments, database clients or paid APIs yet. `src/lib/api` is a typed fetch wrapper for the future Spring Boot API; no page calls it. Test fixtures must be obviously synthetic and stay in `tests/`.
- No university, scholarship, tuition, deadline, ranking or admission data in the app. Static geography lives in `src/lib/geography.ts`.
- This is the frontend repository (`YunisSadig/pathway-ai-frontend`). The backend will live in a separate repository, `pathway-ai-backend`, which does not exist yet.
- This repo is independent. The parent `C:\Users\Lenova` contains an unrelated DevHub repo: always confirm `git rev-parse --show-toplevel` ends in `Desktop/pathway-ai-frontend` before staging.
- Product name is exactly "Pathway AI".
- Theme: Light and Dark only in the UI; first visit follows the device preference (next-themes `defaultTheme="system"`).
- Every visible button or link must work. Omit unfinished features instead of adding placeholders.
- Checks: `npm run check`, `npm run build`, `npm run test:e2e`. Playwright reuses a server on port 3100, so make sure no stale one is running.
