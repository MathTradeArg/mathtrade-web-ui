// Mirrors canvas fitLine: pick the largest font size from `size` down to
// `minSize` that fits `maxWidth`, and truncate with "…" at the minimum.
// Uses a throwaway 2d context only to measure — nothing is drawn.

let measureCtx: CanvasRenderingContext2D | null = null;

const ctx = () => {
  if (!measureCtx) {
    const canvas = document.createElement("canvas");
    measureCtx = canvas.getContext("2d");
    if (!measureCtx) throw new Error("2d context unavailable");
  }
  return measureCtx;
};

export type FittedLine = { text: string; fontSize: number };

export const fitLine = (
  text: string,
  maxWidth: number,
  size: number,
  minSize: number
): FittedLine => {
  const c = ctx();
  c.font = `${size}px Helvetica`;
  if (c.measureText(text).width <= maxWidth) {
    return { text, fontSize: size };
  }
  const fitted = Math.max(minSize, Math.floor((size * maxWidth) / c.measureText(text).width));
  c.font = `${fitted}px Helvetica`;
  if (c.measureText(text).width <= maxWidth) {
    return { text, fontSize: fitted };
  }
  let cut = text;
  while (cut.length > 1 && c.measureText(cut + "…").width > maxWidth) {
    cut = cut.slice(0, -1);
  }
  return { text: cut.trimEnd() + "…", fontSize: fitted };
};
