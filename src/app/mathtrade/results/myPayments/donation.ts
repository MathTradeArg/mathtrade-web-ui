// Donating the refund balance (Mis pagos). Pure helpers, no React.

/** The word the participant types to confirm. The BE accepts it trimmed and
 *  in any case (my-refund-donation/), so the button follows the same rule. */
export const DONATION_WORD = "DONAR";

export const donationWordMatches = (typed: unknown): boolean =>
  typeof typed === "string" && typed.trim().toUpperCase() === DONATION_WORD;

/** Body of the POST: always the canonical word, never the raw input. */
export const donationPayload = () => ({ confirmation: DONATION_WORD });

const firstText = (value: unknown): string | undefined => {
  if (typeof value === "string" && value.trim()) return value;
  if (Array.isArray(value)) {
    const hit = value.find((item) => typeof item === "string" && item.trim());
    return typeof hit === "string" ? hit : undefined;
  }
  return undefined;
};

/** Spanish text the BE answered with (`{confirmation: [..]}`, `{detail}` or a
 *  bare list), to be shown as plain text, never as HTML. undefined when the
 *  answer carries none (5xx, network): the caller uses its generic message. */
export const donationErrorText = (error: any): string | undefined => {
  if (!error) return undefined;
  if (typeof error.status === "number" && error.status >= 500) return undefined;
  const data = error.data;
  if (!data || typeof data !== "object") return undefined;
  if (Array.isArray(data)) return firstText(data);
  return firstText(data.confirmation) ?? firstText(data.detail);
};
