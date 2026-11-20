import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  DONATION_WORD,
  donationErrorText,
  donationPayload,
  donationWordMatches,
} from "./donation.ts";

const es: Record<string, string> = JSON.parse(
  readFileSync(new URL("../../../../i18n/languages/es_AR.json", import.meta.url), "utf8")
);

test("the confirmation word matches like the server: trimmed, any case", () => {
  for (const typed of ["DONAR", "donar", "Donar", "  DONAR  ", "\tdonar\n"]) {
    assert.equal(donationWordMatches(typed), true, JSON.stringify(typed));
  }
});

test("anything else does not enable the button", () => {
  for (const typed of ["", " ", "DONA", "DONARR", "DON AR", "donar!", "si", null, undefined, 5]) {
    assert.equal(donationWordMatches(typed), false, JSON.stringify(typed));
  }
});

test("the payload always sends the canonical word", () => {
  assert.deepEqual(donationPayload(), { confirmation: DONATION_WORD });
});

test("BE error shapes become plain text", () => {
  assert.equal(donationErrorText({ status: 400, data: { confirmation: ["Escribí DONAR"] } }), "Escribí DONAR");
  assert.equal(donationErrorText({ status: 400, data: ["Ya donaste tu devolución."] }), "Ya donaste tu devolución.");
  assert.equal(donationErrorText({ status: 400, data: { detail: "No." } }), "No.");
  assert.equal(donationErrorText({ status: 500, data: ["boom"] }), undefined);
  assert.equal(donationErrorText({ status: 0, data: null }), undefined);
  assert.equal(donationErrorText(null), undefined);
});

test("every donation text has an i18n key", () => {
  for (const key of [
    "payments.refund.donate.checkbox",
    "payments.refund.donate.step1.title",
    "payments.refund.donate.step1.text",
    "payments.refund.donate.step1.confirm",
    "payments.refund.donate.step2.title",
    "payments.refund.donate.step2.text",
    "payments.refund.donate.step2.label",
    "payments.refund.donate.step2.confirm",
    "payments.refund.donate.done",
    "payments.refund.donate.doneReadOnly",
    "payments.refund.donate.doneHelp",
    "payments.refund.donate.error",
  ]) {
    assert.ok(es[key], key);
  }
});
