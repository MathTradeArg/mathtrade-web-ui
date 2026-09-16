"use client";
import { useContext } from "react";
import { ItemContext, ItemContextProvider } from "@/context/item";
import Previewer from "@/components/previewer";
import WantMiniCard from "@/components/want-components/mini-card";
import { resolveItemKind } from "@/components/badgeType/cardKind";

const ItemVisual2UI = () => {
  const { item } = useContext(ItemContext);
  if (!item) return null;
  const { id, title, elements, value, isCombo } = item;
  const typeNum = elements?.[0]?.element?.game?.type || 1;

  return (
    <WantMiniCard
      size="anchor"
      title={title}
      elements={[
        { thumbnail: elements?.[0]?.element?.thumbnail || "", name: title },
      ]}
      kind={resolveItemKind(item)}
      badgeType="item"
      badgeSubtype={typeNum}
      isCombo={isCombo}
      value={value}
      preview={
        <Previewer
          itemId={id}
          className="w-[18px] h-[18px] rounded-full bg-primary text-white flex items-center justify-center text-[10px]"
        />
      }
    />
  );
};

const ItemVisual2 = ({ itemRaw = null }) => {
  return (
    <ItemContextProvider itemRaw={itemRaw}>
      <ItemVisual2UI />
    </ItemContextProvider>
  );
};

export default ItemVisual2;
