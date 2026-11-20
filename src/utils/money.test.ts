import { test } from "node:test";
import assert from "node:assert/strict";
import { formatAmount, parseCents, parsePriceInput, priceToInput } from "./money.ts";

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
