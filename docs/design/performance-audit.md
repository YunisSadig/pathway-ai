# Performance audit

## Method (reproducible)

- Production build (`npm run build`) served with `next start -p 3000`. Port 3000 matters: the backend's CORS list allows only `http://localhost:3000`, so any other port makes API calls fail and silently measures an error state. (My first baseline did exactly that on port 3200 and was discarded.)
- Lighthouse 13.6 CLI, default mobile profile (simulated slow 4G, 4× CPU slowdown), headless Chromium 1254, performance + accessibility + best-practices, against the live Spring Boot backend and its PostgreSQL data. Lighthouse and its install live outside the repo.
- Before = branch `feat/premium-program-detail-ux` (PR #11 head, commit `86a94cc`). After = this branch. Same machine, same data, same method. Two "after" runs are shown to give a sense of variance.
- These are lab measurements. They are not field data, and INP cannot be measured in the lab; **Total Blocking Time is reported as the lab proxy**.

## Results

| Page (mobile profile)        | Perf before → after | LCP before → after | CLS before → after | TBT before → after | JS transferred | Total transferred | Requests    |
| ---------------------------- | ------------------- | ------------------ | ------------------ | ------------------ | -------------- | ----------------- | ----------- |
| Home `/`                     | 100 → 99–100        | 0.76 → 0.75 s      | 0 → 0              | 48 → 58–95 ms      | 239 → 193 KB   | 364 → 263 KB      | 25 → 20     |
| Discovery `/universities`    | **80 → 99–100**     | 0.75 → 0.75 s¹     | **0.408 → 0.000**  | 98 → 90–94 ms      | 239 → 209 KB   | 371 → 296–301 KB  | 26 → 30–31² |
| Discovery, Finland           | **80 → 99**         | 0.76 → 0.75 s¹     | **0.408 → 0.000**  | 96 → 92–97 ms      | 239 → 209 KB   | 377 → 293 KB      | 27 → 28     |
| Program `/programs/…`        | **81 → 95**         | **3.48 → 2.85 s**  | **0.197 → 0.000**  | 109 → 96 ms        | 256 → 209 KB   | 382 → 282–291 KB  | 27 → 22–26  |
| University `/universities/…` | 99 → 95             | 0.75 → 2.86 s³     | 0.063 → 0.037      | 51 → 98–105 ms     | 256 → 209 KB   | 390 → 290 KB      | 32 → 28     |
| Scholarships                 | 100 → 99–100        | 0.75 → 0.75 s      | 0 → 0              | 47 → 97–102 ms     | 229 → 181 KB   | 347 → 245 KB      | 19 → 14     |

Accessibility 100 and best-practices 100 on every page before and after. `.next/static/chunks`: 996 KB → 860 KB.

¹ On discovery the LCP element is the static page title; the results load after it. The 0.75 s therefore does not describe when results appear. Layout stability of the results is what changed (CLS).
² Discovery requests rose because rows are denser: more links are in the first screen, so Next.js issues more route prefetches (6 → 14 RSC prefetch requests in the trace). Font requests fell 4 → 1 (one family). The page still makes exactly two API calls (the result page and the 100-row facet list used for filter options), as before.
³ Before, the university page's LCP element was the footer text (the content area was still short), so 0.75 s did not describe real content. Now the LCP element is the first program title, which exists only after the API responds. This is a measurement change, not a slowdown: real content on this page previously arrived no earlier than on the program page.

TBT rose in the "after" runs on pages whose only change was removing `motion`; run-to-run TBT in this setup varies roughly 45–105 ms, so these differences are within noise and are not claimed as regressions or gains.

## What changed and why

| Change                                                                                                         | Effect                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Reserve space for results (`min-h-[75vh]`) and loading shells (`min-h-[100svh]`)                               | CLS 0.408 → 0.000 (discovery), 0.197 → 0.000 (program)                                                                  |
| Preload the program/university API request from the server-rendered HTML (`react-dom` `preload`, `as="fetch"`) | Request starts at 28 ms instead of 164 ms and is reused (one request, verified in the trace); program LCP 3.48 → 2.85 s |
| Removed the `motion` animation library; hero is a server component                                             | Home JS 239 → 193 KB; no animation JavaScript anywhere                                                                  |
| One font family (Geist) instead of two                                                                         | Font requests 4 → 1 on discovery; no cross-font reflow                                                                  |
| Removed unused code (`SourceLine`, `Fact`, `useSelection`)                                                     | Smaller modules                                                                                                         |
| Dropped surface shadows and 800 weights                                                                        | Simpler CSS; no measurable timing effect                                                                                |

To let the browser reuse the preloaded response the client no longer sends a custom `Accept` header (the Spring API answers JSON for `*/*`).

## Findings that need no change

- Server vs client: the discovery and detail views fetch in the browser on purpose. Server-side fetching would hide requests from the browser, and the whole E2E suite mocks the API with browser request interception. The preload keeps the fetch client-owned while removing most of the waterfall.
- Hydration: only filters, the destination picker, the section nav, expandable text, theme switcher, mobile menu and the data views are client components. Home, scholarships and how-it-works ship no page-specific client code.
- Duplicate requests: one request per view (asserted in E2E "no duplicates"); request cancellation and URL-state are unchanged.
- Images: none. Icons are inline SVG from `lucide-react` (tree-shaken).

## Remaining bottlenecks

- Program and university LCP is 2.85 s on the simulated mobile profile, above the 2.5 s goal. The time is client hydration plus rendering under 4× CPU slowdown after the data arrives (unthrottled element render delay ≈ 390 ms). Closing the gap needs server-rendered data (streamed HTML), which would require changing how the E2E suite mocks the API; not done.
- The facet request (`size=100`) is a second API call on every discovery load; a facets endpoint would remove it.
- No field data (CrUX/RUM) exists; INP is unmeasured.
