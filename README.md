# Pathway AI

A browser-local international education planning prototype, initially for bachelor's applicants from Azerbaijan. All programs, costs, and matching results are fictional demonstrations, not admission advice or probabilities. No backend, authentication, AI integration, or deployment is included.

## Develop

Use Node.js 24 LTS and npm. On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm`.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Built with Next.js App Router, TypeScript, and Tailwind CSS. Feature dependencies are recorded in package.json.

## Validate

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

`check` runs formatting, ESLint, TypeScript, Vitest, and a production build. Playwright runs browser journeys and axe accessibility checks against the production app. See CONTRIBUTING.md for review expectations.

## Decisions

- Keep a single frontend app with small components and pure calculation functions.
- Store demonstration preferences locally; treat browser storage as untrusted input.
- Separate fictional program data from UI for a future Spring Boot API adapter.
- Do not present matching scores as admission chances or simulated advisor text as AI advice.
- CI validates changes; deployment is intentionally absent.
