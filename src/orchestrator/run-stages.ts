import type { ContextKey, VisualProofStage } from "../contracts";
import type { VisualProofRuntimeContext } from "./visual-proof-context";

function hasContextKey(context: VisualProofRuntimeContext, key: ContextKey): boolean {
  return key in context;
}

function assertStageKeys(context: VisualProofRuntimeContext, stage: VisualProofStage<VisualProofRuntimeContext>, phase: "requires" | "produces"): void {
  const keys = phase === "requires" ? stage.requires : stage.produces;
  for (const key of keys) {
    if (!hasContextKey(context, key)) {
      throw new Error(`Stage ${stage.name} ${phase} missing context key: ${key}`);
    }
  }
}

export async function runStages(
  context: VisualProofRuntimeContext,
  stages: VisualProofStage<VisualProofRuntimeContext>[]
): Promise<VisualProofRuntimeContext> {
  let current = context;
  for (const stage of stages) {
    assertStageKeys(current, stage, "requires");
    current = await stage.run(current);
    assertStageKeys(current, stage, "produces");
  }
  return current;
}
