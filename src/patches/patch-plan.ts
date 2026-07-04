import type { EnhancementPlan, SafePatchConfig, SafePatchPlan } from "../contracts";
import { normalizeSafePatchConfig, resolvePatchTarget } from "./safe-patch-policy";

export function buildSafePatchPlan(input: {
  config?: Partial<SafePatchConfig>;
  enhancementPlan?: EnhancementPlan;
}): SafePatchPlan {
  const patchConfig = normalizeSafePatchConfig(input.config);
  const blockedReasons: string[] = [];

  if (patchConfig.mode !== "safe-patch") blockedReasons.push("safe patch mode is disabled; current mode is diagnose-only");
  if (!patchConfig.allowAutoPatch) blockedReasons.push("allowAutoPatch must be true before patches can be applied");
  if (!patchConfig.sourceRoot) blockedReasons.push("sourceRoot is required before patches can be applied");

  const enabled = blockedReasons.length === 0;
  const configuredOperations = patchConfig.operations.filter((operation) => operation.enabled !== false);
  const limitedOperations = configuredOperations.slice(0, patchConfig.maxPatchesPerRun);
  const operations = limitedOperations.map((operation) => resolvePatchTarget({
    sourceRoot: patchConfig.sourceRoot,
    target: operation,
    allowedExtensions: patchConfig.allowedExtensions
  }));

  if ((input.enhancementPlan?.candidates ?? []).some((candidate) => candidate.canAutoPatch)) {
    blockedReasons.push("enhancement candidate auto-patching is not enabled in v1; only explicit configured operations are eligible");
  }

  return {
    mode: patchConfig.mode,
    enabled,
    dryRun: patchConfig.dryRun,
    sourceRoot: patchConfig.sourceRoot,
    operations: enabled ? operations : operations.map((operation) => ({ ...operation, status: "blocked", reason: operation.reason ?? "safe patch mode is not fully authorized" })),
    blockedReasons
  };
}
