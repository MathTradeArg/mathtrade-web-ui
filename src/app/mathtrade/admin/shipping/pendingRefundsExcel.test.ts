import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as XLSXNs from "xlsx";
import { MONEY_FORMAT } from "./missingReceiptsExcel.ts";
import {
  dueRefundRows,
  listRows,
  pendingRefundsCells,
  pendingRefundsFileName,
  pendingRefundsWorksheet,
  sortPendingRefunds,
} from "./pendingRefundsExcel.ts";

const XLSX: any = (XLSXNs as any).default ?? XLSXNs;

const labels = {
  headers: [
    "Nombre y apellido",
    "Usuario (bgg)",
    "Email",
    "Ciudad",
    "Monto a devolver",
    "Titular",
    "Alias",
    "CBU",
    "Estado",
  ],
  statusPending: "datos cargados",
  statusMissing: "sin datos de cuenta",
};

const pending = (over: Record<string, unknown> = {}): any => ({
  id: 1,
  membership_id: 1,
  user_id: 2,
  first_name: "Ana",
  last_name: "Pérez",
  email: "ana@x.com",
  bgg_user: "anap",
  location: "Rosario",
  holder_name: "Ana Pérez",
  alias: "ana.alias",
  cbu: "0000003100012345678901",
  amount: "1500.50",
  status: "pending",
  still_due: true,
  ...over,
});

const missing = (over: Record<string, unknown> = {}): any => ({
  id: null,
  membership_id: 9,
  user_id: 8,
  first_name: "Zoe",
  last_name: "Álvarez",
  email: "zoe@x.com",
  bgg_user: "zoe",
  location: null,
  amount: "200.00",
  status: "missing",
  still_due: true,
  ...over,
});

test("columns, amount as number cell, CBU as text, status text", () => {
  const cells = pendingRefundsCells([pending()], labels);
  assert.deepEqual(cells[0].map((c) => c.v), labels.headers);
  const r = cells[1];
  assert.equal(r[0].v, "Ana Pérez");
  assert.equal(r[1].v, "anap");
  assert.equal(r[3].v, "Rosario");
  assert.deepEqual(r[4], { t: "n", v: 1500.5, z: MONEY_FORMAT });
  assert.deepEqual(r[5], { t: "s", v: "Ana Pérez" });
  assert.deepEqual(r[7], { t: "s", v: "0000003100012345678901" });
  assert.equal(r[8].v, "datos cargados");
});

test("missing rows: empty account cells and their status", () => {
  const r = pendingRefundsCells([missing()], labels)[1];
  assert.equal(r[3].v, "");
  assert.deepEqual([r[5].v, r[6].v, r[7].v], ["", "", ""]);
  assert.equal(r[8].v, "sin datos de cuenta");
});

test("data loaded first, then missing, each group by last name", () => {
  const rows = [
    missing({ last_name: "Zeta", first_name: "A" }),
    pending({ last_name: "Ñandú", first_name: "B" }),
    missing({ last_name: "álvarez", first_name: "C" }),
    pending({ last_name: "Pérez", first_name: "D" }),
    pending({ last_name: "Pérez", first_name: "A" }),
    pending({ last_name: "Abad", first_name: "E" }),
  ];
  const out = sortPendingRefunds(rows).map(
    (r: any) => `${r.status}:${r.last_name}:${r.first_name}`,
  );
  assert.deepEqual(out, [
    "pending:Abad:E",
    "pending:Ñandú:B",
    "pending:Pérez:A",
    "pending:Pérez:D",
    "missing:álvarez:C",
    "missing:Zeta:A",
  ]);
});

test("dueRefundRows drops refunded, not still due and junk", () => {
  const rows = [
    pending(),
    pending({ still_due: false }),
    pending({ status: "refunded" }),
    missing(),
    null,
  ];
  assert.equal(dueRefundRows(rows).length, 2);
  assert.deepEqual(dueRefundRows(undefined), []);
  assert.deepEqual(dueRefundRows({ detail: "x" }), []);
});

test("empty list gives only the header row", () => {
  const cells = pendingRefundsCells([], labels);
  assert.equal(cells.length, 1);
});

test("listRows: bare list, {results} and a truncated page", () => {
  assert.deepEqual(listRows([1]), { rows: [1], partial: false });
  assert.deepEqual(listRows({ results: [1], next: null }), {
    rows: [1],
    partial: false,
  });
  assert.equal(listRows({ results: [1], next: "http://x?page=2" }).partial, true);
  assert.deepEqual(listRows(undefined), { rows: [], partial: false });
});

test("formula injection: every text cell stays a string cell in the xlsx", () => {
  const evil = ["=1+1", "+cmd|' /C calc'!A0", "-2+3", "@SUM(A1)", "\t=1"];
  const rows = evil.flatMap((e) => [
    pending({
      first_name: e,
      last_name: "",
      bgg_user: e,
      email: e,
      location: e,
      holder_name: e,
      alias: e,
      cbu: e,
    }),
    missing({ first_name: e, last_name: "", bgg_user: e, email: e }),
  ]);
  const cells = pendingRefundsCells(rows, labels);
  cells.forEach((row, r) =>
    row.forEach((cell, i) => {
      if (r === 0 || i !== 4) assert.equal(cell.t, "s");
    }),
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, pendingRefundsWorksheet(cells), "S");
  const path = `${process.env.TMPDIR || "/tmp"}/pending-refunds-${process.pid}.xlsx`;
  XLSX.writeFile(workbook, path);
  const back = XLSX.read(readFileSync(path), { cellFormula: true, cellNF: true });
  const sheet = back.Sheets[back.SheetNames[0]];
  for (const ref of Object.keys(sheet)) {
    if (ref.startsWith("!")) continue;
    const cell = sheet[ref];
    assert.equal(cell.f, undefined, `${ref} must not be a formula`);
    if (!/^E(?!1$)\d+$/.test(ref)) assert.equal(cell.t, "s", ref);
  }
  assert.ok(Object.values(sheet).some((c: any) => c?.v === "=1+1" && c.t === "s"));
  const money = sheet["E2"];
  assert.equal(money.t, "n");
  assert.equal(money.v, 1500.5);
  assert.equal(money.z, MONEY_FORMAT);
});

test("file name", () => {
  const d = new Date(2026, 10, 20);
  assert.equal(
    pendingRefundsFileName("Math Trade 8 Ñ", d),
    "devoluciones-pendientes-math-trade-8-n-2026-11-20.xlsx",
  );
  assert.equal(
    pendingRefundsFileName(undefined, d),
    "devoluciones-pendientes-edicion-2026-11-20.xlsx",
  );
});
