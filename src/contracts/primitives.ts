export type DefectSeverity = "P0" | "P1" | "P2";
export type Severity = DefectSeverity;

export type DefectKind =
  | "typography"
  | "layout"
  | "color"
  | "motion"
  | "device"
  | "asset"
  | "content"
  | "state"
  | "accessibility"
  | "performance"
  | "responsive"
  | "broad-quality";

export type ThemeMode = "light" | "dark";
