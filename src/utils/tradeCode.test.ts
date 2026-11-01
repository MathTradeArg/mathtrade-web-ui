// Run with: node --test src/utils/tradeCode.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatTradeCode } from "./tradeCode.ts";

test("pads to 4 digits and keeps longer codes", () => {
  assert.equal(formatTradeCode(10), "0010");
  assert.equal(formatTradeCode("345"), "0345");
  assert.equal(formatTradeCode(16120), "16120");
  assert.equal(formatTradeCode(null), "—");
  assert.equal(formatTradeCode(0), "0000");
});
