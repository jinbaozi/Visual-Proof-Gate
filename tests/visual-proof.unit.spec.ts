import { test, expect } from "@playwright/test";
import {
  applyStress,
  buildEnhancementPlan,
  buildImpeccableHandoff,
  buildImpeccableRoutePlan,
  buildTasteComplianceFindings,
  buildTasteHandoffFromConfig,
  buildVisualScorecard,
  collectAssets,
  collectTokens,
  designIntentMarkdown,
  detectLayoutDefects,
  loadConfig,
  renderAestheticDiagnosis,
  renderEnhancementPlanReport,
  renderImpeccableHandoffReport,
  renderTasteHandoffLock,
  responsiveMatrixMarkdown,
  routingMarkdown,
  screenshotEvidence,
  VIEWPORTS,
  type VisualDefect
} from "../src/visual-proof";

test("loads visual-proof.config.ts", async () => {
  const config = await loadConfig();
  expect(config.baseUrl).toContain("http");
  expect(config.routes.length).toBeGreaterThan(0);
  expect(config.tasteIntent.designRead).toContain("Reading this as");
});

test("builds a design intent lock", async () => {
  const config = await loadConfig();
  const markdown = designIntentMarkdown(config);
  expect(markdown).toContain("# Design Intent Lock");
  expect(markdown).toContain("DESIGN_VARIANCE");
  expect(markdown).toContain("MOTION_INTENSITY");
  expect(markdown).toContain("VISUAL_DENSITY");
});

test("builds a Taste handoff lock", async () => {
  const config = await loadConfig();
  const handoff = buildTasteHandoffFromConfig(config);
  const markdown = renderTasteHandoffLock(handoff);
  expect(markdown).toContain("# Taste Handoff Lock");
  expect(markdown).toContain("Anti-slop Rules");
  expect(handoff.dials.designVariance).toBe(config.tasteIntent.designVariance);
});

test("defines required viewport matrix", () => {
  expect(VIEWPORTS.map((v) => `${v.width}x${v.height}`)).toEqual([
    "1440x900", "1280x800", "1024x768", "768x1024", "430x932", "390x844", "360x800"
  ]);
});

test("captures screenshot evidence for a fixture", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.setContent("<main><h1>Visual Proof</h1><button>Start</button></main>");
  const item = await screenshotEvidence(page, "fixture", "mobile-standard", "light");
  expect(item.screenshotPath).toContain("docs/visual-proof/screenshots/");
  expect(item.status).toBe("pass");
});

test("detects horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.setContent("<main><div style='width:900px'>Overflow</div></main>");
  const defects = await detectLayoutDefects(page, {
    route: "fixture",
    viewport: "mobile-small",
    section: "document",
    allowHorizontalScrollSelectors: [],
    allowClippingSelectors: []
  });
  expect(defects.some((d) => d.severity === "P0" && d.failingRule.includes("No Overflow"))).toBeTruthy();
});

test("applies content stress variant", async ({ page }) => {
  await page.setContent("<main><h1>Short</h1></main>");
  await applyStress(page, "h1", "将 AI 生成的初稿转化为可上线的高质量响应式视觉系统");
  await expect(page.locator("h1")).toContainText("高质量响应式视觉系统");
});

test("flags asset issues", async ({ page }) => {
  await page.setContent("<main><img src='/placeholder.png' width='400' height='300'></main>");
  const result = await collectAssets(page, "fixture");
  expect(result.defects.some((d) => d.kind === "asset")).toBeTruthy();
});

test("collects typography and color tokens", async ({ page }) => {
  await page.setContent(`<main style="color: rgb(17, 17, 17); font-family: Arial; padding: 24px"><h1 style="font-size: 48px; line-height: 1">Title</h1><p style="font-size: 16px; line-height: 1.5">Body</p></main>`);
  const ledger = await collectTokens(page) as { typography: { fontFamilies: string[] }, colors: { text: string[] } };
  expect(ledger.typography.fontFamilies.length).toBeGreaterThan(0);
  expect(ledger.colors.text.length).toBeGreaterThan(0);
});

test("builds responsive matrix markdown", () => {
  const markdown = responsiveMatrixMarkdown([
    { route: "home", section: "Hero", viewport: "desktop-wide", visible: true, width: 1000, height: 600, notes: "Visible" },
    { route: "home", section: "Hero", viewport: "mobile-small", visible: true, width: 360, height: 600, notes: "Visible" }
  ], []);
  expect(markdown).toContain("# Responsive Matrix");
  expect(markdown).toContain("Hero");
});

test("routes defects to Impeccable commands", () => {
  const defects: VisualDefect[] = [{
    id: "VP-001",
    severity: "P0",
    kind: "device",
    route: "home",
    title: "Mobile overflow",
    failingRule: "R3 No Overflow",
    likelyCause: "Fixed width",
    recommendedCommand: "/impeccable adapt home",
    mustFixBeforePolish: true
  }];
  const markdown = routingMarkdown(defects);
  expect(markdown).toContain("/impeccable adapt home");
  expect(markdown).toContain("/impeccable polish home");
});

test("builds visual scorecard, enhancement plan, and Impeccable handoff", async () => {
  const config = await loadConfig();
  const handoff = buildTasteHandoffFromConfig(config);
  const defects: VisualDefect[] = [];
  const findings = buildTasteComplianceFindings({ handoff, defects, assetRows: [], tokenLedgerExists: true });
  const scorecard = buildVisualScorecard({ defects, tasteFindings: findings, assetRows: [], stateRows: [], tokenLedgerExists: true });
  const plan = buildEnhancementPlan({ routeName: "home", defects, tasteFindings: findings, scorecard });
  const routePlan = buildImpeccableRoutePlan(defects);
  const handoffPack = buildImpeccableHandoff({ handoff, scorecard, enhancementPlan: plan, routePlan, defects });
  expect(renderAestheticDiagnosis({ scorecard, tasteFindings: findings })).toContain("# Aesthetic Diagnosis");
  expect(renderEnhancementPlanReport(plan)).toContain("# Enhancement Plan");
  expect(renderImpeccableHandoffReport(handoffPack)).toContain("# Impeccable Handoff");
});
