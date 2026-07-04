export interface VisualScorecard {
  overall: number;
  composition: number;
  typography: number;
  color: number;
  spacingRhythm: number;
  sectionVariety: number;
  assetRichness: number;
  motionPurpose: number;
  responsiveElegance: number;
  ctaClarity: number;
  brandDistinctiveness: number;
  blockers: string[];
  quickWins: string[];
}

export interface EnhancementCandidate {
  id: string;
  target: {
    route: string;
    section: string;
    selector?: string;
  };
  category:
    | "hero-composition"
    | "typography-ramp"
    | "palette-lock"
    | "spacing-rhythm"
    | "section-variety"
    | "asset-upgrade"
    | "motion-feedback"
    | "cta-clarity"
    | "responsive-elegance"
    | "taste-compliance";
  severity: "blocking" | "high-impact" | "polish";
  confidence: number;
  rationale: string;
  proposedChange: string;
  risk: "safe" | "moderate" | "risky";
  canAutoPatch: boolean;
  impeccableFallback: string;
}

export interface EnhancementPlan {
  mode: "diagnose-only";
  summary: string;
  candidates: EnhancementCandidate[];
}

export interface ImpeccableHandoff {
  projectRole: string;
  tasteIntentSummary: string;
  visualProofSummary: string;
  enhancementSummary: string;
  unresolvedRisks: string[];
  recommendedCommands: string[];
}
