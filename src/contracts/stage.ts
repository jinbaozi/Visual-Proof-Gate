export type ContextKey =
  | "config"
  | "intentLock"
  | "evidence"
  | "responsiveObservations"
  | "contentStressResults"
  | "assetLedger"
  | "tokenLedger"
  | "stateMatrix"
  | "defects"
  | "reports"
  | "routing";

export interface VisualProofStage<TContext = unknown> {
  name: string;
  description: string;
  requires: ContextKey[];
  produces: ContextKey[];
  run(context: TContext): Promise<TContext>;
}
