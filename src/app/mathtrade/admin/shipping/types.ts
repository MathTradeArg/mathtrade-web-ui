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

// BE mathtrade/payments.py payments_summary: admin panel "Pagos" tab.
export type PaymentsSummary = {
  published_at: string | null;
  price_per_game: string;
  // Some computed row used another price than the current one: recompute first.
  stale: boolean;
  members_count: number;
  partial_count: number;
  computed_at: string | null;
  totals: { base: string; shipping: string; suggested: string };
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
  total_to_transfer: string;
  partial: boolean;
  // null when the member has nothing to transfer.
  receipt_status: "missing" | "pending" | "approved" | "rejected" | null;
};
