import { test } from "node:test";
import assert from "node:assert/strict";
import { pickLastError } from "./accountErrors.ts";

const refusedDeactivate = { status: 400, data: ["despublicá los pagos y recalculá, o dejá la cuenta activa."] };
const refusedDelete = { status: 400, data: ["La cuenta tiene comprobantes registrados; desactivala en lugar de borrarla."] };

test("shows the error of the latest call, not a stale one", () => {
  const errors = { list: null, create: null, update: refusedDeactivate, delete: refusedDelete };
  assert.equal(pickLastError("delete", errors), refusedDelete);
  assert.equal(pickLastError("update", errors), refusedDeactivate);
});

test("a successful latest call shows no error even if an older one failed", () => {
  const errors = { list: null, create: null, update: refusedDeactivate, delete: null };
  assert.equal(pickLastError("delete", errors), null);
  assert.equal(pickLastError("list", errors), null);
});
