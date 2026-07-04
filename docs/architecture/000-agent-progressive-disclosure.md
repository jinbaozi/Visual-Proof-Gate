# Agent Progressive Disclosure Architecture

Visual Proof Gate is structured so an agent can read only the layer needed for the current task. It is also positioned as the middle layer between Taste Skill and Impeccable Skill.

## Pipeline

```text
Taste Skill
  ↓ first visual pass + design intent
Visual Proof Gate
  ↓ evidence + diagnosis + enhancement plan + optional safe patch + Impeccable handoff
Impeccable Skill
  ↓ design systemization + audit + correction + polish + shipping checks
```

## Disclosure layers

1. **Entry**: `README.md`, `visual-proof.config.ts`, and `docs/architecture/agent-map.md` explain what the system is and how to run it.
2. **Contracts**: `src/contracts/` defines stable data shapes and stage contracts. It has no filesystem, browser, or probe dependencies.
3. **Configuration, Taste, and intent**: `src/config/` loads and validates project inputs; `src/taste/` builds the Taste handoff; `src/intent/` freezes design intent.
4. **Runtime adapters**: `src/io/` handles filesystem output; `src/browser/` wraps Playwright navigation, media, and screenshots.
5. **Capabilities**: `src/probes/` contains isolated DOM/browser probes. A probe collects observations and defects; it does not render reports.
6. **Diagnosis and enhancement**: `src/diagnosis/` turns proof outputs into a visual scorecard; `src/enhancers/` generates diagnose-only enhancement candidates.
7. **Safe patches**: `src/patches/` builds and optionally applies explicitly configured low-risk source edits. It is disabled by default.
8. **Reports, routing, and handoff**: `src/reports/` renders Markdown/JSON content; `src/routing/` maps defects to Impeccable commands; `src/handoff/` prepares Impeccable handoff context.
9. **Orchestration**: `src/orchestrator/` composes explicit stages. It does not contain DOM probe internals.
10. **Architecture guardrails**: `tests/architecture/` enforces dependency boundaries in CI.

## Dependency direction

```text
contracts
  ↓
config + taste + intent
  ↓
io + browser
  ↓
probes
  ↓
diagnosis + enhancers
  ↓
patches
  ↓
reports + routing + handoff
  ↓
orchestrator
```

The practical rule is simple: lower layers can be read without opening higher layers. Higher layers compose lower layers but do not hide probe, diagnosis, enhancement, patch, report, or handoff logic inside the orchestrator.
