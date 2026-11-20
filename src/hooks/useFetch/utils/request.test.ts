import { test } from "node:test";
import assert from "node:assert/strict";
import { dispatchRequest } from "./request.ts";

const fakeClient = () => {
  const calls: Array<[string, ...unknown[]]> = [];
  const record = (name: string) => (...args: unknown[]) => {
    calls.push([name, ...args]);
    return Promise.resolve({ ok: true });
  };
  return {
    calls,
    client: {
      get: record("get"),
      post: record("post"),
      put: record("put"),
      patch: record("patch"),
      delete: record("delete"),
    },
  };
};

test("PATCH goes out as a PATCH with the body (not a GET with query params)", async () => {
  const { client, calls } = fakeClient();
  await dispatchRequest(client, { method: "PATCH", pathRequest: "api/x/", params: { price_per_game: 1200 } });
  assert.deepEqual(calls, [["patch", "api/x/", { price_per_game: 1200 }, undefined]]);
});

test("each method maps to its own call", async () => {
  const { client, calls } = fakeClient();
  await dispatchRequest(client, { method: "POST", pathRequest: "p", params: { a: 1 } });
  await dispatchRequest(client, { method: "PUT", pathRequest: "p", params: { a: 2 } });
  await dispatchRequest(client, { method: "DELETE", pathRequest: "p", params: null });
  await dispatchRequest(client, { method: "GET", pathRequest: "p", params: { q: 1 } });
  assert.deepEqual(calls.map((c) => c[0]), ["post", "put", "delete", "get"]);
});

test("FormData clears the JSON content type for PATCH too", async () => {
  const { client, calls } = fakeClient();
  const form = new FormData();
  await dispatchRequest(client, { method: "PATCH", pathRequest: "p", params: form });
  assert.deepEqual(calls[0][3], { headers: { "Content-Type": undefined } });
});
