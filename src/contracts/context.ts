import type { AssetLedgerItem, EvidenceItem, ResponsiveObservation, StateMatrixRow, TokenLedger } from "./evidence";
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
  assetLedger: AssetLedgerItem[];
  tokenLedger?: TokenLedger;
  stateMatrix: StateMatrixRow[];
  defects: VisualDefect[];
  reports: Record<string, string>;
  routing?: ImpeccableRoutePlan;
}
