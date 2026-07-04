import type { Page } from "@playwright/test";
import type { VisualProofConfig, VisualProofDataContext } from "../contracts";

export interface VisualProofRuntimeContext extends VisualProofDataContext {
  page: Page;
}

export function createVisualProofContext(page: Page, config: VisualProofConfig): VisualProofRuntimeContext {
  return {
    page,
    config,
    evidence: [],
    responsiveObservations: [],
    contentStressResults: [],
    assetLedger: [],
    stateMatrix: [],
    defects: [],
    reports: {}
  };
}
