export interface TasteHandoffDialSet {
  designVariance: number;
  motionIntensity: number;
  visualDensity: number;
}

export interface TasteVisualLanguage {
  typographyDirection: string;
  colorDirection: string;
  layoutDirection: string;
  motionDirection: string;
  materialDirection: string;
}

export interface TasteSectionStrategy {
  name: string;
  intendedRole: string;
  visualPattern: string;
  density: "airy" | "balanced" | "dense";
  assetRequirement: "required" | "optional" | "none";
}

export interface TasteAssetAssumption {
  placement: string;
  expectedAsset: string;
  currentStatus: "real" | "generated" | "placeholder" | "missing";
}

export interface TasteHandoff {
  designRead: string;
  pageKind: string;
  audience: string;
  brandPosition: string;
  dials: TasteHandoffDialSet;
  visualLanguage: TasteVisualLanguage;
  sectionStrategy: TasteSectionStrategy[];
  antiSlopRules: string[];
  assetAssumptions: TasteAssetAssumption[];
  knownRisks: string[];
}

export interface TasteComplianceFinding {
  id: string;
  status: "pass" | "fail" | "review";
  category: "design-read" | "dial-alignment" | "anti-slop" | "asset" | "responsive";
  title: string;
  evidence?: string;
  recommendation: string;
  impeccableFallback: string;
}
