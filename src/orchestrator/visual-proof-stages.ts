import type { ThemeMode, VisualProofStage } from "../contracts";
import { VIEWPORTS } from "../contracts";
import { gotoVisualProofRoute, applyVisualMedia, captureScreenshotEvidence } from "../browser";
import { buildDesignIntentLock } from "../intent";
import { cleanDir, writeJson, writeMarkdown } from "../io";
import { runLayoutProbe, runResponsiveProbe, runContentStressProbe, runAssetProbe, runTokenProbe, runStateProbe } from "../probes";
import { buildImpeccableRoutePlan, renderImpeccableRoutingMarkdown } from "../routing";
import { renderAssetLedgerReport, renderContentStressReport, renderDefectBacklogReport, renderEvidenceReport, renderResponsiveMatrixReport, renderStateMatrixReport } from "../reports";
import type { VisualProofRuntimeContext } from "./visual-proof-context";

export const designIntentStage: VisualProofStage<VisualProofRuntimeContext> = {
  name: "design-intent",
  description: "Freezes Taste Skill output into a design intent lock.",
  requires: ["config"],
  produces: ["intentLock", "reports"],
  async run(context) {
    context.intentLock = buildDesignIntentLock(context.config);
    context.reports["design-intent.lock.md"] = context.intentLock;
    return context;
  }
};

export const screenshotEvidenceStage: VisualProofStage<VisualProofRuntimeContext> = {
  name: "screenshot-evidence",
  description: "Captures route, viewport, and theme screenshot evidence.",
  requires: ["config"],
  produces: ["evidence"],
  async run(context) {
    const themes: ThemeMode[] = context.config.supportsDarkMode ? ["light", "dark"] : ["light"];
    for (const route of context.config.routes) {
      for (const viewport of VIEWPORTS) {
        await context.page.setViewportSize({ width: viewport.width, height: viewport.height });
        for (const theme of themes) {
          await applyVisualMedia(context.page, { theme, reducedMotion: context.config.supportsReducedMotion });
          await gotoVisualProofRoute(context.page, context.config, route);
          context.evidence.push(await captureScreenshotEvidence(context.page, route.name, viewport.name, theme));
        }
      }
    }
    return context;
  }
};

export const responsiveProbeStage: VisualProofStage<VisualProofRuntimeContext> = {
  name: "responsive-probe",
  description: "Collects section visibility and dimensions across the viewport matrix.",
  requires: ["config"],
  produces: ["responsiveObservations"],
  async run(context) {
    for (const route of context.config.routes) {
      for (const viewport of VIEWPORTS) {
        await context.page.setViewportSize({ width: viewport.width, height: viewport.height });
        await applyVisualMedia(context.page, { theme: "light", reducedMotion: context.config.supportsReducedMotion });
        await gotoVisualProofRoute(context.page, context.config, route);
        context.responsiveObservations.push(...await runResponsiveProbe(context.page, route, viewport.name));
      }
    }
    return context;
  }
};

export const layoutProbeStage: VisualProofStage<VisualProofRuntimeContext> = {
  name: "layout-probe",
  description: "Detects horizontal overflow, clipping, off-viewport elements, and blocked interactions.",
  requires: ["config", "evidence"],
  produces: ["defects"],
  async run(context) {
    const themes: ThemeMode[] = context.config.supportsDarkMode ? ["light", "dark"] : ["light"];
    for (const route of context.config.routes) {
      for (const viewport of VIEWPORTS) {
        await context.page.setViewportSize({ width: viewport.width, height: viewport.height });
        for (const theme of themes) {
          await applyVisualMedia(context.page, { theme, reducedMotion: context.config.supportsReducedMotion });
          await gotoVisualProofRoute(context.page, context.config, route);
          const evidence = `docs/visual-proof/screenshots/${route.name}-${viewport.name}-${theme}.png`;
          context.defects.push(...await runLayoutProbe(context.page, {
            route: route.name,
            viewport: viewport.name,
            section: "document",
            allowHorizontalScrollSelectors: context.config.allowHorizontalScrollSelectors,
            allowClippingSelectors: context.config.allowClippingSelectors,
            evidence
          }));
        }
      }
    }
    return context;
  }
};

export const contentStressStage: VisualProofStage<VisualProofRuntimeContext> = {
  name: "content-stress",
  description: "Injects long, CJK, and edge-case copy, then reuses layout checks to catch breakage.",
  requires: ["config"],
  produces: ["contentStressResults", "defects"],
  async run(context) {
    for (const route of context.config.routes) {
      for (const viewport of VIEWPORTS) {
        await context.page.setViewportSize({ width: viewport.width, height: viewport.height });
        await applyVisualMedia(context.page, { theme: "light", reducedMotion: context.config.supportsReducedMotion });
        await gotoVisualProofRoute(context.page, context.config, route);
        const result = await runContentStressProbe(context.page, route, {
          routeName: route.name,
          viewportName: viewport.name,
          allowHorizontalScrollSelectors: context.config.allowHorizontalScrollSelectors,
          allowClippingSelectors: context.config.allowClippingSelectors
        });
        context.contentStressResults.push(...result.results);
        context.defects.push(...result.defects);
      }
    }
    return context;
  }
};

