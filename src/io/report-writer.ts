import { ensureParent } from "./filesystem";

export async function writeMarkdown(filePath: string, body: string): Promise<void> {
  await ensureParent(filePath);
  await BunCompat.writeText(filePath, body.endsWith("\n") ? body : `${body}\n`);
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  await ensureParent(filePath);
  await BunCompat.writeText(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

const BunCompat = {
  async writeText(filePath: string, content: string): Promise<void> {
    const fs = await import("node:fs/promises");
    await fs.writeFile(filePath, content, "utf8");
  }
};
