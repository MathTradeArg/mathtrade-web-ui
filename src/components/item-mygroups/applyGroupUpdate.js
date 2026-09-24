// The backend keeps an item in at most one group of a membership: adding it
// to one removes it from the rest. Mirror that locally so a group PUT's
// response is enough to update every group, with no follow-up GET.
export const applyGroupUpdate = (myGroups, updatedGroup) => {
  if (!updatedGroup?.id) return myGroups;
  const moved = new Set(updatedGroup.item_ids);
  return myGroups.map((group) =>
    group.id === updatedGroup.id
      ? { ...group, ...updatedGroup }
      : {
          ...group,
          item_ids: group.item_ids.filter((id) => !moved.has(id)),
        }
  );
};
