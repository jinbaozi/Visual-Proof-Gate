import type { Page } from "@playwright/test";
import type { RouteConfig, VisualDefect } from "../../contracts";
import { runLayoutProbe } from "../layout/layout-probe";

export async function applyStress(page: Page, selector: string, value: string): Promise<void> {
  await page.evaluate(({ selector, value }) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.value = value;
    else el.innerText = value;
  }, { selector, value });
}

export async function runContentStressProbe(
  page: Page,
  route: RouteConfig,
  input: { routeName: string; viewportName: string; allowHorizontalScrollSelectors: string[]; allowClippingSelectors: string[] }
): Promise<{ results: string[]; defects: VisualDefect[] }> {
  const defects: VisualDefect[] = [];
  const results: string[] = [];
  for (const target of route.stressTargets) {
    for (const variant of target.variants) {
      await applyStress(page, target.selector, variant);
      results.push(`${input.routeName}/${input.viewportName}/${target.name}: ${variant.slice(0, 80)}`);
      defects.push(...await runLayoutProbe(page, {
        route: input.routeName,
        viewport: input.viewportName,
        section: target.name,
        allowHorizontalScrollSelectors: input.allowHorizontalScrollSelectors,
        allowClippingSelectors: input.allowClippingSelectors
      }));
    }
  }
  return { results, defects };
}

export const runStress = runContentStressProbe;
