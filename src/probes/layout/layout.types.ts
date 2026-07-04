export interface LayoutProbeInput {
  route: string;
  viewport: string;
  section: string;
  allowHorizontalScrollSelectors: string[];
  allowClippingSelectors: string[];
  evidence?: string;
}
