import type { TasteComplianceFinding, VisualScorecard } from "../contracts";

export function renderAestheticDiagnosis(input: {
  scorecard: VisualScorecard;
  tasteFindings: TasteComplianceFinding[];
}): string {
  const s = input.scorecard;
  return [
    "# Aesthetic Diagnosis",
    "",
    `Overall score: ${s.overall}/100`,
    "",
    "## Scorecard",
    `- Composition: ${s.composition}/100`,
    `- Typography: ${s.typography}/100`,
    `- Color: ${s.color}/100`,
    `- Spacing rhythm: ${s.spacingRhythm}/100`,
    `- Section variety: ${s.sectionVariety}/100`,
    `- Asset richness: ${s.assetRichness}/100`,
    `- Motion purpose: ${s.motionPurpose}/100`,
    `- Responsive elegance: ${s.responsiveElegance}/100`,
    `- CTA clarity: ${s.ctaClarity}/100`,
    `- Brand distinctiveness: ${s.brandDistinctiveness}/100`,
    "",
    "## Blockers",
    ...(s.blockers.length ? s.blockers.map((item) => `- ${item}`) : ["- None detected."]),
    "",
    "## Quick wins",
    ...(s.quickWins.length ? s.quickWins.map((item) => `- ${item}`) : ["- Continue to enhancement planning and Impeccable handoff."]),
    "",
    "## Taste findings considered",
    ...input.tasteFindings.map((finding) => `- ${finding.id} [${finding.status}] ${finding.title}`)
  ].join("\n");
}
