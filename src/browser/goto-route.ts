import type { Page } from "@playwright/test";
import type { RouteConfig, VisualProofConfig } from "../contracts";

export async function gotoVisualProofRoute(
  page: Page,
  config: VisualProofConfig,
  route: RouteConfig
): Promise<void> {
  await page.goto(`${config.baseUrl}${route.path}`, { waitUntil: config.defaultWaitUntil ?? "networkidle" });
  if (route.readySelector) {
    await page.locator(route.readySelector).first().waitFor({ state: "visible", timeout: 90_000 });
  }
}

export const gotoRoute = gotoVisualProofRoute;
