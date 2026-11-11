# Deployment

**Status: nothing is deployed.** The frontend is ready to deploy, but a hosting account login, a decision about
commercial use, and a deployed backend are needed first. This page records what was verified (on 2026-11-11, from the
providers' official documentation) and exactly what to do.

CI and deployment are different things. **CI** (`.github/workflows/ci.yml`) runs checks on every push and pull request.
**Deployment** (`.github/workflows/deploy.yml`) publishes a build; it is switched off until you enable it.

## 1. Which free plan can host this?

| Provider / plan         | Cost                                        | Commercial use                                                            | Notes (official docs)                                                                                                                                                                                                       |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vercel Hobby**        | Free, no card                               | **No.** "Hobby teams are restricted to non-commercial personal use only." | 100 GB fast data transfer, 1M function invocations, 4 active CPU hours, 100 deployments per day, 50 domains per project. Git integration with preview deployments per pull request. Limits reset after 30 days if exceeded. |
| Vercel Pro              | paid ($20 per seat per month plus usage)    | Yes                                                                       | Not authorised.                                                                                                                                                                                                             |
| Netlify Free            | "You'll never be charged for the Free plan" | The page read does not say                                                | 300 credits per month with a hard limit; unlimited deploy previews; one concurrent build.                                                                                                                                   |
| Cloudflare Workers Free | Free                                        | The page read does not say                                                | 100,000 requests per day, 10 ms CPU per invocation; Next.js needs the OpenNext adapter (not verified here).                                                                                                                 |

### Does Pathway AI qualify for Vercel Hobby?

Vercel defines commercial use as any deployment used "for the purpose of financial gain of anyone involved in any part of
the production of the project", for example: requesting or processing payment, advertising a product or service, being
paid to create or host the site, affiliate links as the main purpose, or ads. Donations are not commercial.

- **Today** (no payments, no ads, no affiliate links, a personal project): it qualifies.
- **If Pathway AI becomes a business**, or anyone is paid to build or host it, Hobby is **not allowed**. You would then need
  a paid plan or another provider whose terms permit it. **Only you can answer this**, so confirm it before deploying.

**Recommendation:** Vercel Hobby, because the app is a Next.js build with Cache Components and Vercel is the maintainer of
Next.js, so it works without an adapter. If the commercial question is "yes", use Netlify Free or pay for Vercel Pro after
checking Netlify's terms yourself. Do not upgrade anything without deciding it explicitly.

## 2. What you must do (cannot be done from this repository)

1. **Decide** that the project is non-commercial (see above), or choose another provider.
2. Create a free Vercel account (GitHub sign-in) and **Add New → Project → Import** `YunisSadig/pathway-ai-frontend`.
   Framework preset: Next.js (detected). Do not change build settings.
3. **Environment variables** (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_API_BASE_URL` = the public **https** origin of the backend, for **Production** and **Preview**.
   - It is public and baked into the browser bundle at build time. Never put a database password or any secret here.
4. Leave **Preview deployments** on (default): every pull request gets its own URL and a comment.
5. `vercel.json` in this repository disables Vercel's own automatic production deploy of `main`, so production only
   ships after CI passes (section 4). If you prefer Vercel's built-in deploy, delete that file.
6. **Backend** (not deployed yet): deploy it first (see `pathway-ai-backend/docs/deployment.md`; it needs a host and a
   managed PostgreSQL, which cost money). Until then the site works but shows "We couldn't load programs".
7. **CORS**: set the backend's `CORS_ALLOWED_ORIGINS` to the exact production frontend origin
   (for example `https://pathway-ai.vercel.app`, no trailing slash). The backend rejects wildcards by design.
   Preview deployment URLs are different for every pull request, so previews cannot call the backend unless each origin is
   listed. See "Requested backend change" below.

## 3. Production variables and secrets

| Where                           | Name                                 | Value                                                   | Secret?              |
| ------------------------------- | ------------------------------------ | ------------------------------------------------------- | -------------------- |
| Vercel (Production and Preview) | `NEXT_PUBLIC_API_BASE_URL`           | `https://<backend-origin>`                              | No (public)          |
| GitHub repo secret              | `VERCEL_TOKEN`                       | a Vercel access token                                   | **Yes**              |
| GitHub repo secret              | `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | from `.vercel/project.json` after `vercel link`         | No, but keep private |
| GitHub repo variable            | `VERCEL_DEPLOY_ENABLED`              | `true` to switch deployment on                          | No                   |
| GitHub repo variable            | `PUBLIC_SITE_URL`                    | the canonical production URL, used for the health check | No                   |
| GitHub repo variable            | `PUBLIC_API_BASE_URL`                | the same backend origin as above                        | No                   |

The backend password and any backend secret live only in the backend host, never here.

## 4. Automatic production deployment after checks

`.github/workflows/deploy.yml` runs when the **CI** workflow **succeeds on `main`**, and only if
`VERCEL_DEPLOY_ENABLED == 'true'`. It pulls the Production variables from Vercel, builds, deploys to production and then
runs `scripts/verify-deployment.mjs` against `PUBLIC_SITE_URL`. The CLI version is pinned (`vercel@65.14.0`); bump it
deliberately.

Until you set the variable and the three secrets, the workflow is skipped and nothing is deployed.

## 5. Health verification

```bash
npm run verify:deployment -- https://<site> https://<api>
```

Checks that the four pages answer 200, that the shipped JavaScript contains the API origin (so the build was wired to it),
that the API answers `/api/v1/programs`, and that CORS allows the site's origin. It exits non-zero on any failure and
prints the fix. It was tested here against local servers only (healthy, and with a wrong API URL).

To check that a running backend still matches the frontend's types:

```bash
NEXT_PUBLIC_API_BASE_URL=https://<api> npm run contract:check
```

## 6. Monitoring and troubleshooting

- **Build or deploy fails:** open the failing run in GitHub Actions (CI or Deploy) or the deployment in the Vercel dashboard
  and read the log. CI failures upload `playwright-report` as an artifact.
- **"The university/program service isn't configured":** `NEXT_PUBLIC_API_BASE_URL` was empty at build time. Set it in
  Vercel and redeploy (it is baked in at build time).
- **"The program service could not be reached":** open the browser's Network tab. A request that fails before any status is
  usually CORS (the backend does not list this site's origin) or a wrong URL. Run `verify:deployment`.
- **Mixed content blocked:** the API URL must be https when the site is https.
- **Backend asleep or down:** free backend hosts sleep; the first request can time out. The site shows an error with
  "Try again" and never substitutes sample data.
- **Usage limits:** Vercel's Usage page shows data transfer and function use against the Hobby limits.
- Optional, not installed: Vercel Web Analytics and Speed Insights (included in Hobby with small caps), or an external
  uptime monitor pointed at `/` and at the API's `/actuator/health`.

## 7. Requested backend change (not made here)

Preview deployment origins change for every pull request, but the backend only accepts explicit origins. Request a
backend task: accept a small allow-list of origin **patterns** (for example `https://pathway-ai-frontend-*-<team>.vercel.app`)
via configuration, still without wildcards for production, or run previews against a separate non-production backend.
A field-and-language facet endpoint (`GET /api/v1/fields`) would also let the filter lists be complete instead of derived
from the first 100 programs.

## 8. Findings

- The frontend builds with the API origin supplied as an environment variable; no code change is needed to deploy.
- No full-stack production integration exists: **the backend is not deployed**, so a deployed frontend cannot show data yet.
- Hosting cost today: **$0**, provided Vercel Hobby's non-commercial condition is true. Nothing paid was created.
