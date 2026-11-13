// Pure rules of the delivery reports UI (Resultados and admin), kept free of
// React and "@/" imports so node --test can run them.

export const DELIVERY_REPORT_MAX_PHOTOS = 3;
// ?delivery_report=<id>: the link in the report emails.
export const DELIVERY_REPORT_PARAM = "delivery_report";

export type DeliveryReportPerson = {
  id: number;
  first_name: string;
  last_name: string;
};

export type DeliveryReportComment = {
  id: number;
  user: DeliveryReportPerson;
  comment: string;
  created: string;
};

export type DeliveryReportRow = {
  id: number;
  status: "open" | "closed";
  created: string;
  closed_at: string | null;
  item_id: number | null;
  item_title: string;
  trade: number;
  images: string[];
  comment: string;
  reporter: DeliveryReportPerson;
  reported: DeliveryReportPerson;
  role: "reporter" | "reported" | "admin" | null;
  can_comment: boolean;
  can_close: boolean;
  comments: DeliveryReportComment[];
};

// The photo gallery keeps its photos as one comma-separated string.
export const splitPhotos = (images?: string | null): string[] =>
  (images || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

export type FormErrors = { comment?: "required"; images?: "required" | "max" };

export const validateReportForm = (comment: string, images?: string | null): FormErrors => {
  const errors: FormErrors = {};
  if (!comment.trim()) errors.comment = "required";
  const count = splitPhotos(images).length;
  if (count < 1) errors.images = "required";
  else if (count > DELIVERY_REPORT_MAX_PHOTOS) errors.images = "max";
  return errors;
};

// The open report of each received game (one open report per trade).
export const openReportsByItem = (
  reports: DeliveryReportRow[] | null | undefined
): Record<number, DeliveryReportRow> => {
  const byItem: Record<number, DeliveryReportRow> = {};
  for (const report of reports || []) {
    if (report.status === "open" && report.item_id != null) byItem[report.item_id] = report;
  }
  return byItem;
};

// What the received-game card offers: nothing until the game is received,
// then "report a problem", or "see report" while one is open.
export const reportActionFor = (
  received: boolean,
  openReport?: DeliveryReportRow | null
): "none" | "create" | "view" => {
  if (!received) return "none";
  return openReport ? "view" : "create";
};

export const personName = (person?: DeliveryReportPerson | null): string =>
  person ? `${person.first_name} ${person.last_name}`.trim() : "-";

// Which report the modal must fetch now: the wanted id only if it is not the
// one already requested. Keeps the GET to once per id, whatever re-renders.
export const nextReportToFetch = (
  lastFetched: number | null,
  wanted: number | null
): number | null => (wanted && wanted !== lastFetched ? wanted : null);

// A result row can come without item_from (e.g. the item was removed); the
// item card cannot render a null item, so those rows are left out of the list.
export const renderableReceived = <T extends { item_from?: unknown }>(
  rows: T[] | null | undefined
): T[] => (rows || []).filter((row) => Boolean(row?.item_from));
