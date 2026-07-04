# Visual Proof Gate Implementation Plan

## Goal

Implement a Visual Proof Gate between Taste Skill and Impeccable Skill.

## Tasks

1. Define config, type system, viewport matrix, and Playwright timeout policy.
2. Generate design intent lock from Taste Skill output.
3. Capture screenshot evidence across desktop, tablet, and mobile viewports.
4. Detect horizontal overflow, clipping, off-viewport elements, and blocked interactions.
5. Generate responsive matrix, asset ledger, token ledger, state matrix, content stress report, defect backlog, and Impeccable routing.
6. Add accessibility checks with axe and performance checks with Lighthouse CI.
7. Add CI checks that run typecheck and fixture tests on pull requests and pushes to `main`.

## Done

- CI workflow exists.
- Manual full Visual Proof Gate workflow exists.
- `npm run typecheck` passes locally.
