import { test } from "node:test";
import assert from "node:assert/strict";
import {
  absAmount,
  amountSign,
  formatAmount,
  negateAmount,
  parseCents,
  parsePriceInput,
  priceToInput,
  subtractAmounts,
} from "./money.ts";

const norm = (s: string) => s.replace(/\s/g, " ");

test("parseCents handles API strings without float errors", () => {
  assert.equal(parseCents("333.34"), 33334);
  assert.equal(parseCents("0.1"), 10);
  assert.equal(parseCents("1000"), 100000);
  assert.equal(parseCents("abc"), null);
  assert.equal(parseCents("1e3"), null);
});

test("formatAmount: whole amounts without decimals, others with 2", () => {
  assert.equal(norm(formatAmount("1000.00")), norm((1000).toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 })));
  assert.match(formatAmount("333.34"), /333,34/);
  assert.equal(formatAmount("nope"), "nope");
});

test("parsePriceInput is strict", () => {
  assert.equal(parsePriceInput("1500"), "1500");
  assert.equal(parsePriceInput("1500,5"), "1500.5");
  assert.equal(parsePriceInput(" 1500.25 "), "1500.25");
  for (const bad of ["", "0", "0,00", "1.500,00", "1,500.00", "1e3", "0x10", "-5", "1.234", "12a"]) {
    assert.equal(parsePriceInput(bad), null, bad);
  }
});

test("priceToInput trims empty cents", () => {
  assert.equal(priceToInput("1500.00"), "1500");
  assert.equal(priceToInput("1500.50"), "1500.50");
});

test("subtractAmounts works in cents and can go negative", () => {
  assert.equal(subtractAmounts("2350.50", "5000.00"), "-2649.50");
  assert.equal(subtractAmounts("5142.86", "5000"), "142.86");
  assert.equal(subtractAmounts("0.30", "0.10"), "0.20");
  assert.equal(subtractAmounts("5000.00", "5000.00"), "0.00");
});

test("negateAmount, absAmount and amountSign", () => {
  assert.equal(negateAmount("5000.00"), "-5000.00");
  assert.equal(negateAmount("-5000.00"), "5000.00");
  assert.equal(negateAmount("0.00"), "0.00");
  assert.equal(absAmount("-2649.50"), "2649.50");
  assert.equal(amountSign("-0.01"), -1);
  assert.equal(amountSign("0.00"), 0);
  assert.equal(amountSign("12"), 1);
  assert.equal(amountSign("nope"), 0);
});

test("formatAmount keeps the sign of negative amounts", () => {
  assert.match(norm(formatAmount("-5000.00")), /^-\s?\$\s?5\.000$/);
  assert.match(formatAmount("-2649.50"), /2\.649,50/);
  assert.match(formatAmount("-2649.50"), /^-/);
});

test("formatAmount never shows a negative zero", () => {
  for (const zero of ["-0.00", "-0", "-0.0", 0, -0]) {
    assert.equal(norm(formatAmount(zero)), norm(formatAmount("0.00")));
    assert.ok(!String(formatAmount(zero)).includes("-"));
  }
  assert.match(norm(formatAmount("-5.50")), /^-/);
});

test("incoming = net of all rows + refunds due (admin accounts table footer)", () => {
  // net of all rows has the refunds as negative rows: 4000.50 owed - 1000.25 refunded.
  const net = "3000.25";
  const refundsDue = "1000.25";
  const incoming = subtractAmounts(net, negateAmount(refundsDue));
  assert.equal(incoming, "4000.50");
  // And the footer balance (net) is incoming minus the refunds.
  assert.equal(subtractAmounts(incoming, refundsDue), net);
  assert.equal(formatAmount(negateAmount(refundsDue)), formatAmount("-1000.25"));
});
