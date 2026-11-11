# Deployment readiness

**Nothing here has been provisioned, deployed or paid for.** CI and deployment are different things.

## CI (implemented, automatic)

`.github/workflows/ci.yml` runs on every push to `main` and every pull request: `npm ci` → format check → ESLint → TypeScript (`next typegen`) → Vitest → `next build` → Playwright (desktop + mobile, axe). It needs no secrets and no backend: Playwright builds with `NEXT_PUBLIC_API_BASE_URL=http://api.pathway.test` and intercepts that origin. CI never deploys.

## CD (not implemented: needs owner approval and a host)

The app is a standard Next.js server build (`next build` / `next start`, Node 24). It has `cacheComponents` enabled, so prefer a host with first-class Next.js support over static export.

| Option                      | Fit                                                    | Likely cost (confirm before approving)        |
| --------------------------- | ------------------------------------------------------ | --------------------------------------------- |
| Vercel                      | Native Next.js, preview deploy per PR, automatic HTTPS | Free hobby tier (non-commercial); Pro is paid |
| Netlify / Cloudflare Pages  | Works with their Next.js adapters                      | Free tiers; adapter support varies by feature |
| Container host (Render/Fly) | Run `next start` in a Node image                       | Small paid instance                           |

### Connecting to a hosted backend

1. Deploy the backend first (see its `docs/deployment.md`) and note its public **https** origin.
2. In the frontend host's project settings set `NEXT_PUBLIC_API_BASE_URL=https://<backend-origin>` for the **build** (it is inlined at build time; changing it requires a redeploy). It is public, so it must never hold a secret.
3. Set the backend's `CORS_ALLOWED_ORIGINS` to the exact deployed frontend origin (no wildcard, no trailing slash). Preview deployments get different origins; either add them explicitly or point previews at a non-production backend.
4. Use https for both, or browsers will block mixed content.
5. Smoke test: open `/universities`; the browser network tab should show a `200` from `/api/v1/universities` and no CORS error.

### Findings

- The frontend is deployable as-is. The only required configuration is `NEXT_PUBLIC_API_BASE_URL`.
- Without it, `/universities` shows an explicit "isn't configured" state rather than fake data.
- A backend cold start (free tiers sleep) shows as a temporary error with **Try again**.
- Because the origin is baked into the bundle, one build serves one backend. If you later want one build for many environments, add a same-origin proxy/rewrite or read the URL at runtime; that is a deliberate future change, not needed now.
- Automatic deployment would be either the host's Git integration (deploys from `main` after CI) or a GitHub Actions deploy job with environment secrets. Neither exists yet.
