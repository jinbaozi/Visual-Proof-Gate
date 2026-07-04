export interface ResponsiveProbeInput {
  routeName: string;
  sections: Array<{ name: string; selector: string }>;
  viewport: string;
}
