import type { Page } from "@playwright/test";
import type { VisualDefect, VisualProofConfig } from "../contracts";
import { resetDefectCounter } from "../probes";
import { createVisualProofContext } from "./visual-proof-context";
import { runStages } from "./run-stages";
import { prepareVisualProofArtifacts, VISUAL_PROOF_STAGES } from "./visual-proof-stages";

export async function runVisualProofGate(page: Page, config: VisualProofConfig): Promise<VisualDefect[]> {
  resetDefectCounter();
  await prepareVisualProofArtifacts();
  const context = createVisualProofContext(page, config);
  const result = await runStages(context, VISUAL_PROOF_STAGES);
  return result.defects;
}
