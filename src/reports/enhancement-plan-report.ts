import type { EnhancementPlan } from "../contracts";
import { table } from "../io";

export function renderEnhancementPlanReport(plan: EnhancementPlan): string {
  return [
    "# Enhancement Plan",
    "",
    `Mode: ${plan.mode}`,
    "",
    plan.summary,
    "",
    table(["ID", "Severity", "Category", "Target", "Risk", "Auto patch", "Impeccable fallback", "Proposed change"], plan.candidates.map((candidate) => [
      candidate.id,
      candidate.severity,
      candidate.category,
      `${candidate.target.route}/${candidate.target.section}`,
      candidate.risk,
      candidate.canAutoPatch ? "yes" : "no",
      candidate.impeccableFallback,
      candidate.proposedChange
    ]))
  ].join("\n");
}
