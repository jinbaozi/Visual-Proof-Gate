export type ImpeccablePhase =
  | "setup"
  | "context"
  | "targeted-fix"
  | "hardening"
  | "audit"
  | "polish";

export interface ImpeccableCommandItem {
  id: string;
  phase: ImpeccablePhase;
  command: string;
  reason: string;
  evidence: string[];
  requiredBeforePolish: boolean;
}

export interface ImpeccableCommandSequence {
  status: "ready" | "blocked";
  commands: ImpeccableCommandItem[];
  blockers: string[];
}

export interface ImpeccableContextSeed {
  projectRole: string;
  tasteIntent: string;
  visualProofSummary: string;
  enhancementSummary: string;
  evidenceFiles: string[];
  unresolvedRisks: string[];
  operatingNotes: string[];
}

export interface ImpeccablePreflightChecklist {
  items: Array<{
    id: string;
    title: string;
    status: "pass" | "fail" | "review";
    evidence?: string;
  }>;
}
