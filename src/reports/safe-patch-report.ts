import type { SafePatchLog, SafePatchPlan } from "../contracts";
import { table } from "../io";

export function renderSafePatchPlanReport(plan: SafePatchPlan): string {
  return [
    "# Safe Patch Plan",
    "",
    `Mode: ${plan.mode}`,
    `Enabled: ${plan.enabled ? "yes" : "no"}`,
    `Dry run: ${plan.dryRun ? "yes" : "no"}`,
    `Source root: ${plan.sourceRoot ?? "not configured"}`,
    "",
    "## Blocked reasons",
    ...(plan.blockedReasons.length ? plan.blockedReasons.map((reason) => `- ${reason}`) : ["- None"]),
    "",
    table(["ID", "Status", "Operation", "File", "Reason", "Rationale"], plan.operations.map((operation) => [
      operation.id,
      operation.status,
      operation.operation,
      operation.filePath,
      operation.reason ?? "",
      operation.rationale
    ]))
  ].join("\n");
}

export function renderSafePatchLogReport(log: SafePatchLog): string {
  return [
    "# Safe Patch Log",
    "",
    `Applied: ${log.applied}`,
    `Skipped: ${log.skipped}`,
    `Failed: ${log.failed}`,
    "",
    table(["ID", "Status", "Operation", "File", "Message"], log.entries.map((entry) => [
      entry.id,
      entry.status,
      entry.operation,
      entry.filePath,
      entry.message
    ]))
  ].join("\n");
}
