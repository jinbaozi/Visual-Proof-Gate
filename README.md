# Visual Proof Gate

Visual Proof Gate is an automation layer designed to run after **Taste Skill** and before **Impeccable Skill**. It converts a visual direction into screenshot evidence, responsive checks, content stress results, token and asset ledgers, a defect backlog, and an ordered Impeccable command route.

## Agent progressive disclosure

The implementation is organized so agents can start with project intent and then progressively open only the layer they need:

```text
contracts → config/intent/io/browser → probes → reports/routing → orchestrator → CI guardrails
```

Start with:

- `docs/architecture/agent-map.md`
- `docs/architecture/000-agent-progressive-disclosure.md`
- `visual-proof.config.ts`

## What it generates

- `docs/visual-proof/design-intent.lock.md`
- `docs/visual-proof/evidence.md`
- `docs/visual-proof/responsive-matrix.md`
- `docs/visual-proof/token-ledger.json`
- `docs/visual-proof/asset-ledger.md`
- `docs/visual-proof/state-matrix.md`
- `docs/visual-proof/content-stress-report.md`
- `docs/visual-proof/defect-backlog.md`
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

## Run against an app

Edit `visual-proof.config.ts`, then run:

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
- `/impeccable polish` is only recommended after targeted commands and `/impeccable audit`.
