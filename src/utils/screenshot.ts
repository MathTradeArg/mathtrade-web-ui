import html2canvas from "html2canvas";

const TARGET_WIDTH = 1000;
// Same encode step useEditor.js already uses for collection photos
// (src/components/photoUploader/loader/useEditor.js) — just a different
// source canvas and a wider target (1000px vs. the 600px product-photo
// default), since this needs to stay legible as a full-page screenshot.
const JPEG_QUALITY = 0.8;

export const captureScreenshot = async (): Promise<string> => {
  const rawCanvas = await html2canvas(document.body, { logging: false });

  const scale = TARGET_WIDTH / rawCanvas.width;
  const targetHeight = Math.round(rawCanvas.height * scale);

  const resizedCanvas = document.createElement("canvas");
  resizedCanvas.width = TARGET_WIDTH;
  resizedCanvas.height = targetHeight;

  const ctx = resizedCanvas.getContext("2d");
  if (!ctx) return rawCanvas.toDataURL("image/jpeg", JPEG_QUALITY);

  ctx.drawImage(rawCanvas, 0, 0, TARGET_WIDTH, targetHeight);

  return resizedCanvas.toDataURL("image/jpeg", JPEG_QUALITY);
};
