// Client-side checks of a transfer receipt before uploading it. The backend
// validates again (magic bytes); this only saves a round trip.
export const RECEIPT_ACCEPT = "application/pdf,image/png,image/jpeg,image/webp";
export const RECEIPT_MAX_BYTES = 10 * 1024 * 1024;
const RECEIPT_MIME_OK = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

type ReceiptFileLike = { name?: string; type?: string; size: number };

/** i18n id of the problem with the file, or null when it can be sent. */
export const receiptClientError = (file: ReceiptFileLike | null): string | null => {
  if (!file) return "contribution.upload.error.format";
  if (file.size > RECEIPT_MAX_BYTES) return "contribution.upload.error.size";
  const name = (file.name || "").toLowerCase();
  const type = (file.type || "").toLowerCase();
  if (
    type === "image/heic" ||
    type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  ) {
    return "contribution.upload.error.heic";
  }
  // Empty type is common on some Android picks; the backend sniffs magic bytes.
  if (type && !RECEIPT_MIME_OK.has(type)) {
    return "contribution.upload.error.format";
  }
  return null;
};
