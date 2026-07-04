import type { EvidenceItem } from "../contracts";
import { table } from "../io";

export function renderEvidenceReport(evidence: EvidenceItem[]): string {
  return [
    "# Evidence",
    "",
    table(["Route", "Viewport", "Theme", "Screenshot", "Status", "Notes"], evidence.map((item) => [
      item.route,
      item.viewport,
      item.theme,
      item.screenshotPath,
      item.status,
      item.notes.join("; ")
    ]))
  ].join("\n");
}
