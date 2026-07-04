import path from "node:path";
import type { SafePatchConfig, SafePatchPlanOperation, SafePatchTarget } from "../contracts";

export const DEFAULT_SAFE_PATCH_CONFIG: SafePatchConfig = {
  mode: "diagnose-only",
  allowAutoPatch: false,
  dryRun: true,
  maxPatchesPerRun: 3,
  allowedExtensions: [".css", ".html", ".jsx", ".tsx", ".ts", ".md"],
  operations: []
};

export function normalizeSafePatchConfig(config?: Partial<SafePatchConfig>): SafePatchConfig {
  return {
    ...DEFAULT_SAFE_PATCH_CONFIG,
    ...config,
    allowedExtensions: config?.allowedExtensions ?? DEFAULT_SAFE_PATCH_CONFIG.allowedExtensions,
    operations: config?.operations ?? []
  };
}

export function resolvePatchTarget(input: {
  sourceRoot?: string;
  target: SafePatchTarget;
  allowedExtensions: string[];
}): SafePatchPlanOperation {
  if (!input.sourceRoot) {
    return { ...input.target, status: "blocked", reason: "sourceRoot is required for safe patch mode" };
  }

  const sourceRoot = path.resolve(input.sourceRoot);
  const resolvedPath = path.resolve(sourceRoot, input.target.filePath);
  const relative = path.relative(sourceRoot, resolvedPath);
  const outsideRoot = relative.startsWith("..") || path.isAbsolute(relative);
  if (outsideRoot) {
    return { ...input.target, resolvedPath, status: "blocked", reason: "filePath is outside sourceRoot" };
  }

  const extension = path.extname(resolvedPath);
  if (!input.allowedExtensions.includes(extension)) {
    return { ...input.target, resolvedPath, status: "blocked", reason: `extension ${extension || "none"} is not allowed` };
  }

  if (input.target.operation === "replace" && (!input.target.search || input.target.replace === undefined)) {
    return { ...input.target, resolvedPath, status: "blocked", reason: "replace operation requires search and replace" };
  }

  if ((input.target.operation === "append" || input.target.operation === "prepend") && !input.target.content) {
    return { ...input.target, resolvedPath, status: "blocked", reason: `${input.target.operation} operation requires content` };
  }

  return { ...input.target, resolvedPath, status: "planned" };
}
