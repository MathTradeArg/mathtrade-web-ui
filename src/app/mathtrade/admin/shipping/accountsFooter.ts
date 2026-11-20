// Footer of the "Por cuenta de pago" table. Pure, so the identity is tested.
//
// `net` is the sum of every member's net (refunds are negative rows). Donors
// stay refund-due in `net` but their money stays with the organization:
//   incoming = net + refunds due + donated   (what lands on the accounts)
//   balance  = incoming - refunds due        (= net + donated, as the BE sends)
import { negateAmount, subtractAmounts } from "../../../../utils/money.ts";

type FooterInput = {
  totals: { net: string; balance: string };
  refunds: { due_total: string; donated?: { count: number; total: string } };
};

export type AccountsFooter = {
  incoming: string;
  refunds: string;
  donated: string;
  donatedCount: number;
  balance: string;
};

export const accountsFooter = (summary: FooterInput): AccountsFooter => {
  const due = summary.refunds.due_total;
  const donated = summary.refunds.donated?.total ?? "0.00";
  // a - (-b) = a + b, in exact cents.
  const incoming = subtractAmounts(
    subtractAmounts(summary.totals.net, negateAmount(due)),
    negateAmount(donated),
  );
  return {
    incoming,
    refunds: negateAmount(due),
    donated,
    donatedCount: summary.refunds.donated?.count ?? 0,
    // The BE's own figure is the one shown; the identity is pinned by a test.
    balance: summary.totals.balance,
  };
};

/** incoming - refunds due: must equal totals.balance. */
export const footerIdentityHolds = (summary: FooterInput): boolean => {
  const f = accountsFooter(summary);
  return subtractAmounts(f.incoming, summary.refunds.due_total) === f.balance;
};
