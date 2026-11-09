# Pathway AI: agent notes

@AGENTS.md

- Frontend only. No backend, auth, payments or paid APIs yet.
- This repo is independent. The parent `C:\Users\Lenova` contains an unrelated DevHub repo: always confirm `git rev-parse --show-toplevel` ends in `Desktop/pathway-ai` before staging.
- Product name is exactly "Pathway AI".
- Theme: Light and Dark only in the UI; first visit follows the device preference (next-themes `defaultTheme="system"`).
- Never fabricate institutional data, deadlines, fees or admission probabilities; unknown stays unknown.
- Checks: `npm run check`, `npm run build`, `npm run test:e2e`.
