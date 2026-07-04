import type { DefectKind, DefectSeverity } from "./primitives";

export interface VisualDefect {
  id: string;
  severity: DefectSeverity;
  kind: DefectKind;
  route: string;
  viewport?: string;
  section?: string;
  title: string;
  evidence?: string;
  failingRule: string;
  likelyCause: string;
  recommendedCommand: string;
  mustFixBeforePolish: boolean;
}
