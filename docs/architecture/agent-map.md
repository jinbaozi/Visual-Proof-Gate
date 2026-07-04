# Agent Map

Use this map to avoid opening the whole repository for every task.

## Start here

1. `README.md`
2. `visual-proof.config.ts`
3. `docs/architecture/000-agent-progressive-disclosure.md`

## Change input contracts or config

Read:

- `src/contracts/`
- `src/config/`
- `visual-proof.config.ts`

Avoid:

- `src/probes/`
- `src/reports/`
- `src/orchestrator/`

## Change Taste handoff or Taste compliance

Read:

- `src/contracts/taste-handoff.ts`
- `src/taste/`
- `src/reports/taste-compliance-report.ts`

Avoid browser probes unless the compliance finding needs new evidence.

## Change one probe

Read:

- `src/contracts/`
- `src/browser/`
- the specific `src/probes/<probe>/` directory

Avoid unrelated probes unless the failing test points there.

## Change visual diagnosis or enhancement planning

Read:

- `src/contracts/enhancement.ts`
- `src/diagnosis/`
- `src/enhancers/`
- `src/reports/enhancement-plan-report.ts`

Do not edit source patching logic for diagnosis-only changes.

## Change safe patch mode

Read:

- `src/contracts/safe-patch.ts`
- `src/patches/`
- `src/reports/safe-patch-report.ts`
- `visual-proof.config.ts`

Safe patch changes must preserve explicit opt-in, sourceRoot boundary checks, extension allowlists, exact replacement matching, and dry-run defaults.

## Change report output

Read:

- `src/contracts/`
- `src/io/markdown-table.ts`
- the specific `src/reports/*-report.ts`

Do not edit Playwright probes for report-only changes.

## Change Impeccable routing or handoff

Read:

- `src/contracts/defect.ts`
- `src/routing/impeccable-command-router.ts`
- `src/handoff/impeccable-handoff.ts`

## Change execution order

Read:

- `src/contracts/stage.ts`
- `src/orchestrator/visual-proof-stages.ts`
- `src/orchestrator/run-stages.ts`

## Check architecture

Run:

```bash
npm run arch:test
```
