import type { TasteHandoff, VisualProofConfig } from "../contracts";

export function buildTasteHandoffFromConfig(config: VisualProofConfig): TasteHandoff {
  const intent = config.tasteIntent;
  return {
    designRead: intent.designRead,
    pageKind: intent.pageKind,
    audience: intent.audience,
    brandPosition: intent.brandPosition,
    dials: {
      designVariance: intent.designVariance,
      motionIntensity: intent.motionIntensity,
      visualDensity: intent.visualDensity
    },
    visualLanguage: {
      typographyDirection: intent.typographyDirection,
      colorDirection: intent.colorDirection,
      layoutDirection: intent.responsiveContract.join("; "),
      motionDirection: intent.motionIntensity > 3 ? "Motion should be purposeful and respect reduced motion." : "Motion should stay minimal.",
      materialDirection: intent.assetContract.join("; ")
    },
    sectionStrategy: config.routes.flatMap((route) => route.sections.map((section) => ({
      name: `${route.name}:${section.name}`,
      intendedRole: section.name,
      visualPattern: "Configured section selector",
      density: intent.visualDensity >= 7 ? "dense" : intent.visualDensity <= 3 ? "airy" : "balanced",
      assetRequirement: section.name.toLowerCase().includes("hero") ? "required" : "optional"
    }))),
    antiSlopRules: [
      "Avoid generic centered hero when DESIGN_VARIANCE is high.",
      "Avoid repetitive three-card grids without visual contrast.",
      "Avoid fake product screenshots and placeholder-only asset treatment.",
      "Avoid unrelated accent colors that dilute the brand system.",
      "Avoid motion that lacks feedback, hierarchy, or orientation purpose."
    ],
    assetAssumptions: intent.assetContract.map((item, index) => ({
      placement: `asset-contract-${index + 1}`,
      expectedAsset: item,
      currentStatus: "missing"
    })),
    knownRisks: [
      "Taste output may drift during implementation unless checked against screenshots.",
      "Visual Proof can plan enhancements, but final systemization remains an Impeccable responsibility."
    ]
  };
}

export function renderTasteHandoffLock(handoff: TasteHandoff): string {
  return [
    "# Taste Handoff Lock",
    "",
    "## Design Read",
    handoff.designRead,
    "",
    "## Page Kind",
    handoff.pageKind,
    "",
    "## Audience",
    handoff.audience,
    "",
    "## Brand Position",
    handoff.brandPosition,
    "",
    "## Dials",
    `- DESIGN_VARIANCE: ${handoff.dials.designVariance}/10`,
    `- MOTION_INTENSITY: ${handoff.dials.motionIntensity}/10`,
    `- VISUAL_DENSITY: ${handoff.dials.visualDensity}/10`,
    "",
    "## Visual Language",
    `- Typography: ${handoff.visualLanguage.typographyDirection}`,
    `- Color: ${handoff.visualLanguage.colorDirection}`,
    `- Layout: ${handoff.visualLanguage.layoutDirection}`,
    `- Motion: ${handoff.visualLanguage.motionDirection}`,
    `- Material: ${handoff.visualLanguage.materialDirection}`,
    "",
    "## Anti-slop Rules",
    ...handoff.antiSlopRules.map((rule) => `- ${rule}`),
    "",
    "## Known Risks",
    ...handoff.knownRisks.map((risk) => `- ${risk}`)
  ].join("\n");
}
