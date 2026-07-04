import type { VisualProofConfig } from "../contracts";

export function buildDesignIntentLock(config: VisualProofConfig): string {
  const i = config.tasteIntent;
  return [
    "# Design Intent Lock",
    "",
    "## Taste Design Read",
    i.designRead,
    "",
    "## Page Kind",
    i.pageKind,
    "",
    "## Audience",
    i.audience,
    "",
    "## Brand Position",
    i.brandPosition,
    "",
    "## Dials",
    `- DESIGN_VARIANCE: ${i.designVariance}/10`,
    `- MOTION_INTENSITY: ${i.motionIntensity}/10`,
    `- VISUAL_DENSITY: ${i.visualDensity}/10`,
    "",
    "## Theme",
    i.theme,
    "",
    "## Typography Direction",
    i.typographyDirection,
    "",
    "## Color Direction",
    i.colorDirection,
    "",
    "## Visual Asset Contract",
    ...i.assetContract.map((x) => `- ${x}`),
    "",
    "## Responsive Contract",
    ...i.responsiveContract.map((x) => `- ${x}`),
    "",
    "## Route Coverage",
    ...config.routes.map((r) => `- ${r.name}: ${r.path}`)
  ].join("\n");
}

export const designIntentMarkdown = buildDesignIntentLock;
