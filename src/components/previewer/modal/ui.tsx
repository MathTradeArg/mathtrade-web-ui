"use client";
import { useContext } from "react";
import { ItemContext } from "@/context/item";
import ItemXL from "@/components/item/item-grid/item-grid-ui/xl";
import clsx from "clsx";
import {
  resolveItemKind,
  cardKindClass,
  cardSurfaceClass,
} from "@/components/badgeType/cardKind";

const ItemUI = () => {
  const { item } = useContext(ItemContext);
  const cardKind = resolveItemKind(item);

  return (
    <div
      className={clsx(
        "!shadow-xl overflow-hidden",
        cardSurfaceClass,
        cardKindClass(cardKind)
      )}
    >
      <ItemXL hideWant hideTags />
    </div>
  );
};

export default ItemUI;
