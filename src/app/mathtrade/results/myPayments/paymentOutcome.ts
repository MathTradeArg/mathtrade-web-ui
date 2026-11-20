import { amountSign, absAmount } from "../../../../utils/money.ts";
import type { MyPayments } from "./types";

// What "Mis pagos" has to show, decided from the net amount (base + shipping
// - registration credit). Pure so it can be tested without React.
export type PaymentOutcome = "transfer" | "zero" | "refund";

export const paymentOutcome = (net: unknown): PaymentOutcome => {
  const sign = amountSign(net);
  return sign > 0 ? "transfer" : sign < 0 ? "refund" : "zero";
};

/** Amount the participant gets back (always positive). */
export const refundAmount = (net: unknown): string => absAmount(net);

type Published = Extract<MyPayments, { published: true }>;

/** The tab shows with games to pay, or with credit (a refund may be due even
 *  with no games). Unpublished or malformed bodies never show it. */
export const hasPaymentsTab = (payments: MyPayments | null | undefined): boolean => {
  if (!payments || payments.published !== true) return false;
  const body = payments as Published;
  if (!Array.isArray(body.breakdown)) return false;
  return body.games_count > 0 || amountSign(body.credit_amount) > 0 || !!body.refund;
};
