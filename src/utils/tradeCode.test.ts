// Run with: node --test src/utils/tradeCode.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatTradeCode } from "./tradeCode.ts";

test("pads to 5 digits and keeps longer codes", () => {
  assert.equal(formatTradeCode(10), "00010");
  assert.equal(formatTradeCode("345"), "00345");
  assert.equal(formatTradeCode(16120), "16120");
  assert.equal(formatTradeCode(null), "—");
  assert.equal(formatTradeCode(0), "00000");
});
