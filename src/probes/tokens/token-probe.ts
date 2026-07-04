import type { Page } from "@playwright/test";
import type { TokenLedger } from "../../contracts";

export async function runTokenProbe(page: Page): Promise<TokenLedger> {
  return page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      })
      .slice(0, 500);
    const styles = elements.map((el) => getComputedStyle(el));
    const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean))).sort();
    return {
      colors: {
        text: unique(styles.map((style) => style.color)),
        background: unique(styles.map((style) => style.backgroundColor).filter((value) => value !== "rgba(0, 0, 0, 0)")),
        border: unique(styles.map((style) => style.borderColor))
      },
      typography: {
        fontFamilies: unique(styles.map((style) => style.fontFamily)),
        fontSizes: unique(styles.map((style) => style.fontSize)),
        lineHeights: unique(styles.map((style) => style.lineHeight)),
        fontWeights: unique(styles.map((style) => style.fontWeight))
      },
      spacing: unique(styles.flatMap((style) => [style.marginTop, style.marginRight, style.marginBottom, style.marginLeft, style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft])),
      radius: unique(styles.flatMap((style) => [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius])),
      shadow: unique(styles.map((style) => style.boxShadow).filter((value) => value !== "none")),
      zIndex: unique(styles.map((style) => style.zIndex).filter((value) => value !== "auto")),
      motion: {
        durations: unique(styles.map((style) => style.transitionDuration).filter((value) => value !== "0s")),
        timingFunctions: unique(styles.map((style) => style.transitionTimingFunction).filter((value) => value !== "ease"))
      }
    };
  });
}

export const collectTokens = runTokenProbe;
