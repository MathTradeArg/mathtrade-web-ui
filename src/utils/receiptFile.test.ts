import { test } from "node:test";
import assert from "node:assert/strict";
import { RECEIPT_MAX_BYTES, receiptClientError } from "./receiptFile.ts";

const file = (name: string, type: string, size = 1000) => ({ name, type, size });

test("rejects a missing file and anything over 10 MB", () => {
  assert.equal(receiptClientError(null), "contribution.upload.error.format");
  assert.equal(
    receiptClientError(file("a.pdf", "application/pdf", RECEIPT_MAX_BYTES + 1)),
    "contribution.upload.error.size"
  );
  assert.equal(receiptClientError(file("a.pdf", "application/pdf", RECEIPT_MAX_BYTES)), null);
});

test("rejects HEIC/HEIF by MIME type and by extension", () => {
  assert.equal(receiptClientError(file("a.jpg", "image/heic")), "contribution.upload.error.heic");
  assert.equal(receiptClientError(file("a.jpg", "image/heif")), "contribution.upload.error.heic");
  assert.equal(receiptClientError(file("FOTO.HEIC", "")), "contribution.upload.error.heic");
  assert.equal(receiptClientError(file("foto.heif", "")), "contribution.upload.error.heic");
});

test("rejects MIME types outside PDF, PNG, JPG and WebP", () => {
  assert.equal(receiptClientError(file("a.txt", "text/plain")), "contribution.upload.error.format");
  assert.equal(receiptClientError(file("a.gif", "image/gif")), "contribution.upload.error.format");
});

test("accepts the allowed types and an empty type (Android)", () => {
  for (const type of ["application/pdf", "image/png", "image/jpeg", "image/webp"]) {
    assert.equal(receiptClientError(file("a", type)), null);
  }
  assert.equal(receiptClientError(file("a.jpg", "")), null);
});
