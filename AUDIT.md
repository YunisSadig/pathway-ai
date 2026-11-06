# Frontend polish and accessibility audit

Scope: existing nine-route frontend; fictional data, browser-local state, and scripted advisor behavior preserved. Issue #4 remains open pending the manual checks below and owner PR approval.

## Changes and findings

| Area                | Finding and resolution                                                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Appearance          | Replaced the native selector with an icon trigger and accessible Radix radio menu; keyboard selection, persistence, OS changes, collision handling, outside dismissal, and focus return are exercised.              |
| Theme transitions   | Retained atomic next-themes palette changes to avoid intermediate low contrast. Menu/icon keyframes provide controlled feedback; reduced motion is respected.                                                       |
| Navigation          | Added sticky navigation, active routes, an animated mobile disclosure, inert closed content, Escape/outside dismissal, and focus restoration.                                                                       |
| Buttons and cards   | Unified focus/press/disabled/busy/destructive states; larger controls; selected comparison cards; elevation is tied to actionable controls rather than suggesting the entire card is clickable.                     |
| Forms               | Improved labels, hints, selected answer cards, validation styling, step movement, progress, and a styled native confirmation dialog. Draft persistence is preserved.                                                |
| WebKit focus        | Native click focus differs between engines. Dialog openers now explicitly record/focus their trigger and restore it on close, including Escape.                                                                     |
| Early input         | WebKit exposed edits arriving before React handlers attached. Shared form/action controls and standalone inputs wait for client readiness; tests wait for actual enabled/focused state instead of animation delays. |
| Comparisons         | Added a visible dock, three-program limit, scroll/focus into comparison, and readable row/column headers.                                                                                                           |
| Lab/planner/finance | Clearer hypothetical before/after indices, distinct primary/backup routes, readable sliders and costs. No admission probabilities or real financial promises.                                                       |
| Life Abroad/advisor | Warmer reflection surfaces, readable content, preserved scripted labels, chat focus and scroll handling. No AI connection.                                                                                          |
| Visual testing      | Reviewed sixteen key viewport references. Thirteen are shared; three mobile cases have reviewed Windows/Linux references for font/emoji rendering. Tolerances were not loosened.                                    |
| Test isolation      | Production E2E uses port 3100 and cannot reuse an unrelated dev server.                                                                                                                                             |

## Automated verification

`npm.cmd run check` passed formatting, ESLint, TypeScript, 14 unit/component tests, and production build. `npm.cmd run test:e2e` passed 90 tests with zero skipped or unexpected results in the completed local matrix. Chromium runs the full suite and screenshots; Firefox and WebKit run targeted desktop/mobile journeys and accessibility checks. These are browser engines on Windows, with the same matrix configured for CI Linux, not real Safari or physical mobile devices.

| Project                 | Passed tests | Default viewport                            |
| ----------------------- | ------------ | ------------------------------------------- |
| Chromium                | 46           | 1440×900, plus explicit mobile/tablet cases |
| Firefox desktop         | 11           | 1440×900                                    |
| Firefox mobile viewport | 11           | 375×812                                     |
| WebKit desktop          | 11           | 1440×900                                    |
| WebKit mobile viewport  | 11           | 375×812                                     |

Coverage includes assessment validation and persistence, corrupt/blocked storage, menus, native dialogs, focus return, program comparisons, goal persistence, budget and backup scenarios, scripted responses, light/dark surfaces, reduced motion, and overflow. Chromium checks mobile/tablet/desktop; all engines check representative desktop/mobile layouts. Automated 640px reflow is not a manual 200% browser-zoom audit. Forced-colors emulation is covered in Chromium only.

## Manual acceptance work still required

Native Chrome control was attempted but the Computer Use runtime stopped because it could not confidently determine the current Windows browser URL. No native Chrome, auditory screen-reader, manual 200% zoom, or OS high-contrast pass is claimed. Automated axe/keyboard checks do not establish full WCAG conformance.

- With NVDA or another screen reader, verify assessment errors/descriptions/progress, appearance radio selection, comparison header relationships, and clearly labeled scripted chat updates.
- In Chrome or Edge, verify Tab/Shift+Tab order, Escape and return focus, mobile disclosure behavior, and menu placement at 200% zoom.
- With OS high contrast and a physical touch device, review icons, selected/disabled states, focus indicators, and touch comfort.
- Record actual outcomes before closing #4. Significant PRs require owner approval; no PR or issue was merged/closed during this sprint.

## Local review

```powershell
npm.cmd ci
npx.cmd playwright install chromium firefox webkit
npm.cmd run check
npm.cmd run test:e2e
npm.cmd run dev
```

Open the URL printed by Next.js. Review Appearance from the navigation icon, then assessment, explorer comparison, Lab, planner, Life Abroad, finances, and advisor. HTML reports are in `playwright-report`; traces/screenshots/JSON results are in `test-results`.
