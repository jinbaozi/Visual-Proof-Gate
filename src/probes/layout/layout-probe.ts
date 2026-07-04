import type { Page } from "@playwright/test";
import type { VisualDefect } from "../../contracts";
import { nextDefectId } from "../defect-id";
import type { LayoutProbeInput } from "./layout.types";

export async function runLayoutProbe(page: Page, input: LayoutProbeInput): Promise<VisualDefect[]> {
  const raw = await page.evaluate(({ allowHorizontalScrollSelectors, allowClippingSelectors }) => {
    const doc = document.documentElement;
    const body = document.body;
    const horizontalOverflow = doc.scrollWidth > doc.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1;
    const visible = Array.from(document.querySelectorAll<HTMLElement>("body *")).filter((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
    });
    const allowedX = (el: Element) => allowHorizontalScrollSelectors.some((selector) => el.matches(selector) || Boolean(el.closest(selector)));
    const allowedClip = (el: Element) => allowClippingSelectors.some((selector) => el.matches(selector) || Boolean(el.closest(selector)));
    const clipped = visible.filter((el) => {
      const s = getComputedStyle(el);
      const clips = [s.overflow, s.overflowX, s.overflowY].some((v) => v === "hidden" || v === "clip");
      return !allowedClip(el) && clips && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1);
    }).slice(0, 8).map((el) => el.tagName.toLowerCase());
    const outOfViewport = visible.filter((el) => {
      if (allowedX(el)) return false;
      const r = el.getBoundingClientRect();
      return r.left < -1 || r.right > window.innerWidth + 1;
    }).slice(0, 8).map((el) => el.tagName.toLowerCase());
    const blockedInteractives = Array.from(document.querySelectorAll<HTMLElement>("a[href], button, input, textarea, select, [role='button']")).filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return false;
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      if (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) return true;
      const top = document.elementFromPoint(x, y);
      return top !== el && !el.contains(top) && !top?.contains(el);
    }).slice(0, 8).map((el) => el.tagName.toLowerCase());
    return { horizontalOverflow, clipped, outOfViewport, blockedInteractives };
  }, { allowHorizontalScrollSelectors: input.allowHorizontalScrollSelectors, allowClippingSelectors: input.allowClippingSelectors });

  const defects: VisualDefect[] = [];
  const common = { route: input.route, viewport: input.viewport, section: input.section, evidence: input.evidence };
  if (raw.horizontalOverflow) defects.push({ id: nextDefectId(), severity: "P0", kind: "device", ...common, title: "Unintended horizontal overflow detected", failingRule: "R3 No Overflow", likelyCause: "Fixed-width element, oversized asset, or grid without mobile fallback", recommendedCommand: `/impeccable adapt ${input.route}`, mustFixBeforePolish: true });
  for (const tag of raw.clipped) defects.push({ id: nextDefectId(), severity: "P1", kind: "content", ...common, title: `Visible content appears clipped in ${tag}`, failingRule: "R3 No unintended text or content clipping", likelyCause: "overflow hidden/clip with insufficient container size", recommendedCommand: `/impeccable harden ${input.route}`, mustFixBeforePolish: true });
  for (const tag of raw.outOfViewport) defects.push({ id: nextDefectId(), severity: "P1", kind: "layout", ...common, title: `Element extends beyond viewport: ${tag}`, failingRule: "R3 Element bounds must stay within viewport unless allowlisted", likelyCause: "Absolute positioning or width larger than viewport", recommendedCommand: `/impeccable layout ${input.route}`, mustFixBeforePolish: true });
  for (const tag of raw.blockedInteractives) defects.push({ id: nextDefectId(), severity: "P0", kind: "state", ...common, title: `Interactive element may be blocked: ${tag}`, failingRule: "R3 Interactive elements must be reachable", likelyCause: "Overlay, z-index, sticky header, or offscreen positioning", recommendedCommand: `/impeccable harden ${input.route}`, mustFixBeforePolish: true });
  return defects;
}

export const detectLayoutDefects = runLayoutProbe;
