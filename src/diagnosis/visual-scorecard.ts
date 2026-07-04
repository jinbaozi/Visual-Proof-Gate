import type { TasteComplianceFinding, VisualDefect, VisualScorecard } from "../contracts";

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function buildVisualScorecard(input: {
  defects: VisualDefect[];
  tasteFindings: TasteComplianceFinding[];
  assetRows: string[][];
  stateRows: string[][];
  tokenLedgerExists: boolean;
}): VisualScorecard {
  const p0 = input.defects.filter((defect) => defect.severity === "P0").length;
  const p1 = input.defects.filter((defect) => defect.severity === "P1").length;
  const failedTaste = input.tasteFindings.filter((finding) => finding.status === "fail").length;
  const reviewTaste = input.tasteFindings.filter((finding) => finding.status === "review").length;
  const failedAssets = input.assetRows.filter((row) => row[3] === "fail").length;
  const failedStates = input.stateRows.filter((row) => row[3] === "fail").length;

  const composition = clampScore(82 - p0 * 20 - p1 * 6 - reviewTaste * 4);
  const typography = clampScore(82 - input.defects.filter((defect) => defect.kind === "typography" || defect.kind === "content").length * 8);
  const color = clampScore(input.tokenLedgerExists ? 78 - reviewTaste * 3 : 55);
  const spacingRhythm = clampScore(80 - input.defects.filter((defect) => defect.kind === "layout").length * 8);
  const sectionVariety = clampScore(76 - reviewTaste * 6);
  const assetRichness = clampScore(82 - failedAssets * 12);
  const motionPurpose = clampScore(78 - reviewTaste * 5);
  const responsiveElegance = clampScore(88 - p0 * 25 - input.defects.filter((defect) => defect.kind === "device" || defect.kind === "responsive").length * 10);
  const ctaClarity = clampScore(84 - failedStates * 10 - input.defects.filter((defect) => defect.kind === "state").length * 8);
  const brandDistinctiveness = clampScore(78 - failedTaste * 10 - reviewTaste * 4);
  const scores = [composition, typography, color, spacingRhythm, sectionVariety, assetRichness, motionPurpose, responsiveElegance, ctaClarity, brandDistinctiveness];
  const overall = clampScore(scores.reduce((sum, item) => sum + item, 0) / scores.length);

  return {
    overall,
    composition,
    typography,
    color,
    spacingRhythm,
    sectionVariety,
    assetRichness,
    motionPurpose,
    responsiveElegance,
    ctaClarity,
    brandDistinctiveness,
    blockers: input.defects.filter((defect) => defect.severity === "P0").map((defect) => `${defect.id}: ${defect.title}`),
    quickWins: [
      ...(failedAssets > 0 ? ["Resolve asset ledger failures before Impeccable polish."] : []),
      ...(failedStates > 0 ? ["Add missing interaction state targets or update selectors."] : []),
      ...(reviewTaste > 0 ? ["Review Taste dial alignment findings and convert high-confidence findings into enhancement candidates."] : []),
      ...(!input.tokenLedgerExists ? ["Generate token ledger before final handoff."] : [])
    ]
  };
}
