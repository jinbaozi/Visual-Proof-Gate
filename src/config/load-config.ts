import path from "node:path";
import { pathToFileURL } from "node:url";
import type { VisualProofConfig } from "../contracts";
import { validateVisualProofConfig } from "./validate-config";

export async function loadVisualProofConfig(configPath = "visual-proof.config.ts"): Promise<VisualProofConfig> {
  const resolved = path.resolve(process.cwd(), configPath);
  const imported = await import(pathToFileURL(resolved).href);
  const config = imported.default;
  validateVisualProofConfig(config);
  return config;
}

export const loadConfig = loadVisualProofConfig;
