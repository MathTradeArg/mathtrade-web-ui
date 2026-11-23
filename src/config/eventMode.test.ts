import { test } from "node:test";
import assert from "node:assert/strict";
import {
  EVENT_LOCK_CAPTION,
  isEventLock,
  isEventRestricted,
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

test("routeGate: open sections' subroutes pass, closed subroutes are blocked", () => {
  for (const pathname of [
    "/mathtrade/results/123",
    "/mathtrade/results-historial/7",
    "/mathtrade/my-reports/45",
  ]) {
    assert.equal(routeGate({ eventMode: true, isAdmin: false, pathname }), "allow", pathname);
  }
  for (const pathname of [
    "/mathtrade/my-wants/12",
    "/mathtrade/results-old",
    "/mathtrade/provisional-results",
    "/mathtrade/my-data",
  ]) {
    assert.equal(routeGate({ eventMode: true, isAdmin: false, pathname }), "blocked", pathname);
  }
});

test("routeGate: admin with the flag off passes everywhere", () => {
  for (const pathname of ["/mathtrade", "/mathtrade/my-wants", "/mathtrade/admin", null]) {
    assert.equal(routeGate({ eventMode: false, isAdmin: true, pathname }), "allow", String(pathname));
  }
});

test("isEventRestricted: hidden until current/ says the flag is off", () => {
  assert.equal(isEventRestricted({ eventMode: null, isAdmin: false }), true);
  assert.equal(isEventRestricted({ eventMode: true, isAdmin: false }), true);
  assert.equal(isEventRestricted({ eventMode: false, isAdmin: false }), false);
  assert.equal(isEventRestricted({ eventMode: true, isAdmin: true }), false);
  assert.equal(isEventRestricted({ eventMode: null, isAdmin: true }), false);
});

test("isEventLock: only the event-mode lock, not the date ones", () => {
  assert.equal(isEventLock({ daysLeft: 0, captionId: EVENT_LOCK_CAPTION }), true);
  assert.equal(isEventLock(withEventLocks(["WANTS"], {}).WANTS), true);
  assert.equal(isEventLock({ daysLeft: 3, captionId: "menu.locked.results.days" }), false);
  assert.equal(isEventLock(undefined), false);
  assert.equal(isEventLock(null), false);
});
