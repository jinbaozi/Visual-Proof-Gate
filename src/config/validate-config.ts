import type { VisualProofConfig } from "../contracts";

export function validateVisualProofConfig(config: unknown): asserts config is VisualProofConfig {
  if (!config || typeof config !== "object") {
    throw new Error("visual-proof.config.ts must export an object");
  }

  const candidate = config as Partial<VisualProofConfig>;
  if (!candidate.baseUrl) throw new Error("visual-proof.config.ts: baseUrl is required");
  if (!candidate.tasteIntent?.designRead?.startsWith("Reading this as")) {
    throw new Error("visual-proof.config.ts: tasteIntent.designRead must start with 'Reading this as'");
  }
  if (!Array.isArray(candidate.routes) || candidate.routes.length === 0) {
    throw new Error("visual-proof.config.ts: at least one route is required");
  }
  for (const route of candidate.routes) {
    if (!route.name || !route.path) throw new Error("visual-proof.config.ts: every route needs name and path");
    if (!Array.isArray(route.sections)) throw new Error(`visual-proof.config.ts: route ${route.name} needs sections[]`);
    if (!Array.isArray(route.stressTargets)) throw new Error(`visual-proof.config.ts: route ${route.name} needs stressTargets[]`);
    if (!Array.isArray(route.stateTargets)) throw new Error(`visual-proof.config.ts: route ${route.name} needs stateTargets[]`);
  }
}
