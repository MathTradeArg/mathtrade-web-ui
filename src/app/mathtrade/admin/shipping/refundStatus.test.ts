import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { REFUND_ROW_STATUSES } from "./types.ts";

const es: Record<string, string> = JSON.parse(
  readFileSync(new URL("../../../../i18n/languages/es_AR.json", import.meta.url), "utf8")
);

test("every refund row status has an i18n key", () => {
  for (const status of REFUND_ROW_STATUSES) {
    assert.ok(es[`adminPayments.refunds.status.${status}`], status);
  }
});

test("the BE contract is pending/refunded/missing/donated (no 'submitted' in the admin list)", () => {
  assert.deepEqual([...REFUND_ROW_STATUSES], ["pending", "refunded", "missing", "donated"]);
  assert.equal(es["adminPayments.refunds.status.submitted"], undefined);
});
