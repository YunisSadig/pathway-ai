# Frontend integration notes

Decisions and real problems from connecting the frontend to the Spring Boot API. Update this file when you hit a new
one. Never record an unverified fix as successful.

## Decisions

1. **Browser-direct API calls.** The browser calls `NEXT_PUBLIC_API_BASE_URL` (public, inlined at build time). There is no
   server-side proxy, so the backend must list the frontend origin in its CORS settings. This keeps the frontend a pure
   static-plus-client app and avoids hiding the API behind a second server. Trade-off: one build serves one backend.
2. **URL is the state.** Destination, view, search, filters, sort and page live in the query string and are validated by
   `src/lib/discovery-query.ts`. Invalid values are dropped, never forwarded to the API. Links are real `<a>` elements, so
   they work with the keyboard, the back button and shared URLs.
3. **Types mirror the DTOs.** `src/types/program.ts` and `university.ts` copy the backend records field for field.
   `scripts/check-contract.mjs` verifies them against a running backend; it found no mismatch on 2026-11-11.
4. **Program-first.** `/universities` shows programs by default with a Programs / Universities switch. Program pages live at
   `/programs/[identifier]` (nested under the Universities experience) so the four-link primary navigation is unchanged.
5. **Honest presentation.** The backend labels year-specific facts `CURRENT`, `HISTORICAL` or `UNKNOWN_YEAR`; the UI shows
   them as Current, Outdated and Period not stated, never merges them, and shows each fact's source and read date. An Apply
   button exists only for a non-null `officialApplicationUrl`.
6. **Filter choices without a facets endpoint.** Disciplines and languages are derived from the first 100 programs for the
   destination. This is exact for the current data set and incomplete beyond 100 programs. Requested backend task:
   `GET /api/v1/fields` (and languages).
7. **Tuition filter semantics are the backend's:** only current, same-currency, per-year fees match. The UI says so.

## Mistakes and fixes

| Problem                                                                                                       | Cause                                                                                                                                                                           | Fix                                                                                                                                                    | Prevention                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `next build` failed: "client rendering was requested outside a Suspense boundary" on `/programs/[identifier]` | Cache Components: `usePathname` in the header (root layout) is dynamic on a route with a dynamic segment                                                                        | Read the path inside `<Suspense>` in `site-header.tsx`, with a link-only fallback; add `generateStaticParams` with a placeholder to each dynamic route | Any hook that reads the path or params needs a Suspense boundary above it                                                                                                                  |
| Tuition filter form would not submit                                                                          | `<input type="number" min="1" step="100">`: `3000` is invalid because steps count from `min`                                                                                    | `step="any"`                                                                                                                                           | Do not combine `min` with a coarse `step` unless the base is intended                                                                                                                      |
| E2E `getByLabel("Degree level")` matched two selects                                                          | `getByLabel` also matches option text inside another label ("Degree level" is an option of Sort by)                                                                             | `getByRole("combobox", { name })`                                                                                                                      | Use role queries for selects                                                                                                                                                               |
| E2E request counts were always empty for programs                                                             | the program mock recorded into its own list, not the one the test read                                                                                                          | `mockPrograms(page, override, into)` shares one list                                                                                                   | One recorder per page                                                                                                                                                                      |
| The program card link name collided in tests                                                                  | the university link and program link both contain text                                                                                                                          | distinct names (`Synthetic Program 03`, `Synthetic Test University 03`)                                                                                | Give fixtures unique names                                                                                                                                                                 |
| Prettier or node edit scripts silently did nothing                                                            | working copies on this machine have CRLF line endings                                                                                                                           | normalise `\r\n` before matching; check that a replacement actually changed the file                                                                   | Make edit scripts throw when nothing changed                                                                                                                                               |
| `/universities` showed "The program service isn't configured"                                                 | `.env.local` did not exist (it is git-ignored, so a fresh checkout or a deleted file has none) and the dev server had been started without it; the backend was also not running | Created `.env.local` from `.env.example`, started the backend, restarted `npm run dev` (it logs `Environments: .env.local`)                            | Env files are read at startup: restart after any change. The UI distinguishes "not configured" (variable empty) from "could not be reached" (backend down). README troubleshooting section |
| A stale local server was reused by Playwright                                                                 | `reuseExistingServer` outside CI                                                                                                                                                | stop port 3100 before e2e                                                                                                                              | documented in CLAUDE.md                                                                                                                                                                    |

## Known gaps

- Facets are derived (decision 6). No eligibility filter (the API has no structured eligibility). No scholarships.
- `/programs/example` and `/universities/example` are prerendered placeholder shells (required by Cache Components); they
  show a not-found state because the placeholder id does not exist.
- Nothing is deployed; see `docs/deployment.md`.
