// Run with: node --test src/utils/myReports.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  fromDeliveryRow,
  fromItemRow,
  mergeMyReports,
  type MyReportItem,
} from "./myReports.ts";
import type { DeliveryReportRow } from "./deliveryReports.ts";

const mk = (over: Partial<MyReportItem>): MyReportItem => ({
  kind: "item",
  id: 1,
  created: "2026-11-10T10:00:00-03:00",
  status: "open",
  title: "Catan",
  commentsCount: 0,
  ...over,
});

test("merges item and delivery rows by date desc", () => {
  const rows = mergeMyReports(
    [
      mk({ kind: "item", id: 1, created: "2026-11-10T10:00:00-03:00" }),
      mk({ kind: "delivery", id: 2, created: "2026-11-12T10:00:00-03:00" }),
      mk({ kind: "item", id: 3, created: "2026-11-11T10:00:00-03:00" }),
    ],
    "open"
  );
  assert.deepEqual(rows.map((r) => r.id), [2, 3, 1]);
});

test("filters by status", () => {
  const all = [mk({ id: 1, status: "open" }), mk({ id: 2, status: "closed" })];
  assert.deepEqual(mergeMyReports(all, "open").map((r) => r.id), [1]);
  assert.deepEqual(mergeMyReports(all, "closed").map((r) => r.id), [2]);
});

test("item row maps commentsCount", () => {
  const r = fromItemRow({
    id: 5,
    created: "2026-11-10T10:00:00-03:00",
    status: "closed",
    item_title: "Azul",
    comments_count: 3,
  });
  assert.deepEqual(r, {
    kind: "item",
    id: 5,
    created: "2026-11-10T10:00:00-03:00",
    status: "closed",
    title: "Azul",
    commentsCount: 3,
  });
});

test("delivery row maps comments.length", () => {
  const person = { id: 1, first_name: "A", last_name: "B" };
  const row = {
    id: 9,
    status: "open",
    created: "2026-11-10T10:00:00-03:00",
    item_title: "Wingspan",
    comments: [
      { id: 1, user: person, comment: "x", created: "" },
      { id: 2, user: person, comment: "y", created: "" },
    ],
  } as unknown as DeliveryReportRow;
  const r = fromDeliveryRow(row);
  assert.equal(r.kind, "delivery");
  assert.equal(r.id, 9);
  assert.equal(r.title, "Wingspan");
  assert.equal(r.commentsCount, 2);
});

test("ties keep stable order", () => {
  const same = "2026-11-10T10:00:00-03:00";
  const rows = mergeMyReports(
    [mk({ id: 1, created: same }), mk({ id: 2, created: same }), mk({ id: 3, created: same })],
    "open"
  );
  assert.deepEqual(rows.map((r) => r.id), [1, 2, 3]);
});
