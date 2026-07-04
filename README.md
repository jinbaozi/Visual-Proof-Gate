# Visual Proof Gate

Visual Proof Gate is the middle-layer automation designed to run after **Taste Skill** and before **Impeccable Skill**. Taste creates the first visual pass, Visual Proof turns that pass into evidence, enhancement planning, optional safe patching, and handoff, and Impeccable performs final design systemization, audit, correction, polish, and shipping checks.

## Pipeline role

```text
Taste Skill
  ↓ first visual generation + design intent
Visual Proof Gate
  ↓ evidence + diagnosis + enhancement plan + optional safe patch + handoff
Impeccable Skill
  ↓ design systemization + audit + hardening + polish
Production-ready UI
```

Visual Proof defaults to diagnose-only. Safe patch mode is off unless explicitly configured with `mode: "safe-patch"`, `allowAutoPatch: true`, and a `sourceRoot`.

## Agent progressive disclosure

The implementation is organized so agents can start with project intent and then progressively open only the layer they need:

```text
contracts → config/intent/taste/io/browser → probes → diagnosis/enhancers/patches → reports/routing/handoff → orchestrator → CI guardrails
```

Start with:

- `docs/architecture/agent-map.md`
- `docs/architecture/000-agent-progressive-disclosure.md`
- `visual-proof.config.ts`

## What it generates

- `docs/visual-proof/taste-handoff.lock.md`
- `docs/visual-proof/design-intent.lock.md`
- `docs/visual-proof/evidence.md`
- `docs/visual-proof/taste-compliance-report.md`
- `docs/visual-proof/aesthetic-diagnosis.md`
- `docs/visual-proof/visual-scorecard.json`
- `docs/visual-proof/enhancement-plan.md`
- `docs/visual-proof/enhancement-plan.json`
- `docs/visual-proof/patch-plan.md`
- `docs/visual-proof/patch-plan.json`
- `docs/visual-proof/patch-log.md`
- `docs/visual-proof/responsive-matrix.md`
- `docs/visual-proof/token-ledger.json`
- `docs/visual-proof/asset-ledger.md`
- `docs/visual-proof/state-matrix.md`
- `docs/visual-proof/content-stress-report.md`
- `docs/visual-proof/defect-backlog.md`
- `docs/visual-proof/impeccable-handoff.md`
- `docs/visual-proof/impeccable-routing.md`

## Install

```bash
npm install
npx playwright install --with-deps chromium
```

## Run local checks

```bash
npm run typecheck
npm run arch:test
npm run vp:unit
```

## Run the middle-layer flow

After Taste Skill creates the first visual pass, edit `visual-proof.config.ts`, then run:

```bash
VISUAL_PROOF_BASE_URL=http://localhost:3000 npm run vp:middle
```

Equivalent focused aliases:

```bash
VISUAL_PROOF_BASE_URL=http://localhost:3000 npm run vp:diagnose
VISUAL_PROOF_BASE_URL=http://localhost:3000 npm run vp:enhance:plan
VISUAL_PROOF_BASE_URL=http://localhost:3000 npm run vp:patch:plan
VISUAL_PROOF_BASE_URL=http://localhost:3000 npm run vp:handoff
```

## Safe patch mode

Safe patch mode is explicit and conservative:

- default mode is `diagnose-only`
- source patching requires `allowAutoPatch: true`
- source patching requires `sourceRoot`
- file paths are resolved inside `sourceRoot`
- only configured file extensions are allowed
- `replace` requires exactly one match
- optional `requiresMarker` can force marker-gated edits
- `dryRun` defaults to true

A real patch run must opt in:

```bash
VISUAL_PROOF_BASE_URL=http://localhost:3000 \
VISUAL_PROOF_SOURCE_ROOT=./src \
VISUAL_PROOF_ALLOW_PATCH=true \
VISUAL_PROOF_PATCH_DRY_RUN=false \
npm run vp:patch:apply
```

## Run full checks against an app

```bash
VISUAL_PROOF_BASE_URL=http://localhost:3000 npm run vp:gate
VISUAL_PROOF_BASE_URL=http://localhost:3000 npm run vp:a11y
VISUAL_PROOF_BASE_URL=http://localhost:3000 npm run vp:responsive
LHCI_BASE_URL=http://localhost:3000 npm run vp:lhci
```

Run the full gate:

```bash
VISUAL_PROOF_BASE_URL=http://localhost:3000 LHCI_BASE_URL=http://localhost:3000 npm run vp:all
```

## CI

This repository includes two workflows:

- `.github/workflows/ci.yml`: runs on pull requests and pushes to `main`; installs dependencies, installs Chromium, typechecks, runs architecture tests, and runs fixture/unit tests.
- `.github/workflows/visual-proof.yml`: manual workflow for running the full Visual Proof Gate against a deployed or local-to-CI URL supplied as `base_url`.

## Gate semantics

- `P0` blocks progress.
- `P1` must be routed before final polish.
- `P2` can be resolved during polish.
- Visual Proof enhancement planning is diagnose-only unless safe patch mode is explicitly enabled.
- `/impeccable polish` is only recommended after targeted commands and `/impeccable audit`.
