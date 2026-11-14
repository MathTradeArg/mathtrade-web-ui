// Run with: node --test src/utils/adminEmailPreferences.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ADMIN_EMAIL_KINDS,
  fromApi,
  toApi,
  togglePref,
  type AdminEmailPreferencesApi,
} from "./adminEmailPreferences.ts";

const api: AdminEmailPreferencesApi = {
  admin_email_item_observation: true,
  admin_email_delivery_created: false,
  admin_email_delivery_comment: true,
  admin_email_delivery_closed: false,
  admin_email_bug_report: true,
};

test("fromApi maps the five fields by kind", () => {
  assert.deepEqual(fromApi(api), {
    item_observation: true,
    delivery_created: false,
    delivery_comment: true,
    delivery_closed: false,
    bug_report: true,
  });
});

test("fromApi gives false for missing or null fields", () => {
  const prefs = fromApi({ admin_email_bug_report: true, admin_email_delivery_closed: null } as any);
  assert.equal(prefs.bug_report, true);
  assert.equal(prefs.delivery_closed, false);
  assert.equal(prefs.item_observation, false);
  assert.deepEqual(fromApi(null), fromApi(undefined));
  assert.ok(ADMIN_EMAIL_KINDS.every((k) => fromApi(null)[k] === false));
});

test("toApi returns exactly the five admin_email_* keys", () => {
  assert.deepEqual(Object.keys(toApi(fromApi(api))).sort(), Object.keys(api).sort());
});

test("toApi(fromApi(x)) is x", () => {
  assert.deepEqual(toApi(fromApi(api)), api);
});

test("togglePref flips only the requested kind without mutating", () => {
  const prefs = fromApi(api);
  const copy = { ...prefs };
  const next = togglePref(prefs, "delivery_created");
  assert.equal(next.delivery_created, true);
  assert.deepEqual({ ...next, delivery_created: false }, copy);
  assert.deepEqual(prefs, copy);
});
