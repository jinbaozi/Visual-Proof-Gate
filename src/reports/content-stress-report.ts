import type { VisualDefect } from "../contracts";

export function renderContentStressReport(results: string[], defects: VisualDefect[]): string {
  const hasStressDefects = defects.some((defect) => defect.kind === "content" || defect.kind === "device");
  return [
    "# Content Stress Report",
    "",
    hasStressDefects ? "Status: fail — content/device stress defects detected." : "Status: pass — no content stress defects detected.",
    "",
    ...results.map((result) => `- ${result}`)
  ].join("\n");
}
