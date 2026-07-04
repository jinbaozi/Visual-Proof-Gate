export interface ViewportConfig {
  name: string;
  width: number;
  height: number;
}

export const VIEWPORTS: ViewportConfig[] = [
  { name: "desktop-wide", width: 1440, height: 900 },
  { name: "desktop-standard", width: 1280, height: 800 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "mobile-large", width: 430, height: 932 },
  { name: "mobile-standard", width: 390, height: 844 },
  { name: "mobile-small", width: 360, height: 800 }
];

export function viewportFamily(name: string): "desktop" | "tablet" | "mobile" {
  if (name.startsWith("desktop")) return "desktop";
  if (name.startsWith("tablet")) return "tablet";
  return "mobile";
}
