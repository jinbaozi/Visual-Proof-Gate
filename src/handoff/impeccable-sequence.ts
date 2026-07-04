import type { EnhancementPlan, ImpeccableCommandItem, ImpeccableCommandSequence, ImpeccableRoutePlan, VisualDefect, VisualDeltaReport } from "../contracts";

function dedupe(commands: ImpeccableCommandItem[]): ImpeccableCommandItem[] {
  const seen = new Set<string>();
  const result: ImpeccableCommandItem[] = [];
  for (const item of commands) {
    const key = `${item.phase}:${item.command}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ ...item, id: `IMP-${String(result.length + 1).padStart(3, "0")}` });
  }
  return result;
}

export function buildImpeccableCommandSequence(input: {
  routePlan: ImpeccableRoutePlan;
  enhancementPlan: EnhancementPlan;
  defects: VisualDefect[];
  visualDelta?: VisualDeltaReport;
}): ImpeccableCommandSequence {
  const blockers = input.defects
    .filter((defect) => defect.severity === "P0")
    .map((defect) => `${defect.id}: ${defect.title}`);

  const commands: ImpeccableCommandItem[] = [
    {
      id: "IMP-000",
      phase: "setup",
      command: "/impeccable init",
      reason: "Initialize Impeccable project context using the Visual Proof handoff pack.",
      evidence: ["docs/visual-proof/impeccable-context.seed.md"],
      requiredBeforePolish: true
    },
    {
      id: "IMP-000",
      phase: "context",
      command: "/impeccable document",
      reason: "Document the discovered design context before targeted fixes.",
      evidence: ["docs/visual-proof/taste-handoff.lock.md", "docs/visual-proof/visual-scorecard.json"],
      requiredBeforePolish: true
    }
  ];

  for (const candidate of input.enhancementPlan.candidates) {
    commands.push({
      id: "IMP-000",
      phase: candidate.severity === "polish" ? "polish" : "targeted-fix",
      command: candidate.impeccableFallback,
      reason: candidate.rationale,
      evidence: ["docs/visual-proof/enhancement-plan.md", "docs/visual-proof/aesthetic-diagnosis.md"],
      requiredBeforePolish: candidate.severity !== "polish"
    });
  }

  for (const command of input.routePlan.commands) {
    const phase = command.includes("audit") ? "audit" : command.includes("polish") ? "polish" : command.includes("harden") ? "hardening" : "targeted-fix";
    commands.push({
      id: "IMP-000",
      phase,
      command,
      reason: "Generated from Visual Proof defect routing.",
      evidence: ["docs/visual-proof/defect-backlog.md", "docs/visual-proof/impeccable-routing.md"],
      requiredBeforePolish: phase !== "polish"
    });
  }

  if (input.visualDelta?.pairs.length) {
    commands.push({
      id: "IMP-000",
      phase: "audit",
      command: "/impeccable audit",
      reason: "Review before and after visual evidence.",
      evidence: ["docs/visual-proof/before-after-gallery.md", "docs/visual-proof/visual-delta-report.md"],
      requiredBeforePolish: true
    });
  }

  return { status: blockers.length ? "blocked" : "ready", commands: dedupe(commands), blockers };
}
