import type { ImpeccableCommandSequence } from "../contracts";

export function renderImpeccableCommandSequence(sequence: ImpeccableCommandSequence): string {
  return [
    "# Impeccable Command Sequence",
    "",
    `Status: ${sequence.status}`,
    "",
    "## Blockers",
    ...(sequence.blockers.length ? sequence.blockers.map((blocker) => `- ${blocker}`) : ["- None detected."]),
    "",
    "## Commands",
    ...sequence.commands.map((item) => [
      `### ${item.id} ${item.command}`,
      `- Phase: ${item.phase}`,
      `- Required before final pass: ${item.requiredBeforePolish ? "yes" : "no"}`,
      `- Reason: ${item.reason}`,
      "- Evidence:",
      ...item.evidence.map((evidence) => `  - ${evidence}`)
    ].join("\n"))
  ].join("\n");
}
