"use client";
import { useCallback, useContext } from "react";
import { PageContext } from "@/context/page";
import { ItemContext } from "@/context/item";
import ItemXL from "@/components/item/item-grid/item-grid-ui/xl";
import clsx from "clsx";
import {
  resolveItemKind,
  cardKindBorderClass,
} from "@/components/badgeType/cardKind";

const ItemUI = () => {
  const { setMyItemsInMT_forWants } = useContext(PageContext) as {
    setMyItemsInMT_forWants: (updater: (old: any[]) => any[]) => void;
  };
  const { item } = useContext(ItemContext);
  const { id } = item;
  const cardKind = resolveItemKind(item);

  const onChangeValue = useCallback(
    (newValue: unknown) => {
      setMyItemsInMT_forWants((oldMyItemsInMT) => {
        const oldMyItemsInMTCopy = [...oldMyItemsInMT];
        const index = oldMyItemsInMTCopy.findIndex((w) => w.id === id);

        if (oldMyItemsInMTCopy[index]) {
          oldMyItemsInMTCopy[index].value = newValue;
        }
        return oldMyItemsInMTCopy;
      });
    },
    [setMyItemsInMT_forWants, id]
  );

  return (
    <div
      className={clsx(
        "rounded-lg shadow-xl w-full overflow-hidden",
        cardKindBorderClass(cardKind)
      )}
    >
      <ItemXL hideWant hideTags onChangeValue={onChangeValue} />
    </div>
  );
};

export default ItemUI;
