import { useCallback, useContext, useMemo, useState } from "react";
import { PageContext } from "@/context/page";
import useFetch from "@/hooks/useFetch";
import { normalizeString } from "@/utils";
import { applyGroupUpdate } from "../applyGroupUpdate";

const useGroupItemsPicker = ({ group, onClose }) => {
  const { myItemsInMT, myGroups, setMyGroups } = useContext(PageContext);

  const [selected, setSelected] = useState(() => new Set(group.item_ids));
  const [keyword, setKeyword] = useState("");

  // Which other group each item is in now (one group per item).
  const otherGroupByItem = useMemo(() => {
    const byItem = {};
    myGroups.forEach((g) => {
      if (g.id === group.id) return;
      g.item_ids.forEach((itemId) => {
        byItem[itemId] = g;
      });
    });
    return byItem;
  }, [myGroups, group.id]);

  const items = useMemo(() => {
    const keyLow = normalizeString(keyword);
    return (myItemsInMT || []).filter(
      (item) => !keyLow || normalizeString(item.title || "").indexOf(keyLow) >= 0
    );
  }, [myItemsInMT, keyword]);

  const toggle = useCallback((itemId) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  // One PUT with the whole list; apply the response locally (no reload).
  const afterLoad = useCallback(
    (updatedGroup) => {
      setMyGroups((groups) => applyGroupUpdate(groups, updatedGroup));
      onClose();
    },
    [setMyGroups, onClose]
  );

  const [putGroup, , saving, error] = useFetch({
    endpoint: "PUT_MYITEM_GROUPS",
    method: "PUT",
    afterLoad,
  });

  const save = useCallback(() => {
    putGroup({
      urlParams: [group.id],
      params: {
        name: group.name,
        color: group.color,
        item_ids: [...selected],
      },
    });
  }, [putGroup, group, selected]);

  const changed = useMemo(() => {
    const original = new Set(group.item_ids);
    if (original.size !== selected.size) return true;
    return [...selected].some((id) => !original.has(id));
  }, [group.item_ids, selected]);

  return {
    items,
    keyword,
    setKeyword,
    selected,
    toggle,
    otherGroupByItem,
    save,
    saving,
    error,
    changed,
  };
};

export default useGroupItemsPicker;
