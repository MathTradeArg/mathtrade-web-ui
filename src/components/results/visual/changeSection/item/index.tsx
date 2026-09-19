"use client";
import { useContext } from "react";
import { ItemContext, ItemContextProvider } from "@/context/item";
import { ResultsContext } from "@/context/results";
import WantMiniCard from "@/components/want-components/mini-card";
import Previewer from "@/components/previewer";
import {
  resolveItemKind,
} from "@/components/badgeType/cardKind";

const ItemChangeUI = () => {
  const { item } = useContext(ItemContext);
  const { customMathtradeId } = useContext(ResultsContext);
  const { isCombo, elements, title } = item || {};
  const first = elements?.[0]?.element;
  const typeNum = first?.game?.type || 1;

  if (!item) {
    return null;
  }

  return (
    <WantMiniCard
      fill
      title={title}
      elements={[
        { thumbnail: first?.thumbnail, name: first?.name || title },
      ]}
      kind={resolveItemKind(item)}
      badgeType="item"
      badgeSubtype={typeNum}
      isCombo={isCombo}
      preview={
        <Previewer
          customMathtradeId={customMathtradeId}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-white"
        />
      }
    />
  );
};

const ItemChange = ({ item = null }: { item?: any }) => {
  return item ? (
    <ItemContextProvider itemRaw={item}>
      <ItemChangeUI />
    </ItemContextProvider>
  ) : null;
};

export default ItemChange;
