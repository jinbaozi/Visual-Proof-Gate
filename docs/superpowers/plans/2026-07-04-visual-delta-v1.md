# Visual Delta v1 Plan

## Goal

Add before/after visual delta evidence after Safe Patch Mode and before Impeccable handoff.

## Scope

Visual Delta v1 is evidence-oriented. It links baseline screenshots with sampled after screenshots and produces reports. It does not enforce pixel-level pass/fail thresholds.

## Tasks

1. Add visual delta contracts.
2. Add visual delta builder utilities.
3. Add before/after gallery and visual delta reports.
4. Insert `visual-delta` stage after `safe-patch` and before routing/handoff.
5. Write `before-after-gallery.md`, `visual-delta-report.md`, and `visual-delta.json`.
6. Add unit tests for pair generation and report rendering.
7. Update docs and full gate output expectations.

## Exit criteria

- `npm run typecheck` passes.
- `npm run arch:test` passes.
- `npm run vp:unit` passes.
- Full gate writes visual delta outputs.
