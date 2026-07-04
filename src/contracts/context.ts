import type { EvidenceItem, ResponsiveObservation, TokenLedger } from "./evidence";
import type { VisualDefect } from "./defect";
import type { VisualProofConfig } from "./config";

export interface ImpeccableRoutePlan {
  status: "PASS" | "FAIL";
  commands: string[];
  blockingDefects: VisualDefect[];
}

export interface VisualProofDataContext {
  config: VisualProofConfig;
  intentLock?: string;
  evidence: EvidenceItem[];
  responsiveObservations: ResponsiveObservation[];
  contentStressResults: string[];
  assetLedger: string[][];
  tokenLedger?: TokenLedger;
  stateMatrix: string[][];
  defects: VisualDefect[];
  reports: Record<string, string>;
  routing?: ImpeccableRoutePlan;
}
