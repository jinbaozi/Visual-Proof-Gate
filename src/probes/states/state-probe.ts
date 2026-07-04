import type { Page } from "@playwright/test";
import type { InteractionStateTarget, VisualDefect } from "../../contracts";
import { captureScreenshotToPath } from "../../browser";
import { nextDefectId } from "../defect-id";

export async function runStateProbe(
  page: Page,
  route: string,
  viewport: string,
  targets: InteractionStateTarget[]
): Promise<{ rows: string[][]; defects: VisualDefect[] }> {
  const rows: string[][] = [];
  const defects: VisualDefect[] = [];
  for (const target of targets) {
    const locator = page.locator(target.selector).first();
    if (await locator.count() === 0) {
      rows.push([target.name, target.action, "", "fail", `Selector not found: ${target.selector}`]);
      defects.push({ id: nextDefectId(), severity: "P1", kind: "state", route, viewport, title: `State target missing: ${target.name}`, failingRule: "R8 Interaction State Matrix", likelyCause: "Selector not present", recommendedCommand: `/impeccable harden ${route}`, mustFixBeforePolish: true });
      continue;
    }
    if (target.action === "hover") await locator.hover();
    if (target.action === "focus") await locator.focus();
    if (target.action === "click" || target.action === "open-mobile-nav") await locator.click();
    if (target.action === "type-error") {
      await locator.fill("invalid-value-that-should-trigger-error");
      await locator.press("Tab");
    }
    const file = `docs/visual-proof/screenshots/state-${route}-${viewport}-${target.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
    await captureScreenshotToPath(page, file);
    rows.push([target.name, target.action, file, "pass", "Captured"]);
  }
  return { rows, defects };
}

export const captureStates = runStateProbe;
