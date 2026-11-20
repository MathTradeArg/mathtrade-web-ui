// Excel of the participants who have not uploaded a receipt yet (admin Pagos
// tab). Pure logic: rows from `payment-receipts/?status=missing` -> cells.
import * as XLSX from "xlsx";
import { parseCents } from "../../../../utils/money.ts";
import type { PaymentReceiptMissingRow } from "./types";

export type ExcelCell =
  { t: "s"; v: string } | { t: "n"; v: number; z: string };

// A real number cell shown as pesos, never a string built by hand.
export const MONEY_FORMAT = '"$" #,##0.00';

// Text is always written with the string type: Excel never evaluates a string
// cell, so a name like "=HYPERLINK(...)" or "-2+3" stays plain text. This is
// the guard against formula injection (names and aliases are user input).
export const textCell = (value: unknown): ExcelCell => ({
  t: "s",
  v: value === null || value === undefined ? "" : String(value),
});

export const moneyCell = (amount: unknown): ExcelCell => {
  const cents = parseCents(amount);
  return cents === null
    ? textCell("")
    : { t: "n", v: cents / 100, z: MONEY_FORMAT };
};

export type MissingExcelLabels = {
  headers: string[]; // name, user, email, city, amount, account, status
  status: string;
};

const fullName = (row: PaymentReceiptMissingRow) =>
  `${row.first_name} ${row.last_name}`.trim();

// Holder + alias only: the CBU never goes into this file.
const accountText = (row: PaymentReceiptMissingRow) =>
  row.account ? `${row.account.holder_name} (${row.account.alias})` : "";

export const missingRows = (rows: unknown): PaymentReceiptMissingRow[] =>
  Array.isArray(rows)
    ? (rows as PaymentReceiptMissingRow[]).filter(
        (row) => row?.status === "missing",
      )
    : [];

export const missingExcelCells = (
  rows: PaymentReceiptMissingRow[],
  labels: MissingExcelLabels,
): ExcelCell[][] => [
  labels.headers.map(textCell),
  ...rows.map((row) => [
    textCell(fullName(row)),
    textCell(row.bgg_user),
    textCell(row.email),
    textCell(row.location),
    moneyCell(row.amount),
    textCell(accountText(row)),
    textCell(labels.status),
  ]),
];

export const missingWorksheet = (cells: ExcelCell[][]) => {
  const sheet = XLSX.utils.aoa_to_sheet(cells as any[][]);
  sheet["!cols"] = [28, 20, 30, 18, 18, 36, 18].map((wch) => ({ wch }));
  return sheet;
};

const slug = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const pad = (n: number) => String(n).padStart(2, "0");

// sin-comprobante-<edition>-<YYYY-MM-DD>.xlsx (local date)
export const missingFileName = (edition: unknown, date: Date = new Date()) => {
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const name = slug(typeof edition === "string" ? edition : "") || "edicion";
  return `sin-comprobante-${name}-${day}.xlsx`;
};

export const downloadMissingExcel = (
  rows: PaymentReceiptMissingRow[],
  labels: MissingExcelLabels,
  edition: unknown,
) => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    missingWorksheet(missingExcelCells(rows, labels)),
    "Sheet1",
  );
  XLSX.writeFile(workbook, missingFileName(edition));
};
