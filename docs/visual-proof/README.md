# Visual Proof Gate Reports

Generated reports are written here when `npm run vp:gate` or `npm run vp:middle` runs.

Required outputs:

- `taste-handoff.lock.md`
- `design-intent.lock.md`
- `evidence.md`
- `taste-compliance-report.md`
- `aesthetic-diagnosis.md`
- `visual-scorecard.json`
- `enhancement-plan.md`
- `enhancement-plan.json`
- `patch-plan.md`
- `patch-plan.json`
- `patch-log.md`
- `before-after-gallery.md`
- `visual-delta-report.md`
- `visual-delta.json`
- `responsive-matrix.md`
- `token-ledger.json`
- `asset-ledger.md`
- `state-matrix.md`
- `content-stress-report.md`
- `defect-backlog.md`
- `impeccable-handoff.md`
- `impeccable-routing.md`

The `screenshots/` directory stores viewport, theme, and state evidence. The `screenshots/after/` directory stores sampled after-state screenshots for Visual Delta reports.

Visual Proof defaults to diagnose-only. Safe Patch Mode produces a patch plan and log on every gate run, but it only modifies source files when explicitly configured with `mode: safe-patch`, `allowAutoPatch: true`, and `sourceRoot`. Visual Delta v1 is evidence-oriented and does not enforce pixel-level thresholds.
