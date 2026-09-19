import { useCallback, useContext } from "react";
import { PageContext } from "@/context/page";
import { ItemContext } from "@/context/item";
import { LoadingBox } from "@/components/loading";
import ItemXL from "@/components/item/item-grid/item-grid-ui/xl";
import clsx from "clsx";
import {
  resolveCardKind,
  cardKindBorderClass,
} from "@/components/badgeType/cardKind";

const ItemUI = ({ wantGroup }) => {
  const { setMyWants } = useContext(PageContext) as {
    setMyWants: (updater: (old: any[]) => any[]) => void;
  };
  const { item, loadingItem } = useContext(ItemContext);
  const { isCombo, elements } = item;
  const typeNum = elements?.[0]?.element?.game?.type || 1;
  const cardKind = resolveCardKind({
    isCombo,
    isTrueNotGame: !isCombo && typeNum === 3,
    isExpansion: !isCombo && typeNum === 2,
  });

  const onChangeValue = useCallback(
    (newValue) => {
      setMyWants((oldMyWants) => {
        const oldMyWantsCopy = [...oldMyWants];
        const index = oldMyWantsCopy.findIndex((w) => w.id === wantGroup.id);
        if (oldMyWantsCopy[index]) {
          oldMyWantsCopy[index].value = newValue;
        }
        return oldMyWantsCopy;
      });
    },
    [setMyWants, wantGroup]
  );

  return (
    <>
      <div
        className={clsx(
          "w-full mb-2 rounded-lg",
          cardKindBorderClass(cardKind)
        )}
      >
        <ItemXL hideWant onChangeValue={onChangeValue} />
      </div>
      <LoadingBox loading={loadingItem} />
    </>
  );
};

export default ItemUI;
