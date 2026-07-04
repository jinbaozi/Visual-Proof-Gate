export type SafePatchMode = "diagnose-only" | "safe-patch";
export type SafePatchOperationKind = "replace" | "append" | "prepend";

export interface SafePatchTarget {
  id: string;
  enabled?: boolean;
  filePath: string;
  operation: SafePatchOperationKind;
  search?: string;
  replace?: string;
  content?: string;
  requiresMarker?: string;
  rationale: string;
}

export interface SafePatchConfig {
  mode: SafePatchMode;
  sourceRoot?: string;
  allowAutoPatch: boolean;
  dryRun: boolean;
  maxPatchesPerRun: number;
  allowedExtensions: string[];
  operations: SafePatchTarget[];
}

export interface SafePatchPlanOperation extends SafePatchTarget {
  resolvedPath?: string;
  status: "planned" | "blocked";
  reason?: string;
}

export interface SafePatchPlan {
  mode: SafePatchMode;
  enabled: boolean;
  dryRun: boolean;
  sourceRoot?: string;
  operations: SafePatchPlanOperation[];
  blockedReasons: string[];
}

export interface SafePatchLogEntry {
  id: string;
  filePath: string;
  operation: SafePatchOperationKind;
  status: "applied" | "dry-run" | "skipped" | "failed";
  message: string;
}

export interface SafePatchLog {
  applied: number;
  skipped: number;
  failed: number;
  entries: SafePatchLogEntry[];
}
