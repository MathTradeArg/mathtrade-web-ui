// Run with: node --test src/utils/deliveryReports.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  openReportsByItem,
  reportActionFor,
  splitPhotos,
  validateReportForm,
  type DeliveryReportRow,
} from "./deliveryReports.ts";

const person = { id: 1, first_name: "A", last_name: "B" };
const row = (over: Partial<DeliveryReportRow>): DeliveryReportRow => ({
  id: 1,
  status: "open",
  created: "",
  closed_at: null,
  item_id: 10,
  item_title: "Game",
  trade: 5,
  images: [],
  comment: "x",
  reporter: person,
  reported: person,
  role: "reporter",
  can_comment: true,
  can_close: true,
  comments: [],
  ...over,
});

test("splitPhotos drops blanks and trims", () => {
  assert.deepEqual(splitPhotos(" a.jpg, ,b.png "), ["a.jpg", "b.png"]);
  assert.deepEqual(splitPhotos(""), []);
  assert.deepEqual(splitPhotos(null), []);
});

test("form needs a comment and 1 to 3 photos", () => {
  assert.deepEqual(validateReportForm("", ""), { comment: "required", images: "required" });
  assert.deepEqual(validateReportForm("   ", "a.jpg"), { comment: "required" });
  assert.deepEqual(validateReportForm("roto", ""), { images: "required" });
  assert.deepEqual(validateReportForm("roto", "a.jpg"), {});
  assert.deepEqual(validateReportForm("roto", "a.jpg,b.jpg,c.jpg"), {});
  assert.deepEqual(validateReportForm("roto", "a,b,c,d"), { images: "max" });
});

test("openReportsByItem keeps only open reports, keyed by item", () => {
  const map = openReportsByItem([
    row({ id: 1, item_id: 10 }),
    row({ id: 2, item_id: 11, status: "closed" }),
    row({ id: 3, item_id: null }),
  ]);
  assert.deepEqual(Object.keys(map), ["10"]);
  assert.equal(map[10].id, 1);
  assert.deepEqual(openReportsByItem(undefined), {});
});

test("report action: none unless received, view when a report is open", () => {
  assert.equal(reportActionFor(false, null), "none");
  assert.equal(reportActionFor(false, row({})), "none");
  assert.equal(reportActionFor(true, null), "create");
  assert.equal(reportActionFor(true, row({})), "view");
});
