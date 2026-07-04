import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { Page } from "@playwright/test";

export type Severity = "P0" | "P1" | "P2";
export type DefectKind = "typography" | "layout" | "color" | "motion" | "device" | "asset" | "content" | "state" | "accessibility" | "performance" | "responsive" | "broad-quality";
export type ThemeMode = "light" | "dark";

export interface ViewportConfig { name: string; width: number; height: number }
export interface SectionConfig { name: string; selector: string }
export interface StressTarget { name: string; selector: string; variants: string[] }
export interface InteractionStateTarget { name: string; selector: string; action: "hover" | "focus" | "click" | "open-mobile-nav" | "type-error" }
export interface RouteConfig { name: string; path: string; readySelector?: string; sections: SectionConfig[]; stressTargets: StressTarget[]; stateTargets: InteractionStateTarget[] }

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

export interface EvidenceItem { route: string; viewport: string; theme: ThemeMode; screenshotPath: string; status: "pass" | "fail"; notes: string[] }
export interface VisualDefect {
  id: string;
  severity: Severity;
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

export const VIEWPORTS: ViewportConfig[] = [
  { name: "desktop-wide", width: 1440, height: 900 },
  { name: "desktop-standard", width: 1280, height: 800 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "mobile-large", width: 430, height: 932 },
  { name: "mobile-standard", width: 390, height: 844 },
  { name: "mobile-small", width: 360, height: 800 }
];

let defectCounter = 0;
export function resetDefects(): void { defectCounter = 0; }
export function nextDefectId(): string { defectCounter += 1; return `VP-${String(defectCounter).padStart(3, "0")}`; }
export function viewportFamily(name: string): "desktop" | "tablet" | "mobile" {
  if (name.startsWith("desktop")) return "desktop";
  if (name.startsWith("tablet")) return "tablet";
  return "mobile";
}

export async function ensureDir(dir: string): Promise<void> { await fs.mkdir(dir, { recursive: true }); }
export async function ensureParent(filePath: string): Promise<void> { await ensureDir(path.dirname(filePath)); }
export async function cleanDir(dir: string): Promise<void> { await fs.rm(dir, { recursive: true, force: true }); await ensureDir(dir); }
export async function writeMarkdown(filePath: string, body: string): Promise<void> { await ensureParent(filePath); await fs.writeFile(filePath, body.endsWith("\n") ? body : `${body}\n`, "utf8"); }
export async function writeJson(filePath: string, data: unknown): Promise<void> { await ensureParent(filePath); await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8"); }

export function table(headers: string[], rows: string[][]): string {
  const esc = (v: string) => String(v ?? "").replace(/\|/g, "\\|").replace(/\n/g, "<br>");
  return [`| ${headers.map(esc).join(" | ")} |`, `| ${headers.map(() => "---").join(" | ")} |`, ...rows.map((row) => `| ${row.map(esc).join(" | ")} |`)].join("\n");
}

export async function loadConfig(): Promise<VisualProofConfig> {
  const configPath = path.resolve(process.cwd(), "visual-proof.config.ts");
  const imported = await import(pathToFileURL(configPath).href);
  const config = imported.default as VisualProofConfig;
  if (!config?.baseUrl) throw new Error("visual-proof.config.ts must export baseUrl");
  if (!config.tasteIntent?.designRead?.startsWith("Reading this as")) throw new Error("tasteIntent.designRead must start with 'Reading this as'");
  if (!Array.isArray(config.routes) || config.routes.length === 0) throw new Error("At least one route is required");
  return config;
}

export function designIntentMarkdown(config: VisualProofConfig): string {
  const i = config.tasteIntent;
  return [
    "# Design Intent Lock", "",
    "## Taste Design Read", i.designRead, "",
    "## Page Kind", i.pageKind, "",
    "## Audience", i.audience, "",
    "## Brand Position", i.brandPosition, "",
    "## Dials", `- DESIGN_VARIANCE: ${i.designVariance}/10`, `- MOTION_INTENSITY: ${i.motionIntensity}/10`, `- VISUAL_DENSITY: ${i.visualDensity}/10`, "",
    "## Theme", i.theme, "",
    "## Typography Direction", i.typographyDirection, "",
    "## Color Direction", i.colorDirection, "",
    "## Visual Asset Contract", ...i.assetContract.map((x) => `- ${x}`), "",
    "## Responsive Contract", ...i.responsiveContract.map((x) => `- ${x}`), "",
    "## Route Coverage", ...config.routes.map((r) => `- ${r.name}: ${r.path}`)
  ].join("\n");
}

export async function screenshotEvidence(page: Page, route: string, viewport: string, theme: ThemeMode): Promise<EvidenceItem> {
  const screenshotPath = `docs/visual-proof/screenshots/${route}-${viewport}-${theme}.png`;
  await ensureParent(screenshotPath);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return { route, viewport, theme, screenshotPath, status: "pass", notes: [] };
}

export async function detectLayoutDefects(page: Page, input: { route: string; viewport: string; section: string; allowHorizontalScrollSelectors: string[]; allowClippingSelectors: string[]; evidence?: string }): Promise<VisualDefect[]> {
  const raw = await page.evaluate(({ allowHorizontalScrollSelectors, allowClippingSelectors }) => {
    const doc = document.documentElement;
    const body = document.body;
    const horizontalOverflow = doc.scrollWidth > doc.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1;
    const visible = Array.from(document.querySelectorAll<HTMLElement>("body *")).filter((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
    });
    const allowedX = (el: Element) => allowHorizontalScrollSelectors.some((selector) => el.matches(selector) || Boolean(el.closest(selector)));
    const allowedClip = (el: Element) => allowClippingSelectors.some((selector) => el.matches(selector) || Boolean(el.closest(selector)));
    const clipped = visible.filter((el) => {
      const s = getComputedStyle(el);
      const clips = [s.overflow, s.overflowX, s.overflowY].some((v) => v === "hidden" || v === "clip");
      return !allowedClip(el) && clips && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1);
    }).slice(0, 8).map((el) => el.tagName.toLowerCase());
    const outOfViewport = visible.filter((el) => {
      if (allowedX(el)) return false;
      const r = el.getBoundingClientRect();
      return r.left < -1 || r.right > window.innerWidth + 1;
    }).slice(0, 8).map((el) => el.tagName.toLowerCase());
    const blockedInteractives = Array.from(document.querySelectorAll<HTMLElement>("a[href], button, input, textarea, select, [role='button']")).filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return false;
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      if (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) return true;
      const top = document.elementFromPoint(x, y);
      return top !== el && !el.contains(top) && !top?.contains(el);
    }).slice(0, 8).map((el) => el.tagName.toLowerCase());
    return { horizontalOverflow, clipped, outOfViewport, blockedInteractives };
  }, { allowHorizontalScrollSelectors: input.allowHorizontalScrollSelectors, allowClippingSelectors: input.allowClippingSelectors });

  const defects: VisualDefect[] = [];
  const common = { route: input.route, viewport: input.viewport, section: input.section, evidence: input.evidence };
  if (raw.horizontalOverflow) defects.push({ id: nextDefectId(), severity: "P0", kind: "device", ...common, title: "Unintended horizontal overflow detected", failingRule: "R3 No Overflow", likelyCause: "Fixed-width element, oversized asset, or grid without mobile fallback", recommendedCommand: `/impeccable adapt ${input.route}`, mustFixBeforePolish: true });
  for (const tag of raw.clipped) defects.push({ id: nextDefectId(), severity: "P1", kind: "content", ...common, title: `Visible content appears clipped in ${tag}`, failingRule: "R3 No unintended text or content clipping", likelyCause: "overflow hidden/clip with insufficient container size", recommendedCommand: `/impeccable harden ${input.route}`, mustFixBeforePolish: true });
  for (const tag of raw.outOfViewport) defects.push({ id: nextDefectId(), severity: "P1", kind: "layout", ...common, title: `Element extends beyond viewport: ${tag}`, failingRule: "R3 Element bounds must stay within viewport unless allowlisted", likelyCause: "Absolute positioning or width larger than viewport", recommendedCommand: `/impeccable layout ${input.route}`, mustFixBeforePolish: true });
  for (const tag of raw.blockedInteractives) defects.push({ id: nextDefectId(), severity: "P0", kind: "state", ...common, title: `Interactive element may be blocked: ${tag}`, failingRule: "R3 Interactive elements must be reachable", likelyCause: "Overlay, z-index, sticky header, or offscreen positioning", recommendedCommand: `/impeccable harden ${input.route}`, mustFixBeforePolish: true });
  return defects;
}

