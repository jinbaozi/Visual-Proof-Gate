import { table } from "../io";

export function renderAssetLedgerReport(rows: string[][]): string {
  return [
    "# Asset Ledger",
    "",
    table(["Placement", "Required Asset", "Current Asset", "Status", "Action"], rows)
  ].join("\n");
}
