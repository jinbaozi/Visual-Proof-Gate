import type { Page } from "@playwright/test";
import type { EvidenceItem, ThemeMode } from "../contracts";
import { ensureParent } from "../io";

export async function captureScreenshotToPath(page: Page, screenshotPath: string): Promise<void> {
  await ensureParent(screenshotPath);
  await page.screenshot({ path: screenshotPath, fullPage: true });
}

export async function captureScreenshotEvidence(
  page: Page,
  route: string,
  viewport: string,
  theme: ThemeMode
): Promise<EvidenceItem> {
  const screenshotPath = `docs/visual-proof/screenshots/${route}-${viewport}-${theme}.png`;
  await captureScreenshotToPath(page, screenshotPath);
  return { route, viewport, theme, screenshotPath, status: "pass", notes: [] };
}

export const screenshotEvidence = captureScreenshotEvidence;