export async function collectResponsive(page: Page, route: RouteConfig, viewport: string): Promise<Array<{ route: string; section: string; viewport: string; visible: boolean; width: number; height: number; notes: string }>> {
  return page.evaluate(({ routeName, sections, viewport }) => sections.map((section) => {
    const el = document.querySelector<HTMLElement>(section.selector);
    if (!el) return { route: routeName, section: section.name, viewport, visible: false, width: 0, height: 0, notes: `Selector not found: ${section.selector}` };
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return { route: routeName, section: section.name, viewport, visible: r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden", width: Math.round(r.width), height: Math.round(r.height), notes: "checked" };
  }), { routeName: route.name, sections: route.sections, viewport });
}

export function responsiveMatrixMarkdown(observations: Awaited<ReturnType<typeof collectResponsive>>, defects: VisualDefect[]): string {
  const keys = Array.from(new Set(observations.map((o) => `${o.route}::${o.section}`)));
  const rows = keys.map((key) => {
    const [route, section] = key.split("::");
    const obs = observations.filter((o) => o.route === route && o.section === section);
    const related = defects.filter((d) => d.route === route && (d.section === section || d.section === "document"));
    const family = (f: "desktop" | "tablet" | "mobile") => {
      const familyObs = obs.filter((o) => viewportFamily(o.viewport) === f);
      if (familyObs.some((o) => !o.visible)) return "missing section";
      if (related.some((d) => d.viewport && viewportFamily(d.viewport) === f && (d.severity === "P0" || d.severity === "P1"))) return "has defects";
      return "checked";
    };
    const status = obs.some((o) => !o.visible) || related.some((d) => d.severity === "P0" || d.severity === "P1") ? "fail" : "pass";
    const notes = status === "pass" ? "No blocking responsive defects detected" : related.map((d) => `${d.id}: ${d.title}`).join("; ") || "Section missing in one or more viewport";
    return [route, section, family("desktop"), family("tablet"), family("mobile"), status, notes];
  });
  return ["# Responsive Matrix", "", table(["Route", "Section", "Desktop", "Tablet", "Mobile", "Status", "Notes"], rows)].join("\n");
}

export async function applyStress(page: Page, selector: string, value: string): Promise<void> {
  await page.evaluate(({ selector, value }) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.value = value;
    else el.innerText = value;
  }, { selector, value });
}

