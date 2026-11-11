# UX audit (before the 2026-11 quality pass)

Method: full-page screenshots of every route in Light and Dark at 1280px and 390px (real backend data), plus Lighthouse (mobile profile) on a production build. Findings are ordered by impact on the core task: finding a program quickly.

## Significant problems found, and what was done

| #   | Problem (measured or observed)                                                                                                                              | Where              | Fix                                                                                                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| 1   | The first result started ~1250px down: region row, 27-button country grid, selected bar, tabs, search, four selects, tuition row and a long note came first | Discovery, desktop | Destination collapses to a one-line summary once chosen; compact toolbar; results start near y≈720                    |
| 2   | On mobile ~700px of stacked filters sat before the first result                                                                                             | Discovery, mobile  | Search stays visible; fields sit behind one "Filters (n)" button; panel state survives applying a search              |
| 3   | A side panel ("What you can explore") repeated information from other pages and left dead space beside results                                              | Discovery          | Removed; results use the full container width                                                                         |
| 4   | Result cards were ~240px tall, in two columns, with coloured pills for ordinary metadata and the same "Read from official pages" line repeated as a footer  | Discovery          | Hairline-divided rows (~120px); plain text for degree and field; verification stays as one line per row               |
| 5   | Applied filters were not visible as a set and could only be cleared all at once                                                                             | Discovery          | One removable chip per active filter plus "Clear filters"                                                             |
| 6   | **CLS 0.408** on discovery: the loading placeholder was short, so the side panel and footer jumped when results arrived                                     | Discovery          | Results region reserves `min-h-[75vh]`; CLS 0.000                                                                     |
| 7   | **CLS 0.197 and LCP 3.48s** on the program page: footer pushed down by content replacing a short skeleton; request started only after hydration             | Program detail     | Loading shell reserves a viewport; API request is preloaded from the server-rendered HTML (starts 136ms earlier)      |
| 8   | Homepage said "verified listings are being prepared" and led with a destination-only call to action, although programs and universities are live            | Home               | Copy states what exists today (programs and universities, small and growing) and that scholarships are not listed yet |
| 9   | Two font families and weights 400/500/600/700/800; radii 8/12/18/24px and a mix of shadows; section padding up to 80px                                      | Whole site         | One family, weights ≤700, 8/12px radii, no surface shadows, section padding 40/64px (see `design-system.md`)          |
| 10  | An animation library (`motion`) shipped to the homepage for a small entrance effect                                                                         | Home               | Removed; the hero is a server component with no client JavaScript                                                     |
| 11  | Small text: 12px used for explanatory copy, country codes and chip labels                                                                                   | Several            | No 12px text remains; explanatory text is ≥14px and uppercase micro-labels were removed                               |
| 12  | Dead code: `SourceLine`, `Fact`, `useSelection`                                                                                                             | Shared             | Deleted                                                                                                               |

## Checked and fine

- No horizontal overflow at 360, 390, 768, 1024, 1280 or 1920px in either theme, on the home, discovery (programs and universities views), scholarships, how-it-works, program and university pages.
- Axe: zero violations in Light and Dark on the covered pages (automated; not a substitute for manual testing).
- Scholarships page is an honest empty state; no data is invented anywhere.

## Found while fixing (regressions caught by visual review and tests)

- The tuition input and currency select overflowed on mobile and were squeezed on desktop (grid track sized to the input's intrinsic width). Fixed with a constrained track.
- Applying a search remounted the filter form and re-collapsed the mobile panel. The open state now lives in the stable parent.
- On wrapped rows the "·" separator was left dangling at the start of a line. The place now sits on its own line on mobile.
- E2E helper raced the page's static shell (a fallback renders until the client mounts); it now waits for the real form first.

## Remaining limitations

- Program results show no tuition: the list endpoint does not return it, and fetching each program would multiply requests. A summary field on the list endpoint is the right fix (requested backend work, not done here).
- Discipline and language options are still derived from a second request (`size=100`) because there is no facets endpoint.
- Manual screen-reader testing and a real-user INP measurement were not done.
