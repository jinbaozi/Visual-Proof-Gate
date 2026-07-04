import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import { loadConfig, runVisualProofGate } from "../src/visual-proof";

test.describe.configure({ timeout: 120_000 * 20 });

test("runs full visual proof gate", async ({ page, browserName }) => {
  expect(browserName).toBe("chromium");
  const config = await loadConfig();
  const defects = await runVisualProofGate(page, config);
  for (const report of [
    "docs/visual-proof/design-intent.lock.md",
    "docs/visual-proof/evidence.md",
    "docs/visual-proof/responsive-matrix.md",
    "docs/visual-proof/token-ledger.json",
    "docs/visual-proof/asset-ledger.md",
    "docs/visual-proof/state-matrix.md",
    "docs/visual-proof/content-stress-report.md",
    "docs/visual-proof/defect-backlog.md",
    "docs/visual-proof/impeccable-routing.md"
  ]) await fs.access(report);
  const p0 = defects.filter((d) => d.severity === "P0");
  expect(p0, JSON.stringify(p0, null, 2)).toEqual([]);
});
