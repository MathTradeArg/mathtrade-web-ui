// Replace a want in the loaded list with the backend's updated copy (full
// item data), or add it if it wasn't loaded yet (e.g. a tag created in this
// session). Never build partial item objects locally: cards rendered from
// them fail ("Este ejemplar se ha cargado de manera incorrecta").
export const replaceWant = (wants, updated) => {
  if (!updated?.id) return wants;
  const found = wants.some((w) => w.id === updated.id);
  return found
    ? wants.map((w) => (w.id === updated.id ? updated : w))
    : [...wants, updated];
};
