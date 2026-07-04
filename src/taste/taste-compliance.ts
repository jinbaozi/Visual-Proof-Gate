import type { TasteComplianceFinding, TasteHandoff, VisualDefect } from "../contracts";

export function buildTasteComplianceFindings(input: {
  handoff: TasteHandoff;
  defects: VisualDefect[];
  assetRows: string[][];
  tokenLedgerExists: boolean;
}): TasteComplianceFinding[] {
  const findings: TasteComplianceFinding[] = [];

  if (input.handoff.dials.designVariance >= 7) {
    findings.push({
      id: "TASTE-001",
      status: "review",
      category: "dial-alignment",
      title: "High DESIGN_VARIANCE requires visible layout distinctiveness review",
      recommendation: "Review screenshots for excessive centered-template composition and add an enhancement candidate when sections are too symmetrical.",
      impeccableFallback: "/impeccable layout"
    });
  }

  if (input.handoff.dials.motionIntensity > 3) {
    findings.push({
      id: "TASTE-002",
      status: "review",
      category: "dial-alignment",
      title: "Motion intent should be verified against state and reduced-motion evidence",
      recommendation: "Ensure motion supports feedback, hierarchy, or orientation instead of decorative-only animation.",
      impeccableFallback: "/impeccable animate"
    });
  }

  const assetFailures = input.assetRows.filter((row) => row[3] === "fail");
  if (assetFailures.length > 0) {
    findings.push({
      id: "TASTE-003",
      status: "fail",
      category: "asset",
      title: "Taste asset contract has unresolved asset failures",
      recommendation: "Replace missing, placeholder, or inaccessible assets before final Impeccable polish.",
      impeccableFallback: "/impeccable harden"
    });
  }

  if (!input.tokenLedgerExists) {
    findings.push({
      id: "TASTE-004",
      status: "fail",
      category: "design-read",
      title: "Token ledger missing, visual system cannot be checked against Taste intent",
      recommendation: "Run token extraction before generating the Impeccable handoff.",
      impeccableFallback: "/impeccable document"
    });
  }

  const p0Count = input.defects.filter((defect) => defect.severity === "P0").length;
  if (p0Count > 0) {
    findings.push({
      id: "TASTE-005",
      status: "fail",
      category: "responsive",
      title: "Blocking layout defects prevent Taste intent verification",
      recommendation: "Resolve P0 defects before judging final visual quality.",
      impeccableFallback: "/impeccable adapt"
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: "TASTE-000",
      status: "pass",
      category: "design-read",
      title: "No deterministic Taste compliance problems detected",
      recommendation: "Continue with aesthetic diagnosis and Impeccable handoff.",
      impeccableFallback: "/impeccable audit"
    });
  }

  return findings;
}
