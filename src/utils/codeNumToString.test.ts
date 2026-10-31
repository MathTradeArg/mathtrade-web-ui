// Run with: node --test src/utils/codeNumToString.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { codeNumToString } from "../context/boxDelivery/utils.ts";

test("pads short codes to 4 digits", () => {
  assert.equal(codeNumToString(10), "0010");
  assert.equal(codeNumToString(9990), "9990");
});

test("never cuts codes of 5 digits or more", () => {
  assert.equal(codeNumToString(16120), "16120");
  assert.equal(codeNumToString(26120), "26120");
  assert.notEqual(codeNumToString(16120), codeNumToString(26120));
});

test("empty code is blank, not 'null'", () => {
  assert.equal(codeNumToString(null), "");
  assert.equal(codeNumToString(undefined), "");
});