export async function runStress(page: Page, route: RouteConfig, input: { routeName: string; viewportName: string; allowHorizontalScrollSelectors: string[]; allowClippingSelectors: string[] }): Promise<{ results: string[]; defects: VisualDefect[] }> {
  const defects: VisualDefect[] = [];
  const results: string[] = [];
  for (const target of route.stressTargets) {
    for (const variant of target.variants) {
      await applyStress(page, target.selector, variant);
      results.push(`${input.routeName}/${input.viewportName}/${target.name}: ${variant.slice(0, 80)}`);
      defects.push(...await detectLayoutDefects(page, { route: input.routeName, viewport: input.viewportName, section: target.name, allowHorizontalScrollSelectors: input.allowHorizontalScrollSelectors, allowClippingSelectors: input.allowClippingSelectors }));
    }
  }
  return { results, defects };
}

export async function collectAssets(page: Page, route: string): Promise<{ rows: string[][]; defects: VisualDefect[] }> {
  const raw = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img")).map((img, i) => ({ type: "img", placement: img.closest("section, header, main")?.tagName.toLowerCase() ?? `image-${i + 1}`, src: img.currentSrc || img.src || "", alt: img.getAttribute("alt"), width: img.naturalWidth || img.width, height: img.naturalHeight || img.height }));
    const fake = Array.from(document.querySelectorAll<HTMLElement>("[class*='fake'], [class*='placeholder'], [data-fake], [data-placeholder]")).map((el, i) => ({ type: "placeholder", placement: el.closest("section, header, main")?.tagName.toLowerCase() ?? `placeholder-${i + 1}`, src: el.className.toString(), alt: el.getAttribute("aria-label"), width: Math.round(el.getBoundingClientRect().width), height: Math.round(el.getBoundingClientRect().height) }));
    return [...imgs, ...fake];
  });
  const rows: string[][] = [];
  const defects: VisualDefect[] = [];
  for (const item of raw) {
    const missingAlt = item.type === "img" && item.alt === null;
    const placeholder = /placeholder|fake|dummy|sample|mock/i.test(`${item.src} ${item.alt ?? ""}`);
    const unsized = item.type === "img" && (item.width <= 0 || item.height <= 0);
    const status = missingAlt || placeholder || unsized ? "fail" : "pass";
    const action = missingAlt ? "Add alt text or mark decorative" : placeholder ? "Replace fake/placeholder asset" : unsized ? "Add fixed intrinsic dimensions" : "Keep";
    rows.push([item.placement, item.type === "img" ? "Accessible, sized image" : "No fake product visual", `${item.type}: ${item.src}`, status, action]);
    if (status === "fail") defects.push({ id: nextDefectId(), severity: "P1", kind: "asset", route, title: `Asset issue in ${item.placement}`, failingRule: "R6 Asset Ledger", likelyCause: action, recommendedCommand: `/impeccable harden ${route}`, mustFixBeforePolish: true });
  }
  return { rows, defects };
}

