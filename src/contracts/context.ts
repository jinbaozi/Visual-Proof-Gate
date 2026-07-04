import type { EvidenceItem, ResponsiveObservation, TokenLedger } from "./evidence";
import type { VisualDefect } from "./defect";
import type { VisualProofConfig } from "./config";
import type { TasteComplianceFinding, TasteHandoff } from "./taste-handoff";
import type { EnhancementPlan, ImpeccableHandoff, VisualScorecard } from "./enhancement";
import type { SafePatchLog, SafePatchPlan } from "./safe-patch";

export interface ImpeccableRoutePlan {
  status: "PASS" | "FAIL";
  commands: string[];
  blockingDefects: VisualDefect[];
}

export interface VisualProofDataContext {
  config: VisualProofConfig;
  tasteHandoff?: TasteHandoff;
  tasteComplianceFindings: TasteComplianceFinding[];
  visualScorecard?: VisualScorecard;
  enhancementPlan?: EnhancementPlan;
  safePatchPlan?: SafePatchPlan;
  safePatchLog?: SafePatchLog;
  impeccableHandoff?: ImpeccableHandoff;
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
