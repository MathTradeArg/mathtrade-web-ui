export type ShippingLoc = { id: number; name: string; province: string | null; code: string | null };
export type ShippingKind = "local" | "direct" | "via_hub";
export type ShippingPerson = { username: string; first_name: string; last_name: string; city: ShippingLoc | null };
export type ShippingItem = {
  trade_id: number;
  code: number | null;
  title: string;
  table_number: string | null;
  giver: ShippingPerson;
  receiver: ShippingPerson;
  origin: ShippingLoc | null;
  via: ShippingLoc | null;
  destination: ShippingLoc | null;
  kind: ShippingKind;
};
export type ShippingRoute = {
  origin: ShippingLoc | null;
  via: ShippingLoc | null;
  destination: ShippingLoc | null;
  kind: ShippingKind;
  items: number;
};
export type ShippingRoutes = {
  hub: ShippingLoc | null;
  threshold: number;
  routes: ShippingRoute[];
  items: ShippingItem[];
  published_at?: string | null;
};
// Hub tables (BE results/tables.py): who receives at each table.
export type TableMember = { id: number; username: string; name: string; items: number };
export type HubTable = { table: string | null; items: number; users: number; members: TableMember[] };
export type TablesParams = {
  tables: number;
  max_items_per_table: number | null;
  big_user_threshold: number;
};
export type HubTables = { params: TablesParams; tables: HubTable[]; applied?: boolean };

export type PaymentAccountTotal = {
  id: number;
  holder_name: string;
  alias: string;
  bank: string;
  active: boolean;
  people: number;
  total: string;
};

// BE mathtrade/payments.py payments_summary: admin panel "Pagos" tab.
export type PaymentsSummary = {
  published_at: string | null;
  price_per_game: string;
  // Some computed row used another price than the current one: recompute first.
  stale: boolean;
  members_count: number;
  partial_count: number;
  computed_at: string | null;
  totals: { base: string; shipping: string; credit: string; net: string };
  // Approved contributions changed after the last compute (or after publishing).
  stale_credit_count: number;
  // Payment accounts balanced by amount (only active ones get people).
  accounts: PaymentAccountTotal[];
  // Members with something to transfer and no payment account.
  unassigned: number;
  refunds: {
    due_count: number;
    due_total: string;
    with_account: number;
    missing: number;
    refunded: number;
  };
  // Latest receipt of every member that has something to transfer.
  receipts: { pending: number; approved: number; rejected: number; missing: number };
};

type ReceiptAccountRef = { id: number; holder_name: string; alias: string };

// BE payment_receipts_serializers.PaymentReceiptAdminSerializer
export type PaymentReceiptRow = {
  id: number;
  membership_id: number;
  user_id: number;
  amount: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  account: ReceiptAccountRef;
  first_name: string;
  last_name: string;
  email: string;
  bgg_user: string;
  location: string | null;
};

// ?status=missing: members with something to transfer and no receipt.
export type PaymentReceiptMissingRow = {
  membership_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  bgg_user: string;
  location: string | null;
  account: ReceiptAccountRef | null;
  status: "missing";
};

export type PaymentsMemberRow = {
  user_id: number;
  username: string;
  full_name: string;
  location: string | null;
  games_count: number;
  // Gross; the amount due is net_amount.
  total_to_transfer: string;
  partial: boolean;
  credit_amount: string;
  net_amount: string;
  refund_status: "missing" | "submitted" | "refunded" | null;
  // null when the member has nothing to transfer (net <= 0).
  receipt_status: "missing" | "pending" | "approved" | "rejected" | null;
};

// Row statuses of BE payments/refunds/ (the participant-side 'submitted' of
// my-payments / refund_status is a different contract). Every one needs the
// i18n key `adminPayments.refunds.status.<status>`.
export const REFUND_ROW_STATUSES = ["pending", "refunded", "missing"] as const;
export type RefundRowStatus = (typeof REFUND_ROW_STATUSES)[number];

// BE payments/refunds/: pending and refunded rows.
export type RefundRow = {
  id: number;
  membership_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  bgg_user: string;
  location: string | null;
  holder_name: string;
  alias: string;
  cbu: string;
  amount: string;
  status: Exclude<RefundRowStatus, "missing">;
  // False when a recompute left nothing to refund: the data stays but no
  // longer corresponds.
  still_due: boolean;
  submitted_at: string | null;
  updated_at: string | null;
  refunded_at: string | null;
  refunded_amount: string | null;
  refunded_by: string | null;
};

// ?status=missing: owed a refund and no account data loaded yet.
export type RefundMissingRow = {
  id: null;
  membership_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  bgg_user: string;
  location: string | null;
  amount: string;
  status: "missing";
  still_due: true;
};

export type RefundListRow = RefundRow | RefundMissingRow;