export async function collectTokens(page: Page): Promise<Record<string, unknown>> {
  return page.evaluate(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("body *")).filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).slice(0, 500);
    const styles = els.map((el) => getComputedStyle(el));
    const uniq = (v: string[]) => Array.from(new Set(v.filter(Boolean))).sort();
    return {
      colors: { text: uniq(styles.map((s) => s.color)), background: uniq(styles.map((s) => s.backgroundColor).filter((v) => v !== "rgba(0, 0, 0, 0)")), border: uniq(styles.map((s) => s.borderColor)) },
      typography: { fontFamilies: uniq(styles.map((s) => s.fontFamily)), fontSizes: uniq(styles.map((s) => s.fontSize)), lineHeights: uniq(styles.map((s) => s.lineHeight)), fontWeights: uniq(styles.map((s) => s.fontWeight)) },
      spacing: uniq(styles.flatMap((s) => [s.marginTop, s.marginRight, s.marginBottom, s.marginLeft, s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft])),
      radius: uniq(styles.flatMap((s) => [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius])),
      shadow: uniq(styles.map((s) => s.boxShadow).filter((v) => v !== "none")),
      zIndex: uniq(styles.map((s) => s.zIndex).filter((v) => v !== "auto")),
      motion: { durations: uniq(styles.map((s) => s.transitionDuration).filter((v) => v !== "0s")), timingFunctions: uniq(styles.map((s) => s.transitionTimingFunction).filter((v) => v !== "ease")) }
    };
  });
}

export async function captureStates(page: Page, route: string, viewport: string, targets: InteractionStateTarget[]): Promise<{ rows: string[][]; defects: VisualDefect[] }> {
  const rows: string[][] = [];
  const defects: VisualDefect[] = [];
  for (const target of targets) {
    const locator = page.locator(target.selector).first();
    if (await locator.count() === 0) {
      rows.push([target.name, target.action, "", "fail", `Selector not found: ${target.selector}`]);
      defects.push({ id: nextDefectId(), severity: "P1", kind: "state", route, viewport, title: `State target missing: ${target.name}`, failingRule: "R8 Interaction State Matrix", likelyCause: "Selector not present", recommendedCommand: `/impeccable harden ${route}`, mustFixBeforePolish: true });
      continue;
    }
    if (target.action === "hover") await locator.hover();
    if (target.action === "focus") await locator.focus();
    if (target.action === "click" || target.action === "open-mobile-nav") await locator.click();
    if (target.action === "type-error") { await locator.fill("invalid-value-that-should-trigger-error"); await locator.press("Tab"); }
    const file = `docs/visual-proof/screenshots/state-${route}-${viewport}-${target.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
    await ensureParent(file);
    await page.screenshot({ path: file, fullPage: true });
    rows.push([target.name, target.action, file, "pass", "Captured"]);
  }
  return { rows, defects };
}

export function defectBacklogMarkdown(defects: VisualDefect[]): string {
  return ["# Defect Backlog", "", ...(["P0", "P1", "P2"] as const).flatMap((severity) => {
    const group = defects.filter((d) => d.severity === severity);
    return [`## ${severity}`, "", group.length ? group.map((d) => [`### ${d.id} ${d.title}`, `- Kind: ${d.kind}`, `- Route: ${d.route}`, `- Viewport: ${d.viewport ?? "all"}`, `- Section: ${d.section ?? "unknown"}`, `- Evidence: ${d.evidence ?? "see reports"}`, `- Failing rule: ${d.failingRule}`, `- Likely cause: ${d.likelyCause}`, `- Recommended command: ${d.recommendedCommand}`, `- Must fix before polish: ${d.mustFixBeforePolish ? "yes" : "no"}`].join("\n")).join("\n\n") : "No defects.", ""];
  })].join("\n");
}

