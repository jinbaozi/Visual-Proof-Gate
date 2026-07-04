import type { ResponsiveObservation, VisualDefect } from "../contracts";
import { table } from "../io";
import { viewportFamily } from "../contracts";

export function renderResponsiveMatrixReport(observations: ResponsiveObservation[], defects: VisualDefect[]): string {
  const keys = Array.from(new Set(observations.map((item) => `${item.route}::${item.section}`)));
  const rows = keys.map((key) => {
    const [route, section] = key.split("::");
    const sectionObservations = observations.filter((item) => item.route === route && item.section === section);
    const relatedDefects = defects.filter((defect) => defect.route === route && (defect.section === section || defect.section === "document"));
    const family = (target: "desktop" | "tablet" | "mobile") => {
      const familyObservations = sectionObservations.filter((item) => viewportFamily(item.viewport) === target);
      if (familyObservations.some((item) => !item.visible)) return "missing section";
      if (relatedDefects.some((defect) => defect.viewport && viewportFamily(defect.viewport) === target && (defect.severity === "P0" || defect.severity === "P1"))) return "has defects";
      return "checked";
    };
    const status = sectionObservations.some((item) => !item.visible) || relatedDefects.some((defect) => defect.severity === "P0" || defect.severity === "P1") ? "fail" : "pass";
    const notes = status === "pass" ? "No blocking responsive defects detected" : relatedDefects.map((defect) => `${defect.id}: ${defect.title}`).join("; ") || "Section missing in one or more viewport";
    return [route, section, family("desktop"), family("tablet"), family("mobile"), status, notes];
  });
  return ["# Responsive Matrix", "", table(["Route", "Section", "Desktop", "Tablet", "Mobile", "Status", "Notes"], rows)].join("\n");
}

export const responsiveMatrixMarkdown = renderResponsiveMatrixReport;
