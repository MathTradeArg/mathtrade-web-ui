// Mis reportes: item (ejemplar) and delivery reports in one list. Free of
// React and "@/" imports so node --test can run it.
import type { DeliveryReportRow } from "./deliveryReports.ts";

export type MyReportStatus = "open" | "closed";

export type MyReportItem = {
  kind: "item" | "delivery";
  id: number;
  created: string;
  status: MyReportStatus;
  title: string;
  commentsCount: number;
};

export type ItemReportRow = {
  id: number;
  created: string;
  status: MyReportStatus;
  item_title: string | null;
  comments_count: number;
};

export const fromItemRow = (r: ItemReportRow): MyReportItem => ({
  kind: "item",
  id: r.id,
  created: r.created,
  status: r.status,
  title: r.item_title || "",
  commentsCount: r.comments_count || 0,
});

export const fromDeliveryRow = (r: DeliveryReportRow): MyReportItem => ({
  kind: "delivery",
  id: r.id,
  created: r.created,
  status: r.status,
  title: r.item_title || "",
  commentsCount: (r.comments || []).length,
});

const time = (iso: string): number => {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? 0 : t;
};

// Rows of one status, newest first (Array.sort is stable: ties keep order).
export const mergeMyReports = (rows: MyReportItem[], status: MyReportStatus): MyReportItem[] =>
  rows.filter((r) => r.status === status).sort((a, b) => time(b.created) - time(a.created));
