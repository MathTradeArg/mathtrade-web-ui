// Run with: node --test src/utils/deliveryReports.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  nextReportToFetch,
  renderableReceived,
  openReportsByItem,
  reportActionFor,
  resolveReportTitle,
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

// Bug: the modal's effect re-ran on every render (new fetch callback each time),
// so GET delivery-reports/<id>/ fired in a loop and the spinner never settled.
test("nextReportToFetch fetches a report id once, however many renders follow", () => {
  let last: number | null = null;
  let fetches = 0;
  for (let render = 0; render < 50; render++) {
    const id = nextReportToFetch(last, 4);
    if (id !== null) {
      fetches++;
      last = id;
    }
  }
  assert.equal(fetches, 1);
});

test("nextReportToFetch fetches again for another id, and never without one", () => {
  assert.equal(nextReportToFetch(4, 5), 5);
  assert.equal(nextReportToFetch(4, null), null);
  assert.equal(nextReportToFetch(null, null), null);
});

test("renderableReceived drops rows without item_from (a null item crashed the list)", () => {
  const rows = [
    { id: 1, received: false, item_from: { id: 10 } },
    { id: 2, received: false, item_from: null },
    { id: 3, received: true, item_from: undefined },
    { id: 4, received: true, item_from: { id: 11 } },
  ];
  const out = renderableReceived(rows);
  assert.deepEqual(out.map((r) => r.id), [1, 4]);
  assert.ok(out.every((r) => r.item_from));
  assert.deepEqual(renderableReceived(null), []);
});

test("resolveReportTitle falls back to the loaded report's item title (permalink opens with an empty title)", () => {
  assert.equal(resolveReportTitle("", { item_title: "Catan" }), "Catan");
  assert.equal(resolveReportTitle(undefined, { item_title: " Catan " }), "Catan");
  assert.equal(resolveReportTitle("Azul", { item_title: "Catan" }), "Azul");
});

test("resolveReportTitle returns '' when no title is known, so no empty quotes are rendered", () => {
  assert.equal(resolveReportTitle("", null), "");
  assert.equal(resolveReportTitle("", { item_title: "" }), "");
  assert.equal(resolveReportTitle(null, undefined), "");
});
