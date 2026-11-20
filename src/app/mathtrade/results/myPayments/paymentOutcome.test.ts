import { test } from "node:test";
import assert from "node:assert/strict";
import { hasPaymentsTab, paymentOutcome, refundAmount } from "./paymentOutcome.ts";

const base = {
  published: true,
  games_count: 0,
  breakdown: [],
  credit_amount: "0.00",
  refund: null,
} as any;

test("outcome depends on the sign of the net amount", () => {
  assert.equal(paymentOutcome("142.86"), "transfer");
  assert.equal(paymentOutcome("0.00"), "zero");
  assert.equal(paymentOutcome("-2649.50"), "refund");
  assert.equal(refundAmount("-2649.50"), "2649.50");
});

test("tab: hidden when unpublished or without games, credit or refund", () => {
  assert.equal(hasPaymentsTab(null), false);
  assert.equal(hasPaymentsTab({ published: false }), false);
  assert.equal(hasPaymentsTab(base), false);
  assert.equal(hasPaymentsTab({ ...base, breakdown: undefined, games_count: 3 }), false);
});

test("tab: shown with games, or credit-only, or a refund", () => {
  assert.equal(hasPaymentsTab({ ...base, games_count: 2 }), true);
  assert.equal(hasPaymentsTab({ ...base, credit_amount: "5000.00" }), true);
  assert.equal(hasPaymentsTab({ ...base, refund: { status: "missing" } }), true);
});
