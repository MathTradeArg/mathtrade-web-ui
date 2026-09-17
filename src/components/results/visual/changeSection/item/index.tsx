"use client";
import { useContext } from "react";
import { ItemContext, ItemContextProvider } from "@/context/item";
import { ResultsContext } from "@/context/results";
import I18N from "@/i18n";
import Chip from "@/components/chip";
import WantMiniCard from "@/components/want-components/mini-card";
import Previewer from "@/components/previewer";
import {
  resolveItemKind,
} from "@/components/badgeType/cardKind";

const ItemChangeUI = ({
  delivered = false,
  received = false,
}: {
  delivered?: boolean;
  received?: boolean;
}) => {
  const { item } = useContext(ItemContext);
  const { customMathtradeId } = useContext(ResultsContext);
  const { isCombo, elements, title } = item || {};
  const first = elements?.[0]?.element;
  const typeNum = first?.game?.type || 1;

  if (!item) {
    return null;
  }

  return (
    <div>
      <WantMiniCard
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
            className="w-7 h-7 rounded-full bg-primary text-white"
          />
        }
      />
      {received ? (
        <div className="mt-1.5">
          <Chip tone="want">
            <I18N id="received.already" />
          </Chip>
        </div>
      ) : null}
      {delivered ? (
        <div className="mt-1.5">
          <Chip tone="done">
            <I18N id="delivered.already" />
          </Chip>
        </div>
      ) : null}
    </div>
  );
};

const ItemChange = ({
  item = null,
  delivered = false,
  received = false,
}: {
  item?: any;
  delivered?: boolean;
  received?: boolean;
}) => {
  return item ? (
    <ItemContextProvider itemRaw={item}>
      <ItemChangeUI received={received} delivered={delivered} />
    </ItemContextProvider>
  ) : null;
};

export default ItemChange;
