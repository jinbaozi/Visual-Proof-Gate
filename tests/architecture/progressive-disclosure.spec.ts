import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { VISUAL_PROOF_STAGES } from "../../src/orchestrator";

async function readText(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf8");
}

async function listTsFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listTsFiles(full);
    if (entry.isFile() && entry.name.endsWith(".ts")) return [full];
    return [];
  }));
  return nested.flat();
}

async function expectNoForbiddenText(dir: string, forbidden: string[]): Promise<void> {
  const files = await listTsFiles(dir);
  for (const file of files) {
    const text = await readText(file);
    for (const token of forbidden) {
      expect(text, `${file} must not contain ${token}`).not.toContain(token);
    }
  }
}

test("legacy visual-proof entrypoint is only a thin re-export", async () => {
  const text = await readText("src/visual-proof.ts");
  expect(text.trim()).toBe('export * from "./index";');
  expect(text.split("\n").length).toBeLessThanOrEqual(3);
});

test("contracts layer has no runtime, filesystem, browser, or higher-layer imports", async () => {
  await expectNoForbiddenText("src/contracts", [
    "@playwright/test",
    "node:fs",
    "node:path",
    "../probes",
    "../reports",
    "../routing",
    "../orchestrator"
  ]);
});

test("config layer does not depend on probes, reports, routing, or orchestrator", async () => {
  await expectNoForbiddenText("src/config", ["../probes", "../reports", "../routing", "../orchestrator"]);
});

test("probes do not write reports or import higher layers", async () => {
  await expectNoForbiddenText("src/probes", ["node:fs", "../reports", "../routing", "../orchestrator"]);
});

test("reports do not import Playwright, probes, routing, or orchestrator", async () => {
  await expectNoForbiddenText("src/reports", ["@playwright/test", "../probes", "../routing", "../orchestrator"]);
});

test("routing does not import Playwright, probes, reports, or orchestrator", async () => {
  await expectNoForbiddenText("src/routing", ["@playwright/test", "../probes", "../reports", "../orchestrator"]);
});

test("orchestrator contains no DOM probe implementation details", async () => {
  await expectNoForbiddenText("src/orchestrator", ["page.evaluate", "document.querySelector", "getBoundingClientRect"]);
});

test("every probe directory declares its local types and probe implementation", async () => {
  const entries = await fs.readdir("src/probes", { withFileTypes: true });
  const probeDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  expect(probeDirs.sort()).toEqual(["assets", "content-stress", "layout", "responsive", "states", "tokens"].sort());
  for (const dir of probeDirs) {
    const files = await fs.readdir(path.join("src/probes", dir));
    expect(files.some((file) => file.endsWith(".types.ts")), `${dir} needs a .types.ts file`).toBeTruthy();
    expect(files.some((file) => file.endsWith("-probe.ts")), `${dir} needs a -probe.ts file`).toBeTruthy();
  }
});

test("visual proof stage graph exposes progressive requires and produces metadata", () => {
  expect(VISUAL_PROOF_STAGES.length).toBeGreaterThanOrEqual(8);
  for (const stage of VISUAL_PROOF_STAGES) {
    expect(stage.name).toBeTruthy();
    expect(stage.description).toBeTruthy();
    expect(Array.isArray(stage.requires)).toBeTruthy();
    expect(Array.isArray(stage.produces)).toBeTruthy();
    expect(typeof stage.run).toBe("function");
  }
});

test("agent map and architecture overview exist", async () => {
  await fs.access("docs/architecture/agent-map.md");
  await fs.access("docs/architecture/000-agent-progressive-disclosure.md");
});
