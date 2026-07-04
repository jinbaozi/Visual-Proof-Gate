import type { VisualProofConfig } from "./src/index";

const config: VisualProofConfig = {
  baseUrl: process.env.VISUAL_PROOF_BASE_URL ?? "http://127.0.0.1:3000",
  defaultWaitUntil: "networkidle",
  supportsDarkMode: true,
  supportsReducedMotion: true,
  allowHorizontalScrollSelectors: ["[data-vp-allow-horizontal-scroll]", ".marquee", ".carousel"],
  allowClippingSelectors: ["[data-vp-allow-clipping]", ".decorative-clip", ".background-orb"],
  tasteIntent: {
    designRead: "Reading this as: a premium landing page that needs screenshot-backed visual proof before Impeccable polish.",
    pageKind: "Landing",
    audience: "Product teams, founders, and frontend engineers",
    brandPosition: "Premium, precise, production-grade",
    designVariance: 7,
    motionIntensity: 5,
    visualDensity: 4,
    theme: "auto",
    typographyDirection: "Strong editorial hierarchy with readable body text",
    colorDirection: "Restrained neutral surfaces with one strategic accent",
    assetContract: [
      "Hero visual must be real, generated, or explicitly marked as missing",
      "Product screenshots must not be fake dashboard divs",
      "Logo wall must use real SVG/image marks or be removed"
    ],
    responsiveContract: [
      "Desktop may use expressive layout",
      "Tablet reduces asymmetry",
      "Mobile becomes single-column below 768px",
      "No unintended horizontal overflow"
    ]
  },
  routes: [
    {
      name: "home",
      path: "/",
      readySelector: "main, body",
      sections: [
        { name: "Hero", selector: "header, [data-section='hero'], main section:first-of-type" },
        { name: "Primary content", selector: "main, body" }
      ],
      stressTargets: [
        {
          name: "Primary headline",
          selector: "h1",
          variants: [
            "Transform raw AI-generated layouts into distinctive, responsive, production-ready visual systems",
            "将 AI 生成的初稿转化为可上线的高质量响应式视觉系统",
            "Donaudampfschifffahrtsgesellschaftskapitän"
          ]
        },
        {
          name: "Primary CTA",
          selector: "a[href], button",
          variants: ["Start now", "Schedule a comprehensive product design review"]
        }
      ],
      stateTargets: [
        { name: "Primary CTA hover", selector: "a[href], button", action: "hover" },
        { name: "Primary CTA focus", selector: "a[href], button", action: "focus" }
      ]
    }
  ]
};

export default config;
