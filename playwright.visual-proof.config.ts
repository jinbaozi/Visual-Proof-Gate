import { defineConfig } from "@playwright/test";

export default defineConfig({
  timeout: 120_000,
  expect: { timeout: 30_000 },
  use: {
    browserName: "chromium",
    actionTimeout: 90_000,
    navigationTimeout: 90_000,
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  reporter: [["list"], ["html", { outputFolder: "test-results/visual-proof-html", open: "never" }]],
  outputDir: "test-results/visual-proof"
});
