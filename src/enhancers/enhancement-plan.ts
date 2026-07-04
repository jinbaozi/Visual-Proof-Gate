import type { EnhancementCandidate, EnhancementPlan, TasteComplianceFinding, VisualDefect, VisualScorecard } from "../contracts";

export function buildEnhancementPlan(input: {
  routeName: string;
  defects: VisualDefect[];
  tasteFindings: TasteComplianceFinding[];
  scorecard: VisualScorecard;
}): EnhancementPlan {
  const candidates: EnhancementCandidate[] = [];
  const route = input.routeName;

  if (input.scorecard.responsiveElegance < 80 || input.defects.some((defect) => defect.kind === "device" || defect.kind === "responsive")) {
    candidates.push({
      id: "ENH-001",
      target: { route, section: "responsive/layout" },
      category: "responsive-elegance",
      severity: input.scorecard.responsiveElegance < 65 ? "blocking" : "high-impact",
      confidence: 0.86,
      rationale: "Responsive or device-related defects reduce the perceived quality of the Taste-generated layout.",
      proposedChange: "Prioritize mobile overflow, section stacking, and CTA visibility fixes before final design polish.",
      risk: "safe",
      canAutoPatch: false,
      impeccableFallback: `/impeccable adapt ${route}`
    });
  }

  if (input.scorecard.assetRichness < 82 || input.defects.some((defect) => defect.kind === "asset")) {
    candidates.push({
      id: "ENH-002",
      target: { route, section: "visual assets" },
      category: "asset-upgrade",
      severity: "high-impact",
      confidence: 0.82,
      rationale: "Asset issues weaken the bridge between Taste's visual intent and final production readiness.",
      proposedChange: "Replace missing or placeholder assets, verify alt/decorative treatment, and ensure hero/product visuals are intentional.",
      risk: "moderate",
      canAutoPatch: false,
      impeccableFallback: `/impeccable harden ${route}`
    });
  }

  if (input.scorecard.brandDistinctiveness < 78 || input.tasteFindings.some((finding) => finding.category === "dial-alignment")) {
    candidates.push({
      id: "ENH-003",
      target: { route, section: "brand expression" },
      category: "taste-compliance",
      severity: "high-impact",
      confidence: 0.74,
      rationale: "Taste dial alignment requires a human-visible review before Impeccable systemization.",
      proposedChange: "Review hero composition, section variety, and motion purpose against Taste dials; convert high-confidence findings into targeted Impeccable layout/typeset/colorize commands.",
      risk: "moderate",
      canAutoPatch: false,
      impeccableFallback: `/impeccable layout ${route}`
    });
  }

  if (input.scorecard.typography < 82 || input.defects.some((defect) => defect.kind === "content" || defect.kind === "typography")) {
    candidates.push({
      id: "ENH-004",
      target: { route, section: "typography and copy fit" },
      category: "typography-ramp",
      severity: "high-impact",
      confidence: 0.78,
      rationale: "Content stress or typography defects indicate that the first visual pass is not robust enough for production copy.",
      proposedChange: "Review heading line length, CTA wrapping, CJK/long-word behavior, and body measure before Impeccable typesetting.",
      risk: "safe",
      canAutoPatch: false,
      impeccableFallback: `/impeccable typeset ${route}`
    });
  }

  if (candidates.length === 0) {
    candidates.push({
      id: "ENH-000",
      target: { route, section: "global" },
      category: "cta-clarity",
      severity: "polish",
      confidence: 0.7,
      rationale: "No high-impact deterministic enhancement candidates were detected.",
      proposedChange: "Proceed to Impeccable audit and polish with the current evidence pack.",
      risk: "safe",
      canAutoPatch: false,
      impeccableFallback: `/impeccable polish ${route}`
    });
  }

  return {
    mode: "diagnose-only",
    summary: "Visual Proof generated enhancement candidates only; automatic source patching is intentionally disabled in v1.",
    candidates
  };
}
