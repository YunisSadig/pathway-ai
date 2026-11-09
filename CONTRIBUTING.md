# Contributing

## Workflow

- Branch from `main` (`feat/…`, `fix/…`, `test/…`, `ci/…`); keep `main` stable.
- Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat(ui): …`, `fix(mobile): …`).
- Before opening a PR run `npm run check`, `npm run build` and `npm run test:e2e`.
- Open a PR using the template; significant PRs need approval before merge.

## Rules

- Use semantic design tokens from `src/app/globals.css`; no hardcoded colours in components.
- Server Components by default; add `"use client"` only for interactivity.
- The theme UI offers Light and Dark only. Never expose a "System" option.
- Never commit `.env` files, tokens or personal data.

## Data rules

- Every institutional or scholarship fact needs a real official source URL, a checked date and a verification status.
- Record what a fact applies to (degree level, intake, citizenship, academic year).
- If a value cannot be verified, store it as unknown. Do not invent figures, rankings, deadlines or admission probabilities.
