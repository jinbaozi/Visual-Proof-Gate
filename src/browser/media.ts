import type { Page } from "@playwright/test";
import type { ThemeMode } from "../contracts";

export async function applyVisualMedia(
  page: Page,
  input: { theme: ThemeMode; reducedMotion: boolean }
): Promise<void> {
  await page.emulateMedia({
    colorScheme: input.theme,
    reducedMotion: input.reducedMotion ? "reduce" : "no-preference"
  });
}
