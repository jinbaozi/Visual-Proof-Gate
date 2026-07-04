export interface SectionConfig {
  name: string;
  selector: string;
}

export interface StressTarget {
  name: string;
  selector: string;
  variants: string[];
}

export interface InteractionStateTarget {
  name: string;
  selector: string;
  action: "hover" | "focus" | "click" | "open-mobile-nav" | "type-error";
}

export interface RouteConfig {
  name: string;
  path: string;
  readySelector?: string;
  sections: SectionConfig[];
  stressTargets: StressTarget[];
  stateTargets: InteractionStateTarget[];
}

export interface TasteIntent {
  designRead: string;
  pageKind: string;
  audience: string;
  brandPosition: string;
  designVariance: number;
  motionIntensity: number;
  visualDensity: number;
  theme: "light" | "dark" | "auto";
  typographyDirection: string;
  colorDirection: string;
  assetContract: string[];
  responsiveContract: string[];
}

export interface VisualProofConfig {
  baseUrl: string;
  defaultWaitUntil?: "load" | "domcontentloaded" | "networkidle";
  supportsDarkMode: boolean;
  supportsReducedMotion: boolean;
  allowHorizontalScrollSelectors: string[];
  allowClippingSelectors: string[];
  tasteIntent: TasteIntent;
  routes: RouteConfig[];
}
