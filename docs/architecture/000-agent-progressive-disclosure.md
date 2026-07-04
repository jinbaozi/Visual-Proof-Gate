# Agent Progressive Disclosure Architecture

Visual Proof Gate is structured so an agent can read only the layer needed for the current task.

## Disclosure layers

1. **Entry**: `README.md`, `visual-proof.config.ts`, and `docs/architecture/agent-map.md` explain what the system is and how to run it.
2. **Contracts**: `src/contracts/` defines stable data shapes and stage contracts. It has no filesystem, browser, or probe dependencies.
3. **Configuration and intent**: `src/config/` loads and validates project inputs; `src/intent/` freezes Taste Skill output.
4. **Runtime adapters**: `src/io/` handles filesystem output; `src/browser/` wraps Playwright navigation, media, and screenshots.
5. **Capabilities**: `src/probes/` contains isolated DOM/browser probes. A probe collects observations and defects; it does not render reports.
6. **Reports and routing**: `src/reports/` renders Markdown/JSON content; `src/routing/` maps defects to Impeccable commands.
7. **Orchestration**: `src/orchestrator/` composes explicit stages. It does not contain DOM probe internals.
8. **Architecture guardrails**: `tests/architecture/` enforces dependency boundaries in CI.

## Dependency direction

```text
contracts
  ↓
config + intent
  ↓
io + browser
  ↓
probes
  ↓
reports + routing
  ↓
orchestrator
```

The practical rule is simple: lower layers can be read without opening higher layers. Higher layers compose lower layers but do not hide probe or report logic inside the orchestrator.
