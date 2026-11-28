import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LoadingBox, PageLoading } from "./index.tsx";
import DiceLoader from "./DiceLoader.tsx";

const html = (node: any) => renderToStaticMarkup(node);
const count = (source: string, pattern: RegExp) => (source.match(pattern) || []).length;

test("DiceLoader renders six faces with 1 to 6 pips and is aria-hidden", () => {
  const markup = html(createElement(DiceLoader));
  assert.match(markup, /^<div[^>]*aria-hidden="true"/);
  assert.equal(count(markup, /class="[^"]*\bdice-face\b/g), 6);
  for (let n = 1; n <= 6; n++) {
    const face = markup.match(new RegExp(`<div class="dice-face dice-face-${n}">(.*?)</div>`));
    assert.ok(face, `face ${n}`);
    assert.equal(count(face[1], /<i><\/i>/g), n);
  }
});

test("DiceLoader exposes the size as a CSS variable", () => {
  assert.match(html(createElement(DiceLoader)), /--die-size:40px/);
  assert.match(html(createElement(DiceLoader, { size: 28 })), /--die-size:28px/);
});

test("LoadingBox and PageLoading render nothing while not loading", () => {
  assert.equal(html(createElement(LoadingBox, { loading: false })), "");
  assert.equal(html(createElement(PageLoading, { loading: false })), "");
});

test("LoadingBox keeps its container classes and renders a 40px die", () => {
  const markup = html(createElement(LoadingBox, { loading: true }));
  assert.match(markup, /^<div class="loading-box"/);
  assert.match(markup, /--die-size:40px/);
  assert.doesNotMatch(markup, /loading-graph/);
});

test("LoadingBox applies className, transparent, min, center and zIndex", () => {
  const markup = html(
    createElement(LoadingBox, {
      loading: true,
      className: "extra",
      transparent: true,
      min: true,
      center: true,
      zIndex: 7,
    })
  );
  assert.match(markup, /class="loading-box extra transparent min center"/);
  assert.match(markup, /style="z-index:7"/);
  assert.match(markup, /--die-size:28px/);
});

test("LoadingBox adds the center class only when center is set", () => {
  assert.match(html(createElement(LoadingBox, { loading: true, center: true })), /class="loading-box center"/);
  assert.doesNotMatch(html(createElement(LoadingBox, { loading: true })), /center/);
});

test("PageLoading without a sidebar covers the whole viewport", () => {
  const markup = html(createElement(PageLoading, { loading: true }));
  assert.match(markup, /class="loading-box page"/);
  assert.doesNotMatch(markup, /with-sidebar/);
  assert.doesNotMatch(markup, /--sidebar-w/);
  assert.match(markup, /--die-size:40px/);
});

test("PageLoading with a sidebar is offset by the sidebar width", () => {
  const markup = html(createElement(PageLoading, { loading: true, withSidebar: true }));
  assert.match(markup, /class="loading-box page with-sidebar"/);
  assert.match(markup, /--sidebar-w:260px/);
  assert.match(markup, /--die-size:40px/);
});

test("PageLoading renders nothing while not loading, with or without a sidebar", () => {
  assert.equal(html(createElement(PageLoading, { loading: false, withSidebar: true })), "");
});

test("access screens use the full-viewport PageLoading, not the in-card LoadingBox", async () => {
  const { readFileSync } = await import("node:fs");
  const files = [
    "src/app/sign/in/page.tsx",
    "src/app/sign/forgot-password/page.tsx",
    "src/app/sign/in/changePassword/index.tsx",
    "src/app/sign/up/page.tsx",
  ];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    assert.match(source, /<PageLoading loading=\{loading\} \/>/, file);
    assert.doesNotMatch(source, /LoadingBox/, file);
  }
});
