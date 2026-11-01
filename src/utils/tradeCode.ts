/** Label number as printed: at least 4 digits, never cut.
 *  12 -> "0012", 12345 stays "12345". Empty is "—". */
export function formatTradeCode(code: number | string | null | undefined): string {
  if (code === null || code === undefined || `${code}`.trim() === "") return "—";
  return `${code}`.trim().padStart(4, "0");
}
