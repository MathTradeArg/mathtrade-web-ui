// Excel with ALL the refunds still to be made (admin Pagos tab). Pure logic:
// rows of `payments/refunds/?status=pending` and `?status=missing` -> cells.
// The text/money guards are the ones of the missing-receipts Excel.
import * as XLSX from "xlsx";
import { moneyCell, textCell, type ExcelCell } from "./missingReceiptsExcel.ts";
import type { RefundListRow } from "./types";

export type PendingRefundsLabels = {
  // name, user, email, city, amount, holder, alias, cbu, status
  headers: string[];
  statusPending: string;
  statusMissing: string;
};

// Still to refund: not refunded and still due. `pending` rows can have
// still_due false (a recompute left nothing to refund): those are out.
export const dueRefundRows = (rows: unknown): RefundListRow[] =>
  Array.isArray(rows)
    ? (rows as RefundListRow[]).filter(
        (row) =>
          row?.still_due === true &&
          (row.status === "pending" || row.status === "missing"),
      )
    : [];

// Rows without a list (or a paginated {results}) are normalized here. A
// paginated answer with a next page would be a partial file: signal it.
export const listRows = (data: unknown): { rows: unknown[]; partial: boolean } => {
  if (Array.isArray(data)) return { rows: data, partial: false };
  const paged = data as { results?: unknown; next?: unknown } | null;
  if (paged && Array.isArray(paged.results)) {
    return { rows: paged.results, partial: !!paged.next };
  }
  return { rows: [], partial: false };
};

const collator = new Intl.Collator("es", { sensitivity: "base" });

const byLastName = (a: RefundListRow, b: RefundListRow) =>
  collator.compare(a.last_name ?? "", b.last_name ?? "") ||
  collator.compare(a.first_name ?? "", b.first_name ?? "");

// Data loaded first, then the ones without account data; each group by last name.
export const sortPendingRefunds = (rows: RefundListRow[]): RefundListRow[] => {
  const loaded = rows.filter((row) => row.status !== "missing").sort(byLastName);
  const missing = rows.filter((row) => row.status === "missing").sort(byLastName);
  return [...loaded, ...missing];
};

const fullName = (row: RefundListRow) =>
  `${row.first_name} ${row.last_name}`.trim();

export const pendingRefundsCells = (
  rows: RefundListRow[],
  labels: PendingRefundsLabels,
): ExcelCell[][] => [
  labels.headers.map(textCell),
  ...sortPendingRefunds(rows).map((row) => {
    const missing = row.status === "missing";
    return [
      textCell(fullName(row)),
      textCell(row.bgg_user),
      textCell(row.email),
      textCell(row.location),
      moneyCell(row.amount),
      textCell(missing ? "" : (row as { holder_name: string }).holder_name),
      textCell(missing ? "" : (row as { alias: string }).alias),
      textCell(missing ? "" : (row as { cbu: string }).cbu),
      textCell(missing ? labels.statusMissing : labels.statusPending),
    ];
  }),
];

export const pendingRefundsWorksheet = (cells: ExcelCell[][]) => {
  const sheet = XLSX.utils.aoa_to_sheet(cells as any[][]);
  sheet["!cols"] = [28, 20, 30, 18, 18, 26, 26, 26, 22].map((wch) => ({ wch }));
  return sheet;
};

const slug = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const pad = (n: number) => String(n).padStart(2, "0");

// devoluciones-pendientes-<edition>-<YYYY-MM-DD>.xlsx (local date)
export const pendingRefundsFileName = (
  edition: unknown,
  date: Date = new Date(),
) => {
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const name = slug(typeof edition === "string" ? edition : "") || "edicion";
  return `devoluciones-pendientes-${name}-${day}.xlsx`;
};

export const downloadPendingRefundsExcel = (
  rows: RefundListRow[],
  labels: PendingRefundsLabels,
  edition: unknown,
) => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    pendingRefundsWorksheet(pendingRefundsCells(rows, labels)),
    "Sheet1",
  );
  XLSX.writeFile(workbook, pendingRefundsFileName(edition));
};
