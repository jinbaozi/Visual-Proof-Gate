import type { TasteComplianceFinding } from "../contracts";
import { table } from "../io";

export function renderTasteComplianceReport(findings: TasteComplianceFinding[]): string {
  return [
    "# Taste Compliance Report",
    "",
    findings.some((finding) => finding.status === "fail") ? "Status: FAIL" : findings.some((finding) => finding.status === "review") ? "Status: REVIEW" : "Status: PASS",
    "",
    table(["ID", "Status", "Category", "Finding", "Recommendation", "Impeccable fallback"], findings.map((finding) => [
      finding.id,
      finding.status,
      finding.category,
      finding.title,
      finding.recommendation,
      finding.impeccableFallback
    ]))
  ].join("\n");
}
