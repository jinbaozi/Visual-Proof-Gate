import { table } from "../io";

export function renderStateMatrixReport(rows: string[][]): string {
  return [
    "# State Matrix",
    "",
    table(["Component", "State", "Screenshot", "Status", "Notes"], rows)
  ].join("\n");
}
