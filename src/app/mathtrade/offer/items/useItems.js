import useFetch from "@/hooks/useFetch";
import { useCallback, useState, useContext, useEffect } from "react";
import { useOptions } from "@/store";
import { PageContext } from "@/context/page";

// My own tags/want-list are inherently bounded to one user's own entries,
// unlike a browsable list of everyone's items - request the max page size
// so they aren't silently truncated at the default page size (50).
const MY_OWN_DATA_PARAMS = { page_size: 200 };

const useItems = () => {
  /* PAGE CONTEXT **********************************************/
  const {
    reloadValue,
    items,
    setItems,
    setItemTags,
    setPageType,
    setMyWants,
    setLoadingMyWants,
    setFilterData,
  } = useContext(PageContext);

  useEffect(() => {
    setPageType("items");
  }, [setPageType]);
  /* end PAGE CONTEXT */

  /* FILTERS */
  const filters = useOptions((state) => state.filters_item);
  const updateFilters = useOptions((state) => state.updateFilters);
  /* end FILTERS */

  /* EXPANDED ITEM ******************************************/
  const [expandedItem, setExpandedItem] = useState(null);
  const beforeLoad = useCallback(() => {
    setExpandedItem(null);
  }, []);
  /* end EXPANDED ITEM */

  /* FETCH *************************************************/
  const [isLoaded, setIsLoaded] = useState(false);

  const afterLoad = useCallback(
    (newItems) => {
      setIsLoaded(true);
      const { results: list, count } = newItems;

      setItems({ list, count });
      //  setFilterData(newFilterData || {});
    },
    [setItems]
  );

  const afterError = useCallback(() => {
    updateFilters({ page: 1 }, "item");
  }, [updateFilters]);

  const [, , loading, error] = useFetch({
    endpoint: "GET_ITEMS_LIST",
    params: filters,
    autoLoad: true,
    initialState: { results: [] },
    beforeLoad,
    afterLoad,
    afterError,
    reloadValue,
  });
  /* end FETCH */

  /* FETCH FILTERS *************************************************/
  const afterLoadFilters = useCallback(
    (newFilterData) => {
      setFilterData(newFilterData || {});
    },
    [setFilterData]
  );
  useFetch({
    endpoint: "GET_FILTER_ITEMS",
    autoLoad: true,
    initialState: {},
    afterLoad: afterLoadFilters,
  });
  /* end FETCH FILTERS */

  /* ITEM TAGS *********************************************/
  const afterLoadItemTags = useCallback(
    ({ results }) => {
      const tags = results.map((tag, i) => {
        return {
          ...tag,
          id: `${tag?.id || i}`,
          itemsComplete: tag.items,
          items: tag.items.map(({ id }) => id),
        };
      });
      setItemTags(tags);
    },
    [setItemTags]
  );

  useFetch({
    endpoint: "MYTAGS",
    initialState: { results: [] },
    autoLoad: true,
    params: MY_OWN_DATA_PARAMS,
    afterLoad: afterLoadItemTags,
  });
  /* end ITEM TAGS *********************************************/

  /* MY WANTS *************************************************/
  const beforeLoadMyWants = useCallback(() => {
    setLoadingMyWants(true);
  }, [setLoadingMyWants]);
  const afterLoadMyWants = useCallback(
    ({ results }) => {
      setLoadingMyWants(false);
      setMyWants(results);
    },
    [setLoadingMyWants, setMyWants]
  );
  useFetch({
    endpoint: "MYWANTS",
    autoLoad: true,
    initialState: { results: [] },
    params: MY_OWN_DATA_PARAMS,
    beforeLoad: beforeLoadMyWants,
    afterLoad: afterLoadMyWants,
  });
  /* end MY WANTS */

  return {
    reloadValue,
    isLoaded,
    items,
    expandedItem,
    setExpandedItem,
    loading,
    error,
  };
};
export default useItems;
