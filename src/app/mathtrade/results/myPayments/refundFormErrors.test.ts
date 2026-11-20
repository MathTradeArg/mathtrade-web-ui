import { test } from "node:test";
import assert from "node:assert/strict";
import {
  hasRefundErrors,
  normalizeCbu,
  refundPayload,
  validateRefundForm,
} from "./refundFormErrors.ts";

const CBU22 = "0170099220000067797370";
const ok = { holder_name: "Ana Perez", alias: "ana.perez.mp", cbu: "" };

test("a valid form with alias only, CBU only, or both has no errors", () => {
  assert.deepEqual(validateRefundForm(ok), {});
  assert.deepEqual(validateRefundForm({ ...ok, alias: "", cbu: CBU22 }), {});
  assert.deepEqual(validateRefundForm({ ...ok, cbu: CBU22 }), {});
});

test("holder is 3 to 100 characters", () => {
  assert.equal(validateRefundForm({ ...ok, holder_name: "  A " }).holder_name, "payments.refund.error.holder");
  assert.equal(validateRefundForm({ ...ok, holder_name: "x".repeat(101) }).holder_name, "payments.refund.error.holder");
  assert.equal(validateRefundForm({ ...ok, holder_name: "x".repeat(100) }).holder_name, undefined);
});

test("alias is 6 to 20 of letters, digits, dot, underscore, hyphen", () => {
  for (const bad of ["abc", "a".repeat(21), "ana perez", "ana@perez1", "ana,perez"]) {
    assert.equal(validateRefundForm({ ...ok, alias: bad }).alias, "payments.refund.error.alias", bad);
  }
  for (const good of ["abcdef", "a.b_c-d.e1", "A".repeat(20)]) {
    assert.equal(validateRefundForm({ ...ok, alias: good }).alias, undefined, good);
  }
});

test("CBU is exactly 22 digits; spaces are stripped, hyphens rejected", () => {
  assert.equal(validateRefundForm({ ...ok, cbu: CBU22.slice(1) }).cbu, "payments.refund.error.cbu");
  assert.equal(validateRefundForm({ ...ok, cbu: CBU22 + "1" }).cbu, "payments.refund.error.cbu");
  assert.equal(validateRefundForm({ ...ok, cbu: "0170-0992-2000-0067-7973-70" }).cbu, "payments.refund.error.cbu");
  assert.equal(validateRefundForm({ ...ok, cbu: "abcdefghijklmnopqrstuv" }).cbu, "payments.refund.error.cbu");
  assert.equal(validateRefundForm({ ...ok, cbu: "01700992 20000067 797370" }).cbu, undefined);
});

test("alias or CBU is required: the message goes on both", () => {
  const errors = validateRefundForm({ ...ok, alias: " ", cbu: " " });
  assert.equal(errors.alias, "payments.refund.error.aliasOrCbu");
  assert.equal(errors.cbu, "payments.refund.error.aliasOrCbu");
  assert.equal(hasRefundErrors(errors), true);
  assert.equal(hasRefundErrors({}), false);
});

test("payload is trimmed and the CBU has no spaces", () => {
  assert.deepEqual(
    refundPayload({ holder_name: " Ana Perez ", alias: " ana.perez.mp ", cbu: "0170 0992 2000 0067 7973 70" }),
    { holder_name: "Ana Perez", alias: "ana.perez.mp", cbu: CBU22 }
  );
  assert.equal(normalizeCbu(" 1 2 "), "12");
});
