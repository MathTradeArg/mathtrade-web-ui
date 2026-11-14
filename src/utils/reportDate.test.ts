import { test } from "node:test";
import assert from "node:assert/strict";
import { formatReportDate } from "./reportDate.ts";

test("formats in Buenos Aires time", () => {
  assert.equal(formatReportDate("2026-11-13T15:05:00Z"), "13/11/2026 12:05");
});
test("crosses the day boundary", () => {
  assert.equal(formatReportDate("2026-11-13T02:00:00Z"), "12/11/2026 23:00");
});
test("midnight is 00:00 not 24:00", () => {
  assert.equal(formatReportDate("2026-11-13T00:00:00-03:00"), "13/11/2026 00:00");
});
test("accepts DRF offset strings", () => {
  assert.equal(formatReportDate("2026-11-13T12:05:00-03:00"), "13/11/2026 12:05");
});
test("returns input when invalid", () => {
  assert.equal(formatReportDate("no es fecha"), "no es fecha");
});
test("empty for null/undefined/''", () => {
  assert.equal(formatReportDate(null), "");
  assert.equal(formatReportDate(undefined), "");
  assert.equal(formatReportDate(""), "");
});
