import type { EnhancementPlan, ImpeccableHandoff, ImpeccableRoutePlan, TasteHandoff, VisualDefect, VisualScorecard } from "../contracts";

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

  return {
    projectRole: "Visual Proof completed Taste intent locking, deterministic visual diagnosis, enhancement planning, and Impeccable handoff preparation.",
    tasteIntentSummary: `${input.handoff.pageKind} for ${input.handoff.audience}; ${input.handoff.designRead}`,
    visualProofSummary: `Visual score ${input.scorecard.overall}/100 with ${input.defects.length} total defects and ${unresolvedRisks.length} unresolved P0/P1 risks.`,
    enhancementSummary: input.enhancementPlan.summary,
    unresolvedRisks,
    recommendedCommands: [
      "/impeccable init",
      "/impeccable document",
      ...input.routePlan.commands
    ]
  };
}

export function renderImpeccableHandoffReport(handoff: ImpeccableHandoff): string {
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
    "## Unresolved risks",
    ...(handoff.unresolvedRisks.length ? handoff.unresolvedRisks.map((risk) => `- ${risk}`) : ["- None detected."]),
    "",
    "## Recommended Impeccable command sequence",
    ...handoff.recommendedCommands.map((command, index) => `${index + 1}. \`${command}\``)
  ].join("\n");
}
