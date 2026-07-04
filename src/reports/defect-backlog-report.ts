import type { VisualDefect } from "../contracts";

export function renderDefectBacklogReport(defects: VisualDefect[]): string {
  return [
    "# Defect Backlog",
    "",
    ...(["P0", "P1", "P2"] as const).flatMap((severity) => {
      const group = defects.filter((defect) => defect.severity === severity);
      return [
        `## ${severity}`,
        "",
        group.length
          ? group.map((defect) => [
              `### ${defect.id} ${defect.title}`,
              `- Kind: ${defect.kind}`,
              `- Route: ${defect.route}`,
              `- Viewport: ${defect.viewport ?? "all"}`,
              `- Section: ${defect.section ?? "unknown"}`,
              `- Evidence: ${defect.evidence ?? "see reports"}`,
              `- Failing rule: ${defect.failingRule}`,
              `- Likely cause: ${defect.likelyCause}`,
              `- Recommended command: ${defect.recommendedCommand}`,
              `- Must fix before polish: ${defect.mustFixBeforePolish ? "yes" : "no"}`
            ].join("\n")).join("\n\n")
          : "No defects.",
        ""
      ];
    })
  ].join("\n");
}

export const defectBacklogMarkdown = renderDefectBacklogReport;
