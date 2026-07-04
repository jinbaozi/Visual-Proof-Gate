# Taste Enhancement Handoff v1 Plan

## Goal

Optimize Visual Proof Gate for the intended pipeline:

```text
Taste Skill → Visual Proof diagnosis/enhancement planning → Impeccable Skill
```

## Scope

This v1 is diagnose-only. It does not automatically patch source code.

## Tasks

1. Add Taste handoff and compliance contracts.
2. Add visual scorecard and aesthetic diagnosis.
3. Add enhancement plan generation.
4. Add Impeccable handoff pack.
5. Extend `VISUAL_PROOF_STAGES` with Taste, diagnosis, enhancement, and handoff stages.
6. Generate new reports under `docs/visual-proof/`.
7. Add npm aliases for the middle-layer flow.
8. Update architecture docs and architecture guard tests.

## Exit criteria

- `npm run typecheck` passes.
- `npm run arch:test` passes.
- `npm run vp:unit` passes.
- Full gate writes Taste handoff, compliance, diagnosis, enhancement, and Impeccable handoff reports.
