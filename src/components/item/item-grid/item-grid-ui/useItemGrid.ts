import { useRef, useMemo, useContext, useCallback } from "react";
import { ItemContext } from "@/context/item";

type RawItemElement = {
  element?: {
    game?: {
      type?: number;
    };
  };
};

const useItemGrid = (
  expanded: string | number | null,
  setExpanded: (id: string | number | null) => void
) => {
  const { item } = useContext(ItemContext);
  const { id: itemId, isCombo, ban_id, elements } = item as {
    id: string | number;
    isCombo: boolean;
    ban_id?: string | number | null;
    elements?: RawItemElement[];
  };

  // ItemContext doesn't expose a flat typeNum (it only makes sense for a
  // non-combo item, which always has exactly one element) — derive it the
  // same way ElementContextProvider does, from that element's raw game type.
  const typeNum = elements?.[0]?.element?.game?.type || 1;

  const itemNode = useRef<HTMLElement | null>(null);

  const isExpanded = useMemo(() => {
    return expanded === itemId;
  }, [expanded, itemId]);

  const onToggleExpanse = useCallback(() => {
    if (isExpanded) {
      setExpanded(null);
      setTimeout(() => {
        itemNode.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 200);
    } else {
      setExpanded(itemId);
      setTimeout(() => {
        itemNode.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    }
  }, [isExpanded, setExpanded, itemId]);

  return {
    isCombo,
    typeNum,
    ban_id,
    itemNode,
    isExpanded,
    onToggleExpanse,
  };
};
export default useItemGrid;
