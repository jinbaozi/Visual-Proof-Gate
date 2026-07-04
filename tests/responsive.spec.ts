import { test, expect } from "@playwright/test";
import { detectLayoutDefects, gotoRoute, loadConfig, VIEWPORTS } from "../src/visual-proof";

test.describe("responsive no-overflow gate", () => {
  for (const viewport of VIEWPORTS) {
    test(`no P0 overflow at ${viewport.name}`, async ({ page }) => {
      const config = await loadConfig();
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      for (const route of config.routes) {
        await gotoRoute(page, config, route);
        const defects = await detectLayoutDefects(page, {
          route: route.name,
          viewport: viewport.name,
          section: "document",
          allowHorizontalScrollSelectors: config.allowHorizontalScrollSelectors,
          allowClippingSelectors: config.allowClippingSelectors
        });
        expect(defects.filter((d) => d.severity === "P0")).toEqual([]);
      }
    });
  }
});
