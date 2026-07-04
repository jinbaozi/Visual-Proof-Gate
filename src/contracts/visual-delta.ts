export interface VisualDeltaPair {
  id: string;
  route: string;
  viewport: string;
  theme: "light" | "dark";
  beforeScreenshot: string;
  afterScreenshot: string;
  patchStatus: "no-patch" | "dry-run" | "applied" | "failed";
  notes: string[];
}

export interface VisualDeltaReport {
  status: "baseline-only" | "after-captured" | "patch-failed";
  summary: string;
  pairs: VisualDeltaPair[];
}