export const assetLedgerStage: VisualProofStage<VisualProofRuntimeContext> = {
  name: "asset-ledger",
  description: "Collects image and placeholder asset evidence without rendering reports.",
  requires: ["config"],
  produces: ["assetLedger", "defects"],
  async run(context) {
    for (const route of context.config.routes) {
      await context.page.setViewportSize({ width: 1440, height: 900 });
      await applyVisualMedia(context.page, { theme: "light", reducedMotion: context.config.supportsReducedMotion });
      await gotoVisualProofRoute(context.page, context.config, route);
      const result = await runAssetProbe(context.page, route.name);
      context.assetLedger.push(...result.rows);
      context.defects.push(...result.defects);
    }
    return context;
  }
};

export const tokenLedgerStage: VisualProofStage<VisualProofRuntimeContext> = {
  name: "token-ledger",
  description: "Extracts computed color, type, spacing, radius, shadow, z-index, and motion tokens.",
  requires: ["config"],
  produces: ["tokenLedger"],
  async run(context) {
    const firstRoute = context.config.routes[0];
    await context.page.setViewportSize({ width: 1440, height: 900 });
    await applyVisualMedia(context.page, { theme: "light", reducedMotion: context.config.supportsReducedMotion });
    await gotoVisualProofRoute(context.page, context.config, firstRoute);
    context.tokenLedger = await runTokenProbe(context.page);
    return context;
  }
};

export const stateMatrixStage: VisualProofStage<VisualProofRuntimeContext> = {
  name: "state-matrix",
  description: "Captures configured interaction states in representative desktop and mobile viewports.",
  requires: ["config"],
  produces: ["stateMatrix", "defects"],
  async run(context) {
    for (const route of context.config.routes) {
      for (const viewport of VIEWPORTS.filter((item) => ["desktop-standard", "mobile-standard", "mobile-small"].includes(item.name))) {
        await context.page.setViewportSize({ width: viewport.width, height: viewport.height });
        await applyVisualMedia(context.page, { theme: "light", reducedMotion: context.config.supportsReducedMotion });
        await gotoVisualProofRoute(context.page, context.config, route);
        const result = await runStateProbe(context.page, route.name, viewport.name, route.stateTargets);
        context.stateMatrix.push(...result.rows);
        context.defects.push(...result.defects);
      }
    }
    return context;
  }
};

export const routingStage: VisualProofStage<VisualProofRuntimeContext> = {
  name: "impeccable-routing",
  description: "Converts defects into an ordered Impeccable command route plan.",
  requires: ["defects"],
  produces: ["routing", "reports"],
  async run(context) {
    context.routing = buildImpeccableRoutePlan(context.defects);
    context.reports["impeccable-routing.md"] = renderImpeccableRoutingMarkdown(context.routing);
    return context;
  }
};

export const reportWritingStage: VisualProofStage<VisualProofRuntimeContext> = {
  name: "report-writing",
  description: "Renders and writes all Visual Proof Gate reports after probes complete.",
  requires: ["intentLock", "evidence", "responsiveObservations", "assetLedger", "stateMatrix", "defects", "reports"],
  produces: ["reports"],
  async run(context) {
    context.reports["evidence.md"] = renderEvidenceReport(context.evidence);
    context.reports["responsive-matrix.md"] = renderResponsiveMatrixReport(context.responsiveObservations, context.defects);
    context.reports["content-stress-report.md"] = renderContentStressReport(context.contentStressResults, context.defects);
    context.reports["asset-ledger.md"] = renderAssetLedgerReport(context.assetLedger);
    context.reports["state-matrix.md"] = renderStateMatrixReport(context.stateMatrix);
    context.reports["defect-backlog.md"] = renderDefectBacklogReport(context.defects);

    await writeMarkdown("docs/visual-proof/design-intent.lock.md", context.intentLock ?? "");
    await writeMarkdown("docs/visual-proof/evidence.md", context.reports["evidence.md"]);
    await writeMarkdown("docs/visual-proof/responsive-matrix.md", context.reports["responsive-matrix.md"]);
    await writeMarkdown("docs/visual-proof/content-stress-report.md", context.reports["content-stress-report.md"]);
    await writeMarkdown("docs/visual-proof/asset-ledger.md", context.reports["asset-ledger.md"]);
    await writeJson("docs/visual-proof/token-ledger.json", context.tokenLedger ?? {});
    await writeMarkdown("docs/visual-proof/state-matrix.md", context.reports["state-matrix.md"]);
    await writeMarkdown("docs/visual-proof/defect-backlog.md", context.reports["defect-backlog.md"]);
    await writeMarkdown("docs/visual-proof/impeccable-routing.md", context.reports["impeccable-routing.md"] ?? "");
    return context;
  }
};

export const VISUAL_PROOF_STAGES = [
  designIntentStage,
  screenshotEvidenceStage,
  responsiveProbeStage,
  layoutProbeStage,
  contentStressStage,
  assetLedgerStage,
  tokenLedgerStage,
  stateMatrixStage,
  routingStage,
  reportWritingStage
] satisfies VisualProofStage<VisualProofRuntimeContext>[];

export async function prepareVisualProofArtifacts(): Promise<void> {
  await cleanDir("docs/visual-proof/screenshots");
}
