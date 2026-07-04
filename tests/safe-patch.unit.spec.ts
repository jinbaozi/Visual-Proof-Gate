import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { applySafePatchPlan, buildSafePatchPlan, renderSafePatchLogReport, renderSafePatchPlanReport } from "../src/visual-proof";

test("safe patch plan stays disabled by default", () => {
  const plan = buildSafePatchPlan({});
  expect(plan.enabled).toBeFalsy();
  expect(plan.mode).toBe("diagnose-only");
  expect(plan.blockedReasons.length).toBeGreaterThan(0);
  expect(renderSafePatchPlanReport(plan)).toContain("# Safe Patch Plan");
});

test("safe patch plan blocks path outside source root", () => {
  const plan = buildSafePatchPlan({
    config: {
      mode: "safe-patch",
      allowAutoPatch: true,
      dryRun: true,
      sourceRoot: "fixtures/root",
      maxPatchesPerRun: 3,
      allowedExtensions: [".css"],
      operations: [{
        id: "PATCH-001",
        filePath: "../outside.css",
        operation: "append",
        content: "body{}",
        rationale: "boundary test"
      }]
    }
  });
  expect(plan.operations[0].status).toBe("blocked");
  expect(plan.operations[0].reason).toContain("outside sourceRoot");
});

test("safe patch apply supports dry-run replace without mutating file", async () => {
  const root = path.resolve("test-results/safe-patch-fixture");
  const file = path.join(root, "style.css");
  await fs.mkdir(root, { recursive: true });
  await fs.writeFile(file, ".button { white-space: normal; }", "utf8");

  const plan = buildSafePatchPlan({
    config: {
      mode: "safe-patch",
      allowAutoPatch: true,
      dryRun: true,
      sourceRoot: root,
      maxPatchesPerRun: 3,
      allowedExtensions: [".css"],
      operations: [{
        id: "PATCH-002",
        filePath: "style.css",
        operation: "replace",
        search: "white-space: normal",
        replace: "white-space: nowrap",
        rationale: "CTA no-wrap safe patch fixture"
      }]
    }
  });

  const log = await applySafePatchPlan(plan);
  const text = await fs.readFile(file, "utf8");
  expect(plan.enabled).toBeTruthy();
  expect(plan.operations[0].status).toBe("planned");
  expect(log.entries[0].status).toBe("dry-run");
  expect(text).toContain("white-space: normal");
  expect(renderSafePatchLogReport(log)).toContain("# Safe Patch Log");
});
