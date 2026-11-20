// Money helpers shared by every payments screen. The API sends amounts as
// decimal strings ("1234.50"); they are handled as integer cents so no float
// arithmetic ever touches them.

const EXACT = /^-?\d+(\.\d{1,2})?$/;
// What an admin may type as a price: digits with an optional , or . and up to
// two decimals. No thousands separators, no exponent, no hex.
const PRICE_INPUT = /^\d+([.,]\d{1,2})?$/;

/** Integer cents of an API amount (string or number), or null if not a number. */
export const parseCents = (amount: unknown): number | null => {
  if (typeof amount === "string") {
    const text = amount.trim();
    if (EXACT.test(text)) {
      const negative = text.startsWith("-");
      const [whole, decimals = ""] = text.replace("-", "").split(".");
      const cents = Number(whole) * 100 + Number(decimals.padEnd(2, "0"));
      return negative ? -cents : cents;
    }
    if (!/^-?\d+(\.\d+)?$/.test(text)) return null;
    return Math.round(Number(text) * 100);
  }
  if (typeof amount === "number" && Number.isFinite(amount)) {
    return Math.round(amount * 100);
  }
  return null;
};

/** "$ 1.234,50" (es-AR ARS); whole amounts have no decimals. Unparseable
 *  values come back untouched. */
export const formatAmount = (amount: any): any => {
  const cents = parseCents(amount);
  if (cents === null) return amount;
  // `|| 0` turns -0 (from "-0.00") into 0: no "-$ 0".
  return (cents / 100 || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  });
};

/** Strictly parses a typed price. Returns the normalized decimal string
 *  ("1500.5") to send to the API, or null when invalid or not above zero. */
export const parsePriceInput = (text: string): string | null => {
  const value = text.trim();
  if (!PRICE_INPUT.test(value)) return null;
  const normalized = value.replace(",", ".");
  return Number(normalized) > 0 ? normalized : null;
};

/** An API price as input text: "1500.00" -> "1500", "1500.50" -> "1500.50". */
export const priceToInput = (amount: unknown): string => {
  const cents = parseCents(amount);
  if (cents === null) return "";
  const whole = Math.trunc(cents / 100);
  const rest = Math.abs(cents % 100);
  return rest === 0 ? String(whole) : `${whole}.${String(rest).padStart(2, "0")}`;
};

/** Integer cents back to an API-style decimal string: 33334 -> "333.34". */
export const centsToAmount = (cents: number): string => {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
};

/** a - b in cents, as a decimal string. Unparseable input counts as 0. */
export const subtractAmounts = (a: unknown, b: unknown): string =>
  centsToAmount((parseCents(a) ?? 0) - (parseCents(b) ?? 0));

/** Same amount with the opposite sign ("5000.00" -> "-5000.00", "-0" stays 0). */
export const negateAmount = (amount: unknown): string =>
  centsToAmount(-(parseCents(amount) ?? 0));

/** Absolute value: "-2649.50" -> "2649.50". */
export const absAmount = (amount: unknown): string =>
  centsToAmount(Math.abs(parseCents(amount) ?? 0));

/** Sign of an amount: -1, 0 or 1 (unparseable is 0). */
export const amountSign = (amount: unknown): -1 | 0 | 1 => {
  const cents = parseCents(amount) ?? 0;
  return cents < 0 ? -1 : cents > 0 ? 1 : 0;
};
