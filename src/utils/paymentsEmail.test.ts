import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDueDate, publishEmailNotice } from "./paymentsEmail.ts";

test("first publish announces the recipients, once emailed it does not", () => {
  assert.deepEqual(publishEmailNotice({ emailed_at: null, email_recipients: 120 }), {
    kind: "first",
    recipients: 120,
  });
  assert.deepEqual(publishEmailNotice({ emailed_at: "2026-11-20T10:00:00Z", email_recipients: 120 }), {
    kind: "already",
  });
  assert.deepEqual(publishEmailNotice({ emailed_at: null, email_recipients: 0 }), {
    kind: "first",
    recipients: 0,
  });
});

test("an old or missing summary says nothing about the email", () => {
  assert.deepEqual(publishEmailNotice(null), { kind: "none" });
  assert.deepEqual(publishEmailNotice({}), { kind: "none" });
});

test("formatDueDate is dd/mm/yyyy without timezone shifts", () => {
  assert.equal(formatDueDate("2026-11-25"), "25/11/2026");
  assert.equal(formatDueDate("2026-01-02"), "02/01/2026");
  assert.equal(formatDueDate(null), "");
  assert.equal(formatDueDate("25/11/2026"), "");
  assert.equal(formatDueDate("2026-11-25T00:00:00Z"), "");
});
