# Competitive UI research

Method: each site below was opened in a real browser (Playwright, 1280×800, light default, 2026-11-11). For every site I extracted measurable properties from the live DOM (font family and size, heading size and weight, border-radius distribution, navigation items, page height) and captured a viewport screenshot. I looked at the screenshots for Mastersportal (home and results), Coursera, UCAS, edX and Airbnb. For Common App, Linear, GitHub, Notion, Duolingo and Spotify I read only the DOM metrics and did not examine the screenshots, so nothing is claimed about their visuals.

Limits: pages were examined signed out and without interaction beyond loading. Nothing here is a claim about real performance or audience. Coursera redirected the search query to a category page (its search was not examined). UCAS' consent overlay covered the first screen and was left untouched. Spotify's signed-out web player is an app shell (674px tall) with little to compare. Studyportals' corporate site was not opened separately; Mastersportal is its student-facing product.

## What was inspected

| Product       | Pages                             | Observed (measured unless stated)                                                                                                                                                                 |
| ------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mastersportal | Home, `/search/master` results    | Open Sans 16px; 5-item nav; hero with one "Study & Country" search; result rows with a large title, tag chips and a right-aligned "2 years · AZN 49,483/yr" and a link                            |
| Coursera      | Category page (search redirected) | Source Sans 16px; global search in the header; breadcrumbs; pill filter chips; image-led cards; page 9,206px tall; ~8px radius on buttons                                                         |
| UCAS          | Home                              | Roboto 16px; 68px/900 headline; consent overlay over the first screen; 9+ item nav as a horizontal scroll strip; promo tiles; 4,437px                                                             |
| edX           | Home                              | Inter 16px; header = logo, "Learn" menu, wide always-visible search, language toggle, sign-in; promo banner plus cookie bar; 9,730px; icon-plus-text course meta rows                             |
| Common App    | Home                              | Figtree 16px; 90px/500 headline; audience-segmented nav (students, counselors, colleges); 40px pill buttons; 8,191px                                                                              |
| Linear        | Home                              | Inter Variable; dark by default; 64px/510 headline; radii 4/8px dominate; `#08090a` background; hairline separators                                                                               |
| GitHub        | `vercel/next.js`                  | Mona Sans 14px body (dense); radius 6px on 67 of 100 controls; tab navigation with counts; `data-color-mode="auto"`                                                                               |
| Airbnb        | Search results (Helsinki)         | Compact search-summary control in the header; "Filters" button plus a quick-chip row; "Over 1,000 homes in Helsinki" result heading; price states its basis ("for 5 nights", "all fees included") |
| Notion        | Home                              | 96px/600 headline; 8px radius on 71 of 100 controls; large marketing page (4,559px)                                                                                                               |
| Duolingo      | Home                              | 17px body, 32px headline; minimal header; 7,576px                                                                                                                                                 |
| Spotify       | Web player (signed out)           | App shell with a persistent library column; pill (9999px) controls                                                                                                                                |

## Patterns adopted (and why)

1. **Results as a scannable list, not a card grid** (Mastersportal results, GitHub lists). Rows divided by hairlines inside one container give a denser, easier scan than 2-column cards. Our old cards were ~240px tall; rows are ~120px, so five programs fit in one screen.
2. **A compact search-summary instead of a wall of options** (Airbnb). Once a destination is chosen, the 27-country grid collapses to a one-line "Destination: Finland, European Union · Change · Clear". Results now start near y≈720 instead of ≈1250.
3. **A "Filters" disclosure on narrow screens plus removable chips for what is applied** (Airbnb, Coursera). Mobile shows search plus one Filters button; applied filters show as chips that each remove one filter.
4. **Show the basis of a price** (Airbnb "for 5 nights", "all fees included"). Our rows and key-facts band state the billing period, the applicant group and whether the fee is current, and never present one fee as everyone's price.
5. **One dominant radius, restrained palette, hairlines** (GitHub 6px, Linear 4/8px, Notion 8px). We moved to 8px for controls and 12px for containers, dropped surface shadows, and use pills only for status chips.
6. **One type family, 3–4 weights, a fixed body size** (every product above uses one family; GitHub's 14px body shows density is fine when contrast is good). We dropped the second font (Manrope) and weight 800, and kept 16px body with 14px as the smallest explanatory size.
7. **Breadcrumbs and an in-page section strip** (Coursera breadcrumbs; GitHub tabs). Kept from the detail-page redesign.
8. **Dark and light as first-class** (Linear, GitHub `auto`). Already in place; kept, with contrast verified by axe in both themes.

## Patterns explicitly avoided

- Photo or illustration-led heroes and cards (Mastersportal, Coursera, edX): costly in bytes and scroll length, and we have no verified imagery.
- Promo banners, consent overlays that cover the first screen, and unrelated promo tiles (UCAS, edX): they push the task below the fold.
- A long scrolling nav strip (UCAS, 9+ items): we keep exactly four links.
- Sponsored or "featured" ranking, popularity or "Top n%" labels (Mastersportal): we do not rank or imply quality.
- Prices converted into the viewer's currency with no year or applicant group (Mastersportal result rows): this is the exact trust failure our data model exists to prevent.
- Display headlines of 64–96px (Common App, Notion, Linear): our hero stays at `clamp(2.5rem, …, 4.5rem)` and inner pages at ≤2.75rem.
- Entrance and scroll animation, a JavaScript animation library for decoration: removed `motion` entirely.
- Pill-shaped everything (Common App, Spotify): reserved for status chips.
