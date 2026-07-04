import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { gotoRoute, loadConfig } from "../src/visual-proof";

test("routes have no critical or serious axe violations", async ({ page }) => {
  const config = await loadConfig();
  for (const route of config.routes) {
    await gotoRoute(page, config, route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze();
    const blocking = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  }
});
