const baseUrl = process.env.LHCI_BASE_URL || process.env.VISUAL_PROOF_BASE_URL || "http://127.0.0.1:3000";

module.exports = {
  ci: {
    collect: {
      url: [baseUrl],
      numberOfRuns: 3,
      settings: { preset: "desktop", throttlingMethod: "simulate" }
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        "categories:performance": ["warn", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "unsized-images": "error",
        "uses-responsive-images": "warn",
        "modern-image-formats": "warn"
      }
    },
    upload: { target: "filesystem", outputDir: "./docs/visual-proof/lighthouse" }
  }
};
