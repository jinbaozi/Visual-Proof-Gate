import type { ThemeMode } from "./primitives";

export interface EvidenceItem {
  route: string;
  viewport: string;
  theme: ThemeMode;
  screenshotPath: string;
  status: "pass" | "fail";
  notes: string[];
}

export interface ResponsiveObservation {
  route: string;
  section: string;
  viewport: string;
  visible: boolean;
  width: number;
  height: number;
  notes: string;
}

export interface AssetLedgerItem {
  placement: string;
  requiredAsset: string;
  currentAsset: string;
  status: "pass" | "fail" | "review";
  action: string;
}

export interface StateMatrixRow {
  component: string;
  state: string;
  screenshot: string;
  status: "pass" | "fail" | "review";
  notes: string;
}

export interface TokenLedger {
  colors: {
    text: string[];
    background: string[];
    border: string[];
  };
  typography: {
    fontFamilies: string[];
    fontSizes: string[];
    lineHeights: string[];
    fontWeights: string[];
  };
  spacing: string[];
  radius: string[];
  shadow: string[];
  zIndex: string[];
  motion: {
    durations: string[];
    timingFunctions: string[];
  };
}
