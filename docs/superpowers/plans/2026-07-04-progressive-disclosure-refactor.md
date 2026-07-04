# Progressive Disclosure Refactor Plan

## Goal

Convert Visual Proof Gate from a progressive workflow with a monolithic core into an agent progressive disclosure architecture.

## Implementation layers

1. Extract contract-only domain types into `src/contracts/`.
2. Split config loading and validation into `src/config/`.
3. Move Taste intent rendering into `src/intent/`.
4. Move filesystem and Markdown helpers into `src/io/`.
5. Move Playwright adapters into `src/browser/`.
6. Move DOM/browser probes into isolated `src/probes/<probe>/` directories.
7. Move Markdown renderers into `src/reports/`.
8. Move Impeccable command mapping into `src/routing/`.
9. Replace the monolithic gate with `VISUAL_PROOF_STAGES` in `src/orchestrator/`.
10. Add `tests/architecture/` and run them in CI.

## Exit criteria

- `src/visual-proof.ts` is only a compatibility re-export.
- Each probe has a local `.types.ts` and `*-probe.ts` implementation.
- Orchestrator contains no DOM probe details.
- Reports do not import Playwright.
- Contracts do not import filesystem or browser APIs.
- CI runs `npm run arch:test` before unit tests.
