let defectCounter = 0;

export function resetDefectCounter(): void {
  defectCounter = 0;
}

export function nextDefectId(): string {
  defectCounter += 1;
  return `VP-${String(defectCounter).padStart(3, "0")}`;
}

export const resetDefects = resetDefectCounter;
