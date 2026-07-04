import type { Page } from "@playwright/test";
import type { ResponsiveObservation, RouteConfig } from "../../contracts";

export async function runResponsiveProbe(page: Page, route: RouteConfig, viewport: string): Promise<ResponsiveObservation[]> {
  return page.evaluate(({ routeName, sections, viewport }) => sections.map((section) => {
    const el = document.querySelector<HTMLElement>(section.selector);
    if (!el) return { route: routeName, section: section.name, viewport, visible: false, width: 0, height: 0, notes: `Selector not found: ${section.selector}` };
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return {
      route: routeName,
      section: section.name,
      viewport,
      visible: rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden",
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      notes: "checked"
    };
  }), { routeName: route.name, sections: route.sections, viewport });
}

export const collectResponsive = runResponsiveProbe;
