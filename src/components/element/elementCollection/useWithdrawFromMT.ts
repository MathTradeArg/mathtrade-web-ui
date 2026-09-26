import { useCallback, useContext } from "react";
import { PageContext } from "@/context/page";
import useFetch from "@/hooks/useFetch";

// Withdraw from this Math Trade the item that offers a collection element
// (the element stays in the ludoteca). Same endpoint and rules as
// "Retirar del Math Trade" in the offered items (item-header/useItemHeader).
const useWithdrawFromMT = (itemId?: number | null) => {
  const { forceReloadPage } = useContext(PageContext);

  const [deleteItemApi, , loading, error] = useFetch({
    endpoint: "DELETE_MYITEM",
    method: "DELETE",
    afterLoad: useCallback(() => forceReloadPage(), [forceReloadPage]),
  });

  const withdraw = useCallback(() => {
    if (itemId) deleteItemApi({ urlParams: [itemId] });
  }, [deleteItemApi, itemId]);

  return { withdraw, loading, error };
};

export default useWithdrawFromMT;
