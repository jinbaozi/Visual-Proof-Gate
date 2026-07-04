import fs from "node:fs/promises";
import path from "node:path";

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

export async function ensureParent(filePath: string): Promise<void> {
  await ensureDir(path.dirname(filePath));
}

export async function cleanDir(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
  await ensureDir(dir);
}
