import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FallbackLoading } from "./index.tsx";
import { InlineLoading } from "@/components/loading";

const html = (node: any) => renderToStaticMarkup(node);
const count = (source: string, pattern: RegExp) => (source.match(pattern) || []).length;

test("Dynamic fallback renders the dice and not the old gray icon", () => {
  const markup = html(createElement(FallbackLoading, { h: 450 }));
  assert.match(markup, /aria-hidden="true"/);
  assert.equal(count(markup, /class="[^"]*\bdice-face\b/g), 6);
  assert.doesNotMatch(markup, /text-gray-400/);
  assert.doesNotMatch(markup, /<svg|<i class="[^"]*icon/);
});

test("Dynamic fallback keeps the minimum height it was given", () => {
  const markup = html(createElement(FallbackLoading, { h: 320 }));
  assert.match(markup, /min-height:320px/);
});

test("InlineLoading renders the dice centered with the given minimum height", () => {
  const markup = html(createElement(InlineLoading, { minHeight: 200 }));
  assert.equal(count(markup, /class="[^"]*\bdice-face\b/g), 6);
  assert.match(markup, /min-height:200px/);
  assert.match(markup, /dice-fallback/);
});
