import type { VisualDeltaReport } from "../contracts";
import { table } from "../io";

export function renderBeforeAfterGalleryReport(report: VisualDeltaReport): string {
  return [
    "# Before / After Gallery",
    "",
    report.summary,
    "",
    table(["ID", "Route", "Viewport", "Theme", "Before", "After", "Patch status"], report.pairs.map((pair) => [
      pair.id,
      pair.route,
      pair.viewport,
      pair.theme,
      pair.beforeScreenshot,
      pair.afterScreenshot,
      pair.patchStatus
    ]))
  ].join("\n");
}

export function renderVisualDeltaReport(report: VisualDeltaReport): string {
  return [
    "# Visual Delta Report",
    "",
    `Status: ${report.status}`,
    "",
    report.summary,
    "",
    "## Notes",
    ...report.pairs.flatMap((pair) => pair.notes.map((note) => `- ${pair.id}: ${note}`))
  ].join("\n");
}
