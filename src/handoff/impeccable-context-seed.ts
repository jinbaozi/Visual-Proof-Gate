import type { EnhancementPlan, ImpeccableContextSeed, SafePatchLog, TasteHandoff, VisualDefect, VisualDeltaReport, VisualScorecard } from "../contracts";

export function buildImpeccableContextSeed(input: {
  handoff: TasteHandoff;
  scorecard: VisualScorecard;
  enhancementPlan: EnhancementPlan;
  defects: VisualDefect[];
  safePatchLog?: SafePatchLog;
  visualDelta?: VisualDeltaReport;
}): ImpeccableContextSeed {
  const unresolvedRisks = input.defects
    .filter((defect) => defect.severity === "P0" || defect.severity === "P1")
    .map((defect) => `${defect.id}: ${defect.title}`);

  return {
    projectRole: "Visual Proof is the middle layer that prepares evidence, enhancement guidance, and handoff context for Impeccable.",
    tasteIntent: `${input.handoff.pageKind} for ${input.handoff.audience}; ${input.handoff.designRead}`,
    visualProofSummary: `Visual score ${input.scorecard.overall}/100; ${input.defects.length} defects; ${unresolvedRisks.length} unresolved P0/P1 risks.`,
    enhancementSummary: input.enhancementPlan.summary,
    evidenceFiles: [
      "docs/visual-proof/taste-handoff.lock.md",
      "docs/visual-proof/evidence.md",
      "docs/visual-proof/aesthetic-diagnosis.md",
      "docs/visual-proof/enhancement-plan.md",
      "docs/visual-proof/patch-log.md",
      "docs/visual-proof/visual-delta-report.md",
      "docs/visual-proof/defect-backlog.md"
    ],
    unresolvedRisks,
    operatingNotes: [
      input.safePatchLog?.applied ? "Safe Patch Mode applied changes before handoff." : "Safe Patch Mode did not apply source changes in this run.",
      input.visualDelta?.pairs.length ? "Before/after visual evidence is available for review." : "Visual delta evidence is baseline-only or unavailable.",
      "Impeccable should systemize, audit, harden, and polish after reviewing Visual Proof outputs."
    ]
  };
}

export function renderImpeccableContextSeed(seed: ImpeccableContextSeed): string {
  return [
    "# Impeccable Context Seed",
    "",
    "## Project role",
    seed.projectRole,
    "",
    "## Taste intent",
    seed.tasteIntent,
    "",
    "## Visual Proof summary",
    seed.visualProofSummary,
    "",
    "## Enhancement summary",
    seed.enhancementSummary,
    "",
    "## Evidence files",
    ...seed.evidenceFiles.map((file) => `- ${file}`),
    "",
    "## Unresolved risks",
    ...(seed.unresolvedRisks.length ? seed.unresolvedRisks.map((risk) => `- ${risk}`) : ["- None detected."]),
    "",
    "## Operating notes",
    ...seed.operatingNotes.map((note) => `- ${note}`)
  ].join("\n");
}
