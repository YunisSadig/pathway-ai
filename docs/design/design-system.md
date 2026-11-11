# Pathway AI design system

Source of truth for tokens is `src/app/globals.css`. Components use semantic tokens only, never raw hex values. Principle: function and speed first; whitespace, type and hairlines organise the page; a boxed surface needs a reason.

## Layout and spacing

- Content width: `page-container` = max 76rem, gutters 1rem (mobile) / 1.5rem (≥640px). Everything on a page aligns to this one container.
- Section rhythm: `section-y` = 2.5rem (mobile) / 4rem (≥1024px). Inner page header to content: 2rem.
- Component spacing uses the Tailwind scale in steps of 0.5/1/2/3/4/6/8; no arbitrary pixel values for spacing. Touch targets are ≥44px (`h-11` / `min-h-11`).
- Reading measure: `measure` (60ch) for paragraphs. Detail sections use a 13rem label column plus content at ≥1024px.
- Grids: discovery filters are 5 columns at ≥1024px, 2 at ≥640px, 1 below. Results are one column of rows.

## Surfaces, borders, radii, shadows

- Page canvas `--background`; containers `--surface` with a 1px `--border`; subtle fills `--surface-muted`. Stronger `--border-strong` only on form controls and the key-facts band.
- Radii: **8px** (`rounded-lg`) for controls, chips and buttons; **12px** (`rounded-xl`) for containers and lists. Fully rounded only for status chips.
- Shadows: none on surfaces. `--shadow-md/lg` are reserved for floating layers (theme menu, mobile menu).
- One boxed container per concept: a result list is one bordered box with hairline rows, not one card per row.

## Typography

- One family: **Geist** (variable, via `next/font`, `latin` subset), used for body and headings. `font-display` is the same family.
- Weights: 400 body, 500 labels, 600 emphasis and controls, 700 headings. No 800.
- Body 16px. Smallest user-facing size 14px (`text-sm`), used for labels and explanatory copy. Uppercase micro-labels were removed.
- Headings: `title-hero` clamp(2.5rem…4.5rem), `title-section` clamp(1.75rem…2.5rem), `title-page` clamp(1.875rem…2.75rem), all weight 700 with `text-wrap: balance`. Numbers (fees, dates) use `tabular-nums`; money is `Intl.NumberFormat` with the ISO code.

## Colour

Existing identity kept: indigo primary, slate neutrals. Tokens: `primary` (+hover, soft, soft-foreground), `foreground` / `muted-foreground`, `border` / `border-strong`, `selected`, `hover`, and the status pairs `success`, `warning`, `danger` (each with a `-soft` background). Rules:

- `warning` only for genuine uncertainty (period not stated, not verified); `danger` only for outdated or passed; `success` only for verified or current. Ordinary metadata (degree level, discipline, language) is plain text, not a coloured badge.
- Status is never colour alone: each state has a label and an icon.
- Dark theme mirrors every token; contrast is checked by axe in both themes.

## Components (where to look)

| Concern                        | Component                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------- |
| Page header                    | `shared/page-intro`                                                               |
| Detail section, rows, notices  | `shared/detail-ui` (`DetailSection`, `DataRows`, `Notice`, `Evidence`, `Missing`) |
| In-page navigation             | `shared/section-nav`                                                              |
| Status chip                    | `shared/fact-ui` `TemporalBadge`, `ui/status-badge`                               |
| Destination choice             | `shared/destination-picker` (collapses to a summary once chosen)                  |
| Program/university result rows | `programs/program-card` + `program-list`, `universities/university-card` + list   |
| Filters + active chips         | `programs/program-filters`; `universities/university-toolbar`                     |
| Loading / empty / error        | `shared/loading-state`, `empty-state`, `error-state`                              |

## Conventions

- Reserve space for anything that loads (`min-h` on result regions and loading shells) so the footer never jumps.
- Animation: CSS transitions on colour only; honour `prefers-reduced-motion`; no animation libraries, no entrance or scroll effects.
- Never show an unknown as a blank or a guess: "Not stated". Never show an outdated or undated fee as a current price.
- Prefer server components; keep client components to what needs state (filters, picker, section nav, clamp text, detail views that fetch).
