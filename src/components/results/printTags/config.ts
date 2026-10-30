export const elementPerPage = 4;
export const dpi = 200;
const paddingMM = 5;
export const padding = Math.round((paddingMM * dpi) / 25.4);
// Design size of the printable area (A4 minus margins), in px at `dpi`.
// TagLabel lays out in these units; Page dpi converts "px" styles to paper.
export const canvasWidth = Math.round((210 * dpi) / 25.4) - 2 * padding;
export const canvasHeight = Math.round((297 * dpi) / 25.4) - 2 * padding;
// Big sets are split into several PDFs of at most this many pages
// (pagesPerPart * elementPerPage labels); only the selected part is built.
export const pagesPerPart = 50;
export const labelsPerPart = pagesPerPart * elementPerPage;
