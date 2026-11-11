# Detail page design (program and university)

## Problems found in the first version

- Every fact, fee, deadline and requirement sat in its own bordered card inside a bordered section card: five levels of boxes, no hierarchy.
- The same orange or red warning and a full "Source: … read …" line were repeated under every fee, date and requirement.
- Tuition, the next deadline and the way to apply were far below the title. A reader had to scroll the whole page to answer "what does it cost and when do I apply".
- Facts that cost one word ("Master's", "Not stated") took a whole grid cell.
- No in-page navigation on a page several screens long.

## Information architecture

Hero (name, university, place, duration, language, verification, official actions) → key-facts band (tuition, next deadline,
admissions, funding) → sticky section navigation → Overview → Tuition & funding → Admissions → Deadlines & intakes → Sources.
Deadlines and Sources appear (in the page and in the navigation) only when the backend returned data for them.

## Patterns (reuse these for the scholarship page)

| Need                          | Component                                                             | Notes                                                                         |
| ----------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Section with anchor           | `DetailSection`                                                       | Title left, content right on wide screens; `scroll-mt-32` clears sticky bars. |
| Plain facts                   | `DataRows` / `DataRow`                                                | Hairline-separated rows, not boxes.                                           |
| Absence of data               | `Missing`                                                             | One sentence; never implies "free" or "none".                                 |
| Context warning               | `Notice` (info, warning, danger)                                      | Icon plus text, never colour alone.                                           |
| Citation                      | `Evidence`                                                            | Collapsed `<details>`; says "page read" is not "still current".               |
| Status                        | `TemporalBadge`                                                       | Current, Outdated, Period not stated.                                         |
| Long published text           | `ClampText`                                                           | Three lines plus an expand button; text is never rewritten.                   |
| In-page navigation            | `SectionNav`                                                          | Anchors; scroll-spy only sets `aria-current`; horizontal strip on mobile.     |
| Fees, deadlines, requirements | `TuitionList`, `DeadlineTimeline`, `RequirementGroups`, `FundingList` | Rows, timeline, grouped lists, kind-labelled list.                            |

The only bordered surface above the fold is the key-facts band. Cards remain on discovery results.

## Trust rules kept (and tested)

- The key-facts tuition shows a price only for a fee the backend marks `CURRENT`; otherwise it says the year is unconfirmed, that only outdated fees exist, or that none is published.
- "Next deadline" is the earliest dated `CURRENT` intake. Outdated or undated cycles never produce one (`nextDeadline`, unit tested).
- Order and status come from `temporalStatus`, not list position. Outdated items stay visible, struck through and labelled.
- Requirement groups map only API `RequirementType`s. No subject-prerequisite or portfolio group exists because the API has no such type; a general description is shown as published.
- "Verified" means a page was read on a date. The page says this does not confirm it is still current.
- Funding: no endpoint exists, so one empty state is shown. `FundingList` can render the six kinds separately once data exists.

## Limitations

- No funding API; no structured eligibility; the funding kinds are a frontend contract that must be checked against a future backend DTO.
- The key-facts band shows only the first current fee plus a count when several exist.
- Scroll-spy uses a fixed `rootMargin` tuned to the 4rem header and the navigation bar.
