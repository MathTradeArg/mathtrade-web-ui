import { useContext, useCallback, useState, useEffect, useMemo } from "react";
import { PageContext } from "@/context/page";
import useFetch from "@/hooks/useFetch";

const useReceivedItems = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const [itemData, setItemData] = useState(null);

  const toggleModal = useCallback(() => {
    setModalOpen((v) => !v);
  }, []);

  const [reloadData, set_reloadData] = useState(0);

  const setReloadData = useCallback(() => {
    set_reloadData((v) => v + 1);
  }, []);

  /* PAGE CONTEXT *****************************************/
  const { membership } = useContext(PageContext);
  /* end PAGE CONTEXT *****************************************/

  // GET RESULTS ********************************************
  const [getMathTradeResults, resultsRaw, loading, error] = useFetch({
    endpoint: "GET_MT_RESULTS",
    initialState: { results: [] },
  });

  useEffect(() => {
    if (membership && membership.user_id) {
      // Own trades are inherently bounded to one user's own entries - request
      // the max page size so they aren't silently truncated at the default (50).
      getMathTradeResults({
        params: { user: membership.user_id, page_size: 200 },
      });
    }
  }, [getMathTradeResults, membership, reloadData]);
  // end GET RESULTS ********************************************

  const results = useMemo(() => {
    return resultsRaw.results.map((result) => {
      const { received, item_from, id: idResult } = result;

      return {
        received,
        item_from,
        idResult,
      };
    });
  }, [resultsRaw]);

  const onOpenReceived = useCallback((itemData) => {
    setItemData(itemData);
    setModalOpen(true);
  }, []);

  return {
    results,
    loading,
    error,
    modalOpen,
    toggleModal,
    onOpenReceived,
    itemData,
    setItemData,
    setReloadData,
  };
};

export default useReceivedItems;
