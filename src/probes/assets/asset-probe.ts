import type { Page } from "@playwright/test";
import type { VisualDefect } from "../../contracts";
import { nextDefectId } from "../defect-id";

export async function runAssetProbe(page: Page, route: string): Promise<{ rows: string[][]; defects: VisualDefect[] }> {
  const raw = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img")).map((img, index) => ({
      type: "img",
      placement: img.closest("section, header, main")?.tagName.toLowerCase() ?? `image-${index + 1}`,
      src: img.currentSrc || img.src || "",
      alt: img.getAttribute("alt"),
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height
    }));
    const fake = Array.from(document.querySelectorAll<HTMLElement>("[class*='fake'], [class*='placeholder'], [data-fake], [data-placeholder]")).map((el, index) => ({
      type: "placeholder",
      placement: el.closest("section, header, main")?.tagName.toLowerCase() ?? `placeholder-${index + 1}`,
      src: el.className.toString(),
      alt: el.getAttribute("aria-label"),
      width: Math.round(el.getBoundingClientRect().width),
      height: Math.round(el.getBoundingClientRect().height)
    }));
    return [...imgs, ...fake];
  });

  const rows: string[][] = [];
  const defects: VisualDefect[] = [];
  for (const item of raw) {
    const missingAlt = item.type === "img" && item.alt === null;
    const placeholder = /placeholder|fake|dummy|sample|mock/i.test(`${item.src} ${item.alt ?? ""}`);
    const unsized = item.type === "img" && (item.width <= 0 || item.height <= 0);
    const status = missingAlt || placeholder || unsized ? "fail" : "pass";
    const action = missingAlt ? "Add alt text or mark decorative" : placeholder ? "Replace fake/placeholder asset" : unsized ? "Add fixed intrinsic dimensions" : "Keep";
    rows.push([item.placement, item.type === "img" ? "Accessible, sized image" : "No fake product visual", `${item.type}: ${item.src}`, status, action]);
    if (status === "fail") {
      defects.push({
        id: nextDefectId(),
        severity: "P1",
        kind: "asset",
        route,
        title: `Asset issue in ${item.placement}`,
        failingRule: "R6 Asset Ledger",
        likelyCause: action,
        recommendedCommand: `/impeccable harden ${route}`,
        mustFixBeforePolish: true
      });
    }
  }
  return { rows, defects };
}

export const collectAssets = runAssetProbe;
