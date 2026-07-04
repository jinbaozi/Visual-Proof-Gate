# Safe Patch Mode v1 Plan

## Goal

Add an explicitly authorized, low-risk safe patch mode after enhancement planning and before Impeccable handoff.

## Scope

Safe Patch Mode v1 supports configured, exact text operations only. It does not infer arbitrary source edits from screenshots or enhancement candidates.

## Safety requirements

1. Default mode remains `diagnose-only`.
2. Patch execution requires `mode: safe-patch`.
3. Patch execution requires `allowAutoPatch: true`.
4. Patch execution requires `sourceRoot`.
5. Patch paths must resolve inside `sourceRoot`.
6. Patch files must match an extension allowlist.
7. Replace operations require exactly one match.
8. Optional `requiresMarker` can gate edits on explicit source markers.
9. Dry-run defaults to true.
10. Patch plan and patch log are always written.

## Tasks

1. Add safe patch contracts.
2. Add safe patch config to `VisualProofConfig`.
3. Implement patch plan builder with boundary validation.
4. Implement dry-run/apply engine.
5. Add patch plan/log reports.
6. Insert `safe-patch` stage into `VISUAL_PROOF_STAGES`.
7. Add npm script aliases.
8. Add unit and architecture tests.
9. Update docs.
