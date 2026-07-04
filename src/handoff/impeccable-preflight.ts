import type { ImpeccablePreflightChecklist, SafePatchLog, VisualDeltaReport, VisualScorecard } from "../contracts";

export function buildImpeccablePreflight(input: {
  scorecard: VisualScorecard;
  safePatchLog?: SafePatchLog;
  visualDelta?: VisualDeltaReport;
  blockerCount: number;
}): ImpeccablePreflightChecklist {
  return {
    items: [
      {
        id: "PRE-001",
        title: "Visual scorecard is available",
        status: input.scorecard.overall > 0 ? "pass" : "fail",
        evidence: "docs/visual-proof/visual-scorecard.json"
      },
      {
        id: "PRE-002",
        title: "P0 blockers are clear before final polish",
        status: input.blockerCount === 0 ? "pass" : "fail",
        evidence: "docs/visual-proof/defect-backlog.md"
      },
      {
        id: "PRE-003",
        title: "Safe patch log is available",
        status: input.safePatchLog ? "pass" : "review",
        evidence: "docs/visual-proof/patch-log.md"
      },
      {
        id: "PRE-004",
        title: "Visual delta report is available",
        status: input.visualDelta ? "pass" : "review",
        evidence: "docs/visual-proof/visual-delta-report.md"
      }
    ]
  };
}

export function renderImpeccablePreflight(checklist: ImpeccablePreflightChecklist): string {
  return [
    "# Impeccable Preflight Checklist",
    "",
    ...checklist.items.map((item) => [
      `## ${item.id} ${item.title}`,
      `- Status: ${item.status}`,
      `- Evidence: ${item.evidence ?? "none"}`
    ].join("\n"))
  ].join("\n\n");
}
