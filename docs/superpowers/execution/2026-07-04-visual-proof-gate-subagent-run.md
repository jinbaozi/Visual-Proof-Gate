# Visual Proof Gate Subagent Run

## Subagent slices

1. Contract/config/types: `visual-proof.config.ts`, `playwright.visual-proof.config.ts`, `src/visual-proof.ts`.
2. Evidence/layout probes: screenshot capture, overflow checks, clipping checks, responsive observations.
3. Stress/assets/tokens/states: content stress, asset ledger, token ledger, state matrix.
4. Quality gates: axe, Lighthouse CI, Playwright browser timeouts.
5. Handoff: defect backlog and Impeccable routing reports.

## Local validation

- `npm run typecheck` passed in the implementation environment.
- Browser tests require Playwright Chromium installation and are wired into CI.