export function routingMarkdown(defects: VisualDefect[]): string {
  const blocking = defects.filter((d) => d.severity === "P0" || d.severity === "P1");
  const commands = Array.from(new Set(blocking.map((d) => d.recommendedCommand)));
  const routes = Array.from(new Set(defects.map((d) => d.route)));
  for (const route of routes) { commands.push(`/impeccable audit ${route}`); commands.push(`/impeccable polish ${route}`); }
  return ["# Impeccable Routing", "", blocking.length ? "Status: FAIL — resolve P0/P1 defects before final polish." : "Status: PASS — proceed to audit and polish.", "", "## Recommended sequence", "", ...commands.map((c, i) => `${i + 1}. \`${c}\``), "", "## Blocking defects", "", ...(blocking.length ? blocking.map((d) => `- ${d.id}: ${d.title} → \`${d.recommendedCommand}\``) : ["No blocking defects."])].join("\n");
}

export async function gotoRoute(page: Page, config: VisualProofConfig, route: RouteConfig): Promise<void> {
  await page.goto(`${config.baseUrl}${route.path}`, { waitUntil: config.defaultWaitUntil ?? "networkidle" });
  if (route.readySelector) await page.locator(route.readySelector).first().waitFor({ state: "visible", timeout: 90_000 });
}

export async function runVisualProofGate(page: Page, config: VisualProofConfig): Promise<VisualDefect[]> {
  resetDefects();
  await cleanDir("docs/visual-proof/screenshots");
  await writeMarkdown("docs/visual-proof/design-intent.lock.md", designIntentMarkdown(config));
  const evidence: EvidenceItem[] = [];
  const defects: VisualDefect[] = [];
  const observations: Awaited<ReturnType<typeof collectResponsive>> = [];
  const stressResults: string[] = [];
  const assetRows: string[][] = [];
  const stateRows: string[][] = [];

  for (const route of config.routes) {
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const themes: ThemeMode[] = config.supportsDarkMode ? ["light", "dark"] : ["light"];
      for (const theme of themes) {
        await page.emulateMedia({ colorScheme: theme, reducedMotion: config.supportsReducedMotion ? "reduce" : "no-preference" });
        await gotoRoute(page, config, route);
        const shot = await screenshotEvidence(page, route.name, viewport.name, theme);
        evidence.push(shot);
        observations.push(...await collectResponsive(page, route, viewport.name));
        defects.push(...await detectLayoutDefects(page, { route: route.name, viewport: viewport.name, section: "document", allowHorizontalScrollSelectors: config.allowHorizontalScrollSelectors, allowClippingSelectors: config.allowClippingSelectors, evidence: shot.screenshotPath }));
        if (["desktop-standard", "mobile-standard", "mobile-small"].includes(viewport.name)) {
          const state = await captureStates(page, route.name, viewport.name, route.stateTargets);
          stateRows.push(...state.rows); defects.push(...state.defects);
        }
        await gotoRoute(page, config, route);
        const stress = await runStress(page, route, { routeName: route.name, viewportName: viewport.name, allowHorizontalScrollSelectors: config.allowHorizontalScrollSelectors, allowClippingSelectors: config.allowClippingSelectors });
        stressResults.push(...stress.results); defects.push(...stress.defects);
      }
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: "light", reducedMotion: config.supportsReducedMotion ? "reduce" : "no-preference" });
    await gotoRoute(page, config, route);
    const assets = await collectAssets(page, route.name);
    assetRows.push(...assets.rows); defects.push(...assets.defects);
    await writeJson("docs/visual-proof/token-ledger.json", await collectTokens(page));
  }

  await writeMarkdown("docs/visual-proof/evidence.md", ["# Evidence", "", table(["Route", "Viewport", "Theme", "Screenshot", "Status", "Notes"], evidence.map((e) => [e.route, e.viewport, e.theme, e.screenshotPath, e.status, e.notes.join("; ")]))].join("\n"));
  await writeMarkdown("docs/visual-proof/responsive-matrix.md", responsiveMatrixMarkdown(observations, defects));
  await writeMarkdown("docs/visual-proof/content-stress-report.md", ["# Content Stress Report", "", defects.some((d) => d.kind === "content" || d.kind === "device") ? "Status: fail — content/device stress defects detected." : "Status: pass — no content stress defects detected.", "", ...stressResults.map((r) => `- ${r}`)].join("\n"));
  await writeMarkdown("docs/visual-proof/asset-ledger.md", ["# Asset Ledger", "", table(["Placement", "Required Asset", "Current Asset", "Status", "Action"], assetRows)].join("\n"));
  await writeMarkdown("docs/visual-proof/state-matrix.md", ["# State Matrix", "", table(["Component", "State", "Screenshot", "Status", "Notes"], stateRows)].join("\n"));
  await writeMarkdown("docs/visual-proof/defect-backlog.md", defectBacklogMarkdown(defects));
  await writeMarkdown("docs/visual-proof/impeccable-routing.md", routingMarkdown(defects));
  return defects;
}
