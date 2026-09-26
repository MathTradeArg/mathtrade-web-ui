// A want is shown in My wants when it still has a copy you could receive.
// Wanted items you ignore (the item, its game or its owner) come marked
// `ignored` by the backend: the export skips them, but the want keeps them
// (un-ignoring makes them count again), so a want whose copies are all
// ignored, or that has none left, is hidden instead of shown empty.
// Tags always show: a tag is a want from the moment it's created.
export const isVisibleWant = (want) =>
  want?.type === "tag" || (want?.wants || []).some((itm) => !itm.ignored);

export const visibleWants = (wants) => (wants || []).filter(isVisibleWant);
