/** Label number as printed: at least 5 digits, never cut.
 *  12 -> "00012", 16120 stays "16120". Empty is "—". */
export function formatTradeCode(code: number | string | null | undefined): string {
  if (code === null || code === undefined || `${code}`.trim() === "") return "—";
  return `${code}`.trim().padStart(5, "0");
}
