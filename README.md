# Pathway AI

A browser-local international education planning prototype, initially for bachelor's applicants from Azerbaijan. All programs, costs, and matching results are fictional demonstrations, not admission advice or probabilities. No backend, authentication, AI integration, or deployment is included.

## Develop

Use Node.js 24 LTS and npm. On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm`.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style Radix/CVA controls, Lucide, next-themes, and Motion. Self-hosted Manrope and Inter avoid third-party font requests. Feature dependencies are recorded in package.json.

## Demonstration features

The homepage connects to a five-step assessment, personalized dashboard, fictional program explorer with filters/details/comparisons, IELTS/SAT Improvement Lab, primary/backup Pathway Planner, Life Abroad reflections, cost scenarios, and a scripted advisor preview. Light, dark, and system themes persist locally. Profile drafts, progress, goals, and route choices use `pathway-profile-v1` in localStorage; use **Start fresh** in onboarding to clear the demo profile. Advisor messages stay in memory only. Use fictional information.

No saved assessment is required to explore: workspace screens show a clearly labeled example profile. Scores, program requirements, destinations/cities, intake timing, and costs are illustrative. Citizenship, age, and qualification details are collected as future integration context; this simplified model does not assess immigration or credential eligibility. No claims about real institutions or admission outcomes are made.

## Validate

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

`check` runs formatting, ESLint, TypeScript, Vitest, and a production build. Playwright runs browser journeys and axe accessibility checks against the production app. See CONTRIBUTING.md for review expectations.

Visual regression baselines cover four important screens in both themes at mobile and desktop sizes. To propose an intentional update, run `npx playwright test tests/e2e/visual.spec.ts --update-snapshots`, inspect each changed image and diff, then rerun the suite without that flag. Never regenerate baselines to hide a failure. Full-screen responsive/axe coverage also includes tablet and all workspace routes. Chromium is the current browser target; manual screen-reader and additional browser audits remain future work.

GitHub Actions performs the same checks with read-only repository permissions, report uploads on failure, and no deployment. Main requires **Frontend checks**, blocks force pushes/deletion, and allows the owner to maintain the repository. Significant merges require explicit owner approval. Dependent PRs may temporarily target the preceding feature branch while review is pending; retarget to main in dependency order after approval.

## Decisions

Mobile CTAs use an explicit stacked layout, removing the old platform-dependent button wrapping. Chromium visual references are shared across Windows and Linux; inspect actual/diff artifacts before proposing any reference change. Browser-specific interaction checks complement these references.

- Keep a single frontend app with small components and pure calculation functions.
- Store demonstration preferences locally; treat browser storage as untrusted input.
- Separate fictional program data from UI for a future Spring Boot API adapter.
- Do not present matching scores as admission chances or simulated advisor text as AI advice.
- CI validates changes; deployment is intentionally absent.
- Interaction tokens live in `app/interactions.css`: 150ms press/hover, 180ms menus, 240ms assessment movement, and 280ms surface entrances. CSS handles simple feedback; Motion handles assessment and scenario layout. Reduced-motion and forced-colors fallbacks are explicit. Theme palettes switch atomically to retain contrast; only the menu/icon animate.
- Demo fit index: 35% academic, 25% affordability, 15% lifestyle, 15% field relevance, 10% destination preference. Academic fit uses grade, IELTS, and an optional fictional SAT threshold. Grade conversion from 0–5 is a simple ×20 illustration, not a recognized credential equivalence. No index is an admission probability.
- Year-one cost = tuition + 12 × (rent + food + transport) + insurance + setup + adjustable contingency. No scholarships or employment income are assumed.
- Academic/cost/scenario functions live in `lib/planning.ts`, fictional records in `lib/programs.ts`, and profile validation/decoding in `lib/profile.ts`. Replace these boundaries with verified, timestamped API data when a backend is introduced.
- Browser storage is unencrypted, versioned, validated on read, and falls back to session memory when writes fail. Do not enter sensitive information.
- The production dependency audit is clean at setup. Development tooling currently reports a moderate transitive `minimatch` advisory (GHSA-g3hv-75wg-m249); avoid forced major downgrades and reevaluate compatible upstream fixes during maintenance.
