# Pathway AI Frontend: agent notes

@AGENTS.md

- Scope: exactly four pages (`/`, `/universities`, `/scholarships`, `/how-it-works`). Do not re-add the student workspace, dashboards, auth or onboarding. A university detail route is allowed only when the backend-supported discovery flow needs it.
- Frontend only. No backend code, auth, payments, database clients or paid APIs here. `/universities` reads the Spring Boot API through `src/lib/api` (browser `fetch` to `NEXT_PUBLIC_API_BASE_URL`). Scholarships have no backend: keep their honest empty state and keep `src/lib/api/scholarships.ts` unused by pages.
- The API contract is owned by the backend repo (README "REST API contract", pinned by its `UniversityApiIT`). `src/types/university.ts` mirrors it exactly: upper-case `degreeLevel`, nullable fields, no `id`, tuition, requirements or verification. Never add a field the API does not return. If the contract changes, update types, `tests/e2e/helpers/api.ts` and the unit tests together.
- Never fall back to mock data when the API fails: show `ErrorState`. Unknown stays unknown (no placeholders, no "0").
- No university, scholarship, tuition, deadline, ranking or admission data in the app. Static geography lives in `src/lib/geography.ts`. Test fixtures must be obviously synthetic and stay in `tests/`.
- `NEXT_PUBLIC_*` is public and inlined at build time. Never put a secret in it. Changing it needs a rebuild.
- This is the frontend repository (`YunisSadig/pathway-ai-frontend`). The backend is the separate repository `YunisSadig/pathway-ai-backend`; never modify it from here. Request backend changes as written tasks.
- This repo is independent. The parent `C:\Users\Lenova` contains an unrelated DevHub repo: always confirm `git rev-parse --show-toplevel` ends in `Desktop/pathway-ai-frontend` before staging.
- Product name is exactly "Pathway AI".
- Theme: Light and Dark only in the UI; first visit follows the device preference (next-themes `defaultTheme="system"`).
- Every visible button or link must work. Omit unfinished features instead of adding placeholders.
- Checks: `npm run check`, `npm run build`, `npm run test:e2e`. E2E intercepts the API in the browser (`tests/e2e/helpers/api.ts`), so no backend is needed. Playwright reuses a server on port 3100 locally, but that server must have been built with `NEXT_PUBLIC_API_BASE_URL=http://api.pathway.test`, so make sure no stale one is running.
- Shell tip: very long Bash heredocs containing apostrophes can fail to parse; write large files with the Write tool.
