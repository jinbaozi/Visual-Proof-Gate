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

## Change one probe

Read:

- `src/contracts/`
- `src/browser/`
- the specific `src/probes/<probe>/` directory

Avoid unrelated probes unless the failing test points there.

## Change report output

Read:

- `src/contracts/`
- `src/io/markdown-table.ts`
- the specific `src/reports/*-report.ts`

Do not edit Playwright probes for report-only changes.

## Change Impeccable routing

Read:

- `src/contracts/defect.ts`
- `src/routing/impeccable-command-router.ts`

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
