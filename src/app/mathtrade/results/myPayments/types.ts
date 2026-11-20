export type PaymentAccount = {
  holder_name: string;
  alias: string;
  cbu: string;
  bank: string;
};

export type PaymentLine = {
  trade_id: number;
  item_title: string;
  base: string;
  shipping: string;
};

export type PaymentReceipt = {
  id: number | null;
  status: "missing" | "pending" | "approved" | "rejected";
  amount: string | null;
  rejection_reason: string | null;
  submitted_at: string | null;
  can_upload: boolean;
};

export type RefundState = {
  status: "missing" | "submitted" | "refunded";
  holder_name: string;
  alias: string;
  cbu: string;
  // False in the admin preview, once refunded, or when nothing is due anymore.
  can_edit: boolean;
  submitted_at: string | null;
  refunded_at: string | null;
  amount: string | null;
};

export type MyPayments =
  | { published: false }
  | {
      published: true;
      price_per_game: string;
      games_count: number;
      base_amount: string;
      shipping_amount: string;
      // Gross: base + shipping. What is actually due is `net_amount`.
      total_to_transfer: string;
      // Registration contribution already paid, subtracted from the gross.
      credit_amount: string;
      // Signed: negative means the organization owes the participant.
      net_amount: string;
      refund_due: boolean;
      // null when no refund is due and no data was ever loaded.
      refund: RefundState | null;
      // The referente will tell the shipping cost (no amount is sent).
      referente_shipping: boolean;
      partial: boolean;
      breakdown: PaymentLine[];
      account: PaymentAccount | null;
      // null for an admin who is not a member.
      receipt: PaymentReceipt | null;
    };

export type PublishedPayments = Extract<MyPayments, { published: true }>;
