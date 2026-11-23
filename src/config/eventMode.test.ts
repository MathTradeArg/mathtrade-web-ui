import { test } from "node:test";
import assert from "node:assert/strict";
import {
  EVENT_LOCK_CAPTION,
  isEventOpenPath,
  routeGate,
  withEventLocks,
} from "./eventMode.ts";

test("isEventOpenPath: Home and the open sections, with subroutes", () => {
  for (const path of [
    "/mathtrade",
    "/mathtrade/",
    "/mathtrade/results",
    "/mathtrade/results/",
    "/mathtrade/results/123",
    "/mathtrade/results-historial",
    "/mathtrade/my-reports",
    "/MathTrade/Results",
  ]) {
    assert.equal(isEventOpenPath(path), true, path);
  }
});

test("isEventOpenPath: everything else is closed", () => {
  for (const path of [
    "/mathtrade/my-wants",
    "/mathtrade/my-data",
    "/mathtrade/offer",
    "/mathtrade/faqs",
    "/mathtrade/provisional-results",
    "/mathtrade/admin",
    "/mathtrade/resultsX",
    "/mathtrade/my-reportsX",
    "/mathtradeX",
    "/my-data",
    "",
    null,
  ]) {
    assert.equal(isEventOpenPath(path), false, String(path));
  }
});

const KEYS = ["HOME", "RESULTS", "RESULTS_HISTORIAL", "MY_REPORTS", "WANTS", "MY_DATA", "OFFER"];

test("withEventLocks: only the closed keys get the event lock", () => {
  const locks = withEventLocks(KEYS, {});
  assert.deepEqual(Object.keys(locks).sort(), ["MY_DATA", "OFFER", "WANTS"]);
  for (const key of ["MY_DATA", "OFFER", "WANTS"]) {
    assert.equal(locks[key].captionId, EVENT_LOCK_CAPTION);
    assert.equal(locks[key].captionId, "menu.locked.eventMode");
  }
});

test("withEventLocks: an open key keeps its date lock", () => {
  const dateLock = { daysLeft: 3, captionId: "menu.locked.results.days" };
  const locks = withEventLocks(KEYS, { RESULTS: dateLock });
  assert.deepEqual(locks.RESULTS, dateLock);
  assert.equal(locks.HOME, undefined);
});

test("withEventLocks: a closed key's base lock is replaced", () => {
  const locks = withEventLocks(KEYS, {
    WANTS: { daysLeft: 2, captionId: "menu.locked.wants.days", displayValue: 2 },
  });
  assert.equal(locks.WANTS.captionId, EVENT_LOCK_CAPTION);
  assert.equal(locks.WANTS.displayValue, undefined);
});

test("withEventLocks: does not mutate the base", () => {
  const base = {};
  withEventLocks(KEYS, base);
  assert.deepEqual(base, {});
});

test("routeGate: flag off lets everything through", () => {
  for (const pathname of ["/mathtrade", "/mathtrade/my-wants", "/mathtrade/admin"]) {
    assert.equal(routeGate({ eventMode: false, isAdmin: false, pathname }), "allow");
  }
});

test("routeGate: flag on, participant", () => {
  for (const pathname of [
    "/mathtrade",
    "/mathtrade/results",
    "/mathtrade/results-historial",
    "/mathtrade/my-reports",
  ]) {
    assert.equal(routeGate({ eventMode: true, isAdmin: false, pathname }), "allow", pathname);
  }
  assert.equal(
    routeGate({ eventMode: true, isAdmin: false, pathname: "/mathtrade/my-wants" }),
    "blocked"
  );
});

test("routeGate: admin always passes", () => {
  assert.equal(routeGate({ eventMode: true, isAdmin: true, pathname: "/mathtrade/my-wants" }), "allow");
  assert.equal(routeGate({ eventMode: null, isAdmin: true, pathname: "/mathtrade/my-wants" }), "allow");
});

test("routeGate: unknown state waits on closed routes only", () => {
  assert.equal(
    routeGate({ eventMode: null, isAdmin: false, pathname: "/mathtrade/my-wants" }),
    "loading"
  );
  assert.equal(routeGate({ eventMode: null, isAdmin: false, pathname: "/mathtrade" }), "allow");
  assert.equal(
    routeGate({ eventMode: null, isAdmin: false, pathname: "/mathtrade/results" }),
    "allow"
  );
});
