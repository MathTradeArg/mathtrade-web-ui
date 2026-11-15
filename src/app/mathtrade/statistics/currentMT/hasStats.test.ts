import { test } from "node:test";
import assert from "node:assert/strict";
import { hasStats } from "./hasStats.ts";
import { locsToGraph } from "./map/utils.ts";
import { segmentsToColumns } from "./segments/utils.ts";

test("hasStats is false for empty bodies", () => {
  assert.equal(hasStats(undefined), false);
  assert.equal(hasStats({}), false);
  assert.equal(hasStats({ items_count: 0, locations: [] }), false);
});
test("hasStats is true with data", () => {
  assert.equal(hasStats({ items_count: 3 }), true);
});
test("locsToGraph does not throw without locations", () => {
  const { list } = locsToGraph({});
  assert.equal(list.length > 0, true);
  assert.equal(list.every((r: any) => Number.isFinite(r.value)), true);
  locsToGraph(undefined);
});
test("locsToGraph skips null locations and avoids NaN with zero items", () => {
  const { list } = locsToGraph({
    locations: [{ location: null, games_count: 1, items_count: 0, users_count: 1 }],
  });
  assert.equal(list.every((r: any) => Number.isFinite(r.value)), true);
});
test("locsToGraph computes percentages", () => {
  const { list } = locsToGraph({
    locations: [
      { location: { province: "Córdoba" }, games_count: 1, items_count: 1, users_count: 1 },
      { location: { province: "AMBA" }, games_count: 3, items_count: 3, users_count: 2 },
    ],
  });
  const by = (t: string) => list.find((r: any) => r.title === t) as any;
  assert.equal(by("Córdoba").value, 25);
  assert.equal(by("AMBA").value, 75);
});
test("segmentsToColumns tolerates missing input and does not mutate", () => {
  assert.deepEqual(segmentsToColumns(undefined), []);
  const input = [
    { item_segment: 2, users_count: 5 },
    { item_segment: 1, users_count: 7 },
  ];
  assert.equal(segmentsToColumns(input)[0][1], 7);
  assert.equal(input[0].item_segment, 2);
});
