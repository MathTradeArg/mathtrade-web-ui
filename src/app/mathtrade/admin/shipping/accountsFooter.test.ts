import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { accountsFooter, footerIdentityHolds } from "./accountsFooter.ts";
import { REFUND_ROW_STATUSES } from "./types.ts";

const es: Record<string, string> = JSON.parse(
  readFileSync(new URL("../../../../i18n/languages/es_AR.json", import.meta.url), "utf8")
);

// Members: pay 10000.10 + 5000.05, refund due 3000.00, donor net -5000.00.
// net = 10000.10 + 5000.05 - 3000.00 - 5000.00 = 7000.15; balance = net + donated.
const summary = {
  totals: { net: "7000.15", balance: "12000.15" },
  refunds: { due_total: "3000.00", donated: { count: 1, total: "5000.00" } },
};

test("incoming counts the donations and the identity holds", () => {
  const f = accountsFooter(summary);
  assert.equal(f.incoming, "15000.15");
  assert.equal(f.refunds, "-3000.00");
  assert.equal(f.balance, "12000.15");
  assert.equal(footerIdentityHolds(summary), true);
});

test("old formula (net + due) would be wrong with donors", () => {
  const oldIncoming = "10000.15";
  assert.notEqual(oldIncoming, accountsFooter(summary).incoming);
});

test("no donors: same as before", () => {
  const s = {
    totals: { net: "7000.15", balance: "7000.15" },
    refunds: { due_total: "3000.00", donated: { count: 0, total: "0.00" } },
  };
  assert.equal(accountsFooter(s).incoming, "10000.15");
  assert.equal(footerIdentityHolds(s), true);
});

test("cents stay exact and a body without donated still works", () => {
  const s = { totals: { net: "0.10", balance: "0.10" }, refunds: { due_total: "0.20" } };
  assert.equal(accountsFooter(s).incoming, "0.30");
  assert.equal(footerIdentityHolds(s), true);
});

test("a mismatching balance is detected", () => {
  assert.equal(
    footerIdentityHolds({ ...summary, totals: { net: "7000.15", balance: "7000.15" } }),
    false,
  );
});

test("donated is a refund row status with i18n and a filter label", () => {
  assert.ok(REFUND_ROW_STATUSES.includes("donated"));
  assert.ok(es["adminPayments.refunds.status.donated"]);
  assert.ok(es["adminPayments.refunds.filter.donated"]);
});
