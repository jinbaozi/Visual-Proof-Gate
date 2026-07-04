import type { EvidenceItem, SafePatchLog, ThemeMode, VisualDeltaPair, VisualDeltaReport, ViewportConfig } from "../contracts";

function patchStatus(log?: SafePatchLog): VisualDeltaPair["patchStatus"] {
  if (!log || log.entries.length === 0) return "no-patch";
  if (log.failed > 0) return "failed";
  if (log.applied > 0) return "applied";
  if (log.entries.some((entry) => entry.status === "dry-run")) return "dry-run";
  return "no-patch";
}

export function shouldCaptureAfterScreenshots(log?: SafePatchLog): boolean {
  return Boolean(log?.entries.length);
}

export function buildAfterScreenshotPath(input: {
  route: string;
  viewport: string;
  theme: ThemeMode;
}): string {
  return `docs/visual-proof/screenshots/after/${input.route}-${input.viewport}-${input.theme}.png`;
}

export function buildVisualDeltaReport(input: {
  evidence: EvidenceItem[];
  afterScreenshots: Array<{ route: string; viewport: string; theme: ThemeMode; screenshotPath: string }>;
  patchLog?: SafePatchLog;
  sampledViewports: ViewportConfig[];
}): VisualDeltaReport {
  const status = patchStatus(input.patchLog);
  const pairs: VisualDeltaPair[] = [];

  for (const after of input.afterScreenshots) {
    const before = input.evidence.find((item) => item.route === after.route && item.viewport === after.viewport && item.theme === after.theme);
    if (!before) continue;
    pairs.push({
      id: `DELTA-${String(pairs.length + 1).padStart(3, "0")}`,
      route: after.route,
      viewport: after.viewport,
      theme: after.theme,
      beforeScreenshot: before.screenshotPath,
      afterScreenshot: after.screenshotPath,
      patchStatus: status,
      notes: [
        status === "applied" ? "Patch was applied before after-screenshot capture." : "No applied patch was detected; after screenshot is a verification baseline.",
        "Pixel-level diffing is intentionally not enforced in v1."
      ]
    });
  }

  return {
    status: status === "failed" ? "patch-failed" : pairs.length > 0 ? "after-captured" : "baseline-only",
    summary: pairs.length > 0
      ? `Captured ${pairs.length} before/after visual delta pair(s) across sampled viewports.`
      : "No after screenshots captured; report remains baseline-only.",
    pairs
  };
}
