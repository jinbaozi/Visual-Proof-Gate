import { test, expect } from "@playwright/test";
import {
  buildAfterScreenshotPath,
  buildVisualDeltaReport,
  renderBeforeAfterGalleryReport,
  renderVisualDeltaReport,
  shouldCaptureAfterScreenshots,
  type EvidenceItem,
  type SafePatchLog
} from "../src/visual-proof";

const evidence: EvidenceItem[] = [{
  route: "home",
  viewport: "desktop-wide",
  theme: "light",
  screenshotPath: "docs/visual-proof/screenshots/home-desktop-wide-light.png",
  status: "pass",
  notes: []
}];

const dryRunLog: SafePatchLog = {
  applied: 0,
  skipped: 1,
  failed: 0,
  entries: [{
    id: "PATCH-001",
    filePath: "style.css",
    operation: "replace",
    status: "dry-run",
    message: "replace operation prepared"
  }]
};

test("visual delta captures after screenshot path convention", () => {
  expect(buildAfterScreenshotPath({ route: "home", viewport: "mobile-small", theme: "light" })).toBe("docs/visual-proof/screenshots/after/home-mobile-small-light.png");
});

test("visual delta decides whether after screenshots are useful", () => {
  expect(shouldCaptureAfterScreenshots()).toBeFalsy();
  expect(shouldCaptureAfterScreenshots(dryRunLog)).toBeTruthy();
});

test("visual delta report pairs before and after screenshots", () => {
  const report = buildVisualDeltaReport({
    evidence,
    patchLog: dryRunLog,
    sampledViewports: [{ name: "desktop-wide", width: 1440, height: 900 }],
    afterScreenshots: [{
      route: "home",
      viewport: "desktop-wide",
      theme: "light",
      screenshotPath: "docs/visual-proof/screenshots/after/home-desktop-wide-light.png"
    }]
  });
  expect(report.status).toBe("after-captured");
  expect(report.pairs[0].patchStatus).toBe("dry-run");
  expect(renderBeforeAfterGalleryReport(report)).toContain("# Before / After Gallery");
  expect(renderVisualDeltaReport(report)).toContain("# Visual Delta Report");
});
