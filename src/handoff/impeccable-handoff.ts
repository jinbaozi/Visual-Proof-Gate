import type { EnhancementPlan, ImpeccableHandoff, ImpeccableRoutePlan, TasteHandoff, VisualDefect, VisualScorecard } from "../contracts";

const EVIDENCE_FILES = [
  "docs/visual-proof/taste-handoff.lock.md",
  "docs/visual-proof/evidence.md",
  "docs/visual-proof/taste-compliance-report.md",
  "docs/visual-proof/aesthetic-diagnosis.md",
  "docs/visual-proof/visual-scorecard.json",
  "docs/visual-proof/enhancement-plan.md",
  "docs/visual-proof/patch-log.md",
  "docs/visual-proof/visual-delta-report.md",
  "docs/visual-proof/defect-backlog.md",
  "docs/visual-proof/impeccable-routing.md"
];

export function buildImpeccableHandoff(input: {
  handoff: TasteHandoff;
  scorecard: VisualScorecard;
  enhancementPlan: EnhancementPlan;
  routePlan: ImpeccableRoutePlan;
  defects: VisualDefect[];
}): ImpeccableHandoff {
  const unresolvedRisks = input.defects
    .filter((defect) => defect.severity === "P0" || defect.severity === "P1")
    .map((defect) => `${defect.id}: ${defect.title}`);

  const enhancementCommands = input.enhancementPlan.candidates
    .map((candidate) => candidate.impeccableFallback)
    .filter((command, index, commands) => commands.indexOf(command) === index);

  return {
    projectRole: "Visual Proof completed Taste intent locking, deterministic visual diagnosis, enhancement planning, safe patch evidence, visual delta evidence, and Impeccable handoff preparation.",
    tasteIntentSummary: `${input.handoff.pageKind} for ${input.handoff.audience}; ${input.handoff.designRead}`,
    visualProofSummary: `Visual score ${input.scorecard.overall}/100 with ${input.defects.length} total defects and ${unresolvedRisks.length} unresolved P0/P1 risks.`,
    enhancementSummary: input.enhancementPlan.summary,
    unresolvedRisks,
    recommendedCommands: [
      "/impeccable init",
      "/impeccable document",
      ...enhancementCommands,
      ...input.routePlan.commands
    ].filter((command, index, commands) => commands.indexOf(command) === index)
  };
}

export function renderImpeccableHandoffReport(handoff: ImpeccableHandoff): string {
  const blockingCommands = handoff.recommendedCommands.filter((command) => !command.includes("polish"));
  const finalCommands = handoff.recommendedCommands.filter((command) => command.includes("polish"));

  return [
    "# Impeccable Handoff",
    "",
    "## Project role",
    handoff.projectRole,
    "",
    "## Taste intent",
    handoff.tasteIntentSummary,
    "",
    "## Visual Proof summary",
    handoff.visualProofSummary,
    "",
    "## Enhancement summary",
    handoff.enhancementSummary,
    "",
    "## Context seed",
    "Use this section as the first context for Impeccable before running targeted commands.",
    "",
    "### Evidence files",
    ...EVIDENCE_FILES.map((file) => `- ${file}`),
    "",
    "### Operating notes",
    "- Visual Proof is the middle-layer evidence and enhancement planner.",
    "- Safe Patch and Visual Delta reports must be reviewed before final polish.",
    "- Impeccable should systemize, audit, harden, and polish after reviewing these outputs.",
    "",
    "## Unresolved risks",
    ...(handoff.unresolvedRisks.length ? handoff.unresolvedRisks.map((risk) => `- ${risk}`) : ["- None detected."]),
    "",
    "## Recommended Impeccable command sequence",
    "",
    "### Setup and context",
    ...handoff.recommendedCommands
      .filter((command) => command.includes("init") || command.includes("document"))
      .map((command, index) => `${index + 1}. \`${command}\``),
    "",
    "### Targeted fixes and hardening",
    ...blockingCommands
      .filter((command) => !command.includes("init") && !command.includes("document") && !command.includes("audit"))
      .map((command, index) => `${index + 1}. \`${command}\``),
    "",
    "### Audit",
    ...handoff.recommendedCommands
      .filter((command) => command.includes("audit"))
      .map((command, index) => `${index + 1}. \`${command}\``),
    "",
    "### Final polish",
    ...(finalCommands.length ? finalCommands.map((command, index) => `${index + 1}. \`${command}\``) : ["- Wait until blocking risks are resolved."])
  ].join("\n");
}
