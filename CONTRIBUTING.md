# Contributing

Start from current stable `main`. Use branches such as `feat/onboarding`, `fix/mobile-nav`, or `ci/frontend-pipeline`. Keep changes focused and use Conventional Commits: `feat(onboarding): persist assessment progress`.

Run `npm run check` and the applicable Playwright tests before committing, verify the committed state, and run the full browser suite before pushing. Add meaningful tests for calculations and interactions. Review responsive layouts at 375×812, 768×1024, and 1440×900, both themes, keyboard use, and reduced motion.

Open a pull request to main describing behavior, checks actually run, screenshots for visual work, and limitations. Require passing Frontend checks. Significant merges need owner approval. Never force-push shared branches or commit secrets. Do not auto-approve screenshot changes; inspect them.

Use accessible semantic controls, editable CSS tokens, typed boundaries, and fictional labeled data. Keep dependencies and folder structure small. Record consequential decisions in README.md. No public deployment or live backend during this milestone.
