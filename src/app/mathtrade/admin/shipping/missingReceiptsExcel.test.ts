import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as XLSXNs from "xlsx";
import {
  MONEY_FORMAT,
  missingExcelCells,
  missingFileName,
  missingRows,
  missingWorksheet,
  textCell,
} from "./missingReceiptsExcel.ts";

const XLSX: any = (XLSXNs as any).default ?? XLSXNs;

const labels = {
  headers: [
    "Nombre y apellido",
    "Usuario (bgg)",
    "Email",
    "Ciudad",
    "Monto a transferir",
    "Cuenta para transferir",
    "Estado",
  ],
  status: "sin comprobante",
};

const row = (over: Record<string, unknown> = {}): any => ({
  membership_id: 1,
  user_id: 2,
  first_name: "Ana",
  last_name: "Pérez",
  email: "ana@x.com",
  bgg_user: "anap",
  location: "Rosario",
  amount: "12345.50",
  account: {
    id: 1,
    holder_name: "Juan Gómez",
    alias: "juan.alias",
    cbu: "0000003100012345678901",
  },
  status: "missing",
  ...over,
});

test("amount is a real number cell with the money format, no hand-made separators", () => {
  const cells = missingExcelCells([row()], labels);
  assert.deepEqual(cells[1][4], { t: "n", v: 12345.5, z: MONEY_FORMAT });
});

test("columns, account without CBU, status", () => {
  const cells = missingExcelCells([row()], labels);
  assert.deepEqual(
    cells[0].map((c) => c.v),
    labels.headers,
  );
  assert.equal(cells[1][0].v, "Ana Pérez");
  assert.equal(cells[1][5].v, "Juan Gómez (juan.alias)");
  assert.equal(cells[1][6].v, "sin comprobante");
  assert.ok(!JSON.stringify(cells).includes("0000003100012345678901"));
});

test("no account or location gives empty text cells", () => {
  const cells = missingExcelCells(
    [row({ account: null, location: null })],
    labels,
  );
  assert.equal(cells[1][3].v, "");
  assert.equal(cells[1][5].v, "");
});

test("formula injection: text starting with = + - @ stays a string cell", () => {
  for (const evil of [
    "=1+1",
    "+cmd|' /C calc'!A0",
    "-2+3",
    "@SUM(A1)",
    "\t=1",
    "\r=1",
  ]) {
    const cells = missingExcelCells(
      [
        row({
          first_name: evil,
          last_name: "",
          bgg_user: evil,
          email: evil,
          account: { id: 1, holder_name: evil, alias: evil },
        }),
      ],
      labels,
    );
    for (const index of [0, 1, 2, 5])
      assert.equal(cells[1][index].t, "s", evil);
    assert.equal(cells[1][0].v, evil.trim()); // the full name is trimmed
    assert.equal(textCell(evil).t, "s");
  }
});

test("written workbook has no formula cells and keeps the number", () => {
  const cells = missingExcelCells([row({ first_name: "=1+1" })], labels);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, missingWorksheet(cells), "Sheet1");
  const back = XLSX.read(
    XLSX.write(book, { type: "buffer", bookType: "xlsx" }),
    { type: "buffer" },
  );
  const sheet = back.Sheets.Sheet1;
  assert.equal(sheet.A2.t, "s");
  assert.equal(sheet.A2.f, undefined);
  assert.equal(sheet.A2.v, "=1+1 Pérez");
  assert.equal(sheet.E2.t, "n");
  assert.equal(sheet.E2.v, 12345.5);
});

test("missingRows keeps only missing rows and tolerates non-arrays", () => {
  assert.equal(missingRows(null).length, 0);
  assert.equal(missingRows([row(), row({ status: "pending" })]).length, 1);
});

test("file name: edition slug and local date", () => {
  assert.equal(
    missingFileName("MT 8 Ñandú!", new Date(2026, 10, 5)),
    "sin-comprobante-mt-8-nandu-2026-11-05.xlsx",
  );
  assert.equal(
    missingFileName(undefined, new Date(2026, 10, 20)),
    "sin-comprobante-edicion-2026-11-20.xlsx",
  );
});

test("i18n keys used by the panels exist", () => {
  const es: Record<string, string> = JSON.parse(
    readFileSync(
      new URL("../../../../i18n/languages/es_AR.json", import.meta.url),
      "utf8",
    ),
  );
  for (const key of [
    "adminPayments.receipts.xls.btn",
    "adminPayments.receipts.xls.none",
    "adminPayments.receipts.xls.error",
    "adminPayments.receipts.xls.name",
    "adminPayments.receipts.xls.user",
    "adminPayments.receipts.xls.email",
    "adminPayments.receipts.xls.city",
    "adminPayments.receipts.xls.amount",
    "adminPayments.receipts.xls.account",
    "adminPayments.receipts.xls.status",
    "adminPayments.receipts.xls.statusValue",
    "adminPayments.receipts.xls.loading",
    "adminPayments.receipts.summary",
    "adminPayments.refunds.summary",
  ])
    assert.ok(es[key], key);
});
