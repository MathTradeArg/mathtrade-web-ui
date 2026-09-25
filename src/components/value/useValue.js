import { useMemo, useContext, useState, useEffect } from "react";
import { PageContext } from "@/context/page";
import { ItemContext } from "@/context/item";
import { GameContext } from "@/context/game";
import { TagContext } from "@/context/tag";
import { valueToColor } from "./utils";

// A group's score is the minimum of its items' (same as the backend's
// ItemGroup.add_value); `mixed` flags groups whose items diverged.
const groupScore = (group, myItemsInMT) => {
  const values = (myItemsInMT || [])
    .filter(({ id }) => group.item_ids.indexOf(id) >= 0)
    .map(({ value }) => value)
    .filter((v) => v !== null && v !== undefined);
  if (!values.length) return { value: 0, mixed: false };
  return {
    value: values.reduce((min, v) => Math.min(min, v), 10),
    mixed: new Set(values.map(Number)).size > 1,
  };
};

const useValue = (type, itemIds, currentValue, groupId) => {
  /* ITEM CONTEXT **************************/
  const { item } = useContext(ItemContext);
  /* end ITEM CONTEXT **************************/

  /* GAME CONTEXT **************************/
  const { game } = useContext(GameContext);
  /* end GAME CONTEXT **************************/

  /* TAG CONTEXT **************************/
  const { tag } = useContext(TagContext);
  /* end TAG CONTEXT **************************/

  /* PAGE CONTEXT **********************************************/
  const { myGroups, myItemsInMT, canI } = useContext(PageContext);

  /* end PAGE CONTEXT **************************/

  const [isOpen, setIsOpen] = useState(false);

  const [value, setValue] = useState(0);
  const [itemListId, setItemListId] = useState([]);
  const [mixed, setMixed] = useState(false);

  // An item in one of my groups takes the group's score and is edited from
  // the group (MAT-137). Items of other users are never in my groups.
  const lockedByGroup = useMemo(() => {
    if (type !== "item" || !item?.id) return null;
    return (myGroups || []).find((g) => g.item_ids.indexOf(item.id) >= 0) || null;
  }, [type, item, myGroups]);
  // const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // if (!isLoaded) {
    //setIsLoaded(true);
    if (type === "item") {
      const { id, value: valueItem } = item;
      if (lockedByGroup) {
        setValue(groupScore(lockedByGroup, myItemsInMT).value);
        setItemListId(lockedByGroup.item_ids);
      } else {
        setValue(valueItem || 0);
        setItemListId([id]);
      }
    }
    if (type === "game") {
      const { items, value: valueGame } = game;

      const { itemListId_game } = items.reduce(
        (obj, itm) => {
          const { id } = itm;
          obj.itemListId_game.push(id);
          return obj;
        },
        { itemListId_game: [] }
      );

      setValue(valueGame || 0);
      setItemListId(itemListId_game);
    }
    if (type === "tag") {
      setValue(parseFloat(tag.value || 0));

      setItemListId(tag.items || []);
    }
    if (type === "group") {
      const [group] = myGroups.filter(({ id }) => id === groupId);

      if (group) {
        setItemListId(group.item_ids);
        const score = groupScore(group, myItemsInMT);
        setValue(score.value);
        setMixed(score.mixed);
      }
    }
    if (type === "none") {
      setValue(parseFloat(currentValue || 0));
      setItemListId(itemIds || []);
    }

    //}
  }, [
    type,
    item,
    game,
    tag,
    itemIds,
    currentValue,
    groupId,
    myGroups,
    myItemsInMT,
    lockedByGroup,
  ]);

  const backgroundColor = useMemo(() => {
    return valueToColor(value);
  }, [value]);

  return {
    isOpen,
    setIsOpen,
    backgroundColor,
    value,
    setValue,
    itemListId,
    canIEdit: canI.offer || canI.want,
    lockedByGroup,
    mixed,
  };
};

export default useValue;
