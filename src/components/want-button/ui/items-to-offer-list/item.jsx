import { useCallback, useContext } from "react";
import { PageContext } from "@/context/page";
import { WantGroupContext } from "@/context/wantGroup";

import ItemXS from "@/components/item/xs";

const Item = ({ itemRaw }) => {
  /* PAGE CONTEXT **********************************************/
  const { canI } = useContext(PageContext);
  /* end PAGE CONTEXT */

  /* WANTGROUP CONTEXT **********************************************/
  const { itemsOfferList, setItemsOfferList } = useContext(WantGroupContext);
  /* end WANTGROUP CONTEXT **********************************************/

  const onChange = useCallback(
    ({ target }) => {
      setItemsOfferList((oldGroup) => {
        const oldGroupCopy = { ...oldGroup };
        oldGroupCopy[itemRaw?.id] = target.checked;
        return oldGroupCopy;
      });
    },
    [itemRaw, setItemsOfferList]
  );

  const checked = itemsOfferList[itemRaw?.id] || false;

  return (
    <ItemXS
      itemRaw={itemRaw}
      hideUser
      excluded={!checked}
      extraContent={
        <input
          type="checkbox"
          name={`item-${itemRaw?.id}`}
          checked={checked}
          onChange={onChange}
          disabled={!canI.want}
          className={!canI.want ? "cursor-not-allowed" : "cursor-pointer"}
        />
      }
    />
  );
};

export default Item;
