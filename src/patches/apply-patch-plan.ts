import fs from "node:fs/promises";
import type { SafePatchLog, SafePatchLogEntry, SafePatchPlan, SafePatchPlanOperation } from "../contracts";

function applyTextOperation(text: string, operation: SafePatchPlanOperation): { ok: true; text: string; message: string } | { ok: false; message: string } {
  if (operation.requiresMarker && !text.includes(operation.requiresMarker)) {
    return { ok: false, message: `required marker not found: ${operation.requiresMarker}` };
  }

  if (operation.operation === "replace") {
    const search = operation.search ?? "";
    const matches = text.split(search).length - 1;
    if (matches !== 1) return { ok: false, message: `replace requires exactly one match; found ${matches}` };
    return { ok: true, text: text.replace(search, operation.replace ?? ""), message: "replace operation prepared" };
  }

  if (operation.operation === "append") {
    return { ok: true, text: `${text}${operation.content ?? ""}`, message: "append operation prepared" };
  }

  if (operation.operation === "prepend") {
    return { ok: true, text: `${operation.content ?? ""}${text}`, message: "prepend operation prepared" };
  }

  return { ok: false, message: `unsupported operation: ${operation.operation}` };
}

export async function applySafePatchPlan(plan: SafePatchPlan): Promise<SafePatchLog> {
  const entries: SafePatchLogEntry[] = [];

  for (const operation of plan.operations) {
    if (operation.status !== "planned" || !operation.resolvedPath) {
      entries.push({
        id: operation.id,
        filePath: operation.filePath,
        operation: operation.operation,
        status: "skipped",
        message: operation.reason ?? "operation is not planned"
      });
      continue;
    }

    try {
      const current = await fs.readFile(operation.resolvedPath, "utf8");
      const result = applyTextOperation(current, operation);
      if (!result.ok) {
        entries.push({ id: operation.id, filePath: operation.filePath, operation: operation.operation, status: "failed", message: result.message });
        continue;
      }

      if (plan.dryRun) {
        entries.push({ id: operation.id, filePath: operation.filePath, operation: operation.operation, status: "dry-run", message: result.message });
        continue;
      }

      await fs.writeFile(operation.resolvedPath, result.text, "utf8");
      entries.push({ id: operation.id, filePath: operation.filePath, operation: operation.operation, status: "applied", message: result.message });
    } catch (error) {
      entries.push({
        id: operation.id,
        filePath: operation.filePath,
        operation: operation.operation,
        status: "failed",
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return {
    applied: entries.filter((entry) => entry.status === "applied").length,
    skipped: entries.filter((entry) => entry.status === "skipped" || entry.status === "dry-run").length,
    failed: entries.filter((entry) => entry.status === "failed").length,
    entries
  };
}
