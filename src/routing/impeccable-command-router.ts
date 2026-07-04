import type { DefectKind, ImpeccableRoutePlan, VisualDefect } from "../contracts";

const KIND_TO_COMMAND: Record<DefectKind, string> = {
  typography: "typeset",
  layout: "layout",
  color: "colorize",
  motion: "animate",
  device: "adapt",
  asset: "harden",
  content: "harden",
  state: "harden",
  accessibility: "audit",
  performance: "audit",
  responsive: "adapt",
  "broad-quality": "audit"
};

export function commandForDefect(defect: VisualDefect): string {
  if (defect.recommendedCommand) return defect.recommendedCommand;
  return `/impeccable ${KIND_TO_COMMAND[defect.kind]} ${defect.route}`;
}

export function buildImpeccableRoutePlan(defects: VisualDefect[]): ImpeccableRoutePlan {
  const blockingDefects = defects.filter((defect) => defect.severity === "P0" || defect.severity === "P1");
  const commands = Array.from(new Set(blockingDefects.map(commandForDefect)));
  const routes = Array.from(new Set(defects.map((defect) => defect.route)));
  for (const route of routes) {
    commands.push(`/impeccable audit ${route}`);
    commands.push(`/impeccable polish ${route}`);
  }
  return {
    status: blockingDefects.length > 0 ? "FAIL" : "PASS",
    commands,
    blockingDefects
  };
}

export function renderImpeccableRoutingMarkdown(plan: ImpeccableRoutePlan): string {
  return [
    "# Impeccable Routing",
    "",
    plan.status === "FAIL" ? "Status: FAIL — resolve P0/P1 defects before final polish." : "Status: PASS — proceed to audit and polish.",
    "",
    "## Recommended sequence",
    "",
    ...plan.commands.map((command, index) => `${index + 1}. \`${command}\``),
    "",
    "## Blocking defects",
    "",
    ...(plan.blockingDefects.length ? plan.blockingDefects.map((defect) => `- ${defect.id}: ${defect.title} → \`${commandForDefect(defect)}\``) : ["No blocking defects."])
  ].join("\n");
}

export function routingMarkdown(defects: VisualDefect[]): string {
  return renderImpeccableRoutingMarkdown(buildImpeccableRoutePlan(defects));
}
